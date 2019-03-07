/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
import React from 'react';
import {
  Platform,
  Dimensions,
  RefreshControl,
  ScrollView,
  FlatList,
  StatusBar,
  View,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import EventCard from '../components/EventCard';
import EventCardBig from '../components/EventCardBig';
import StoryIcon from '../components/StoryIcon';
import Realm from '../realm';
import Spotlight from '../components/Spotlight';
import InformationCard from '../components/InformationCard';
import { processRealmObj, getCategoryName, shuffleArray } from './helpers/functions';
import urls from '../URLS';

const { TOKEN, INTERESTS, CONFIG } = Constants;
const WIDTH = Dimensions.get('window').width;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    eventList: [],
    interests: [],
    weekEventList: [],
    channels: [
      { media: '' }
    ],
    eventsToday: [
    ],
    eventsChannels: [],
    refreshing: false,
    newUpdates: false,
    CAN_OPEN_EVENT : true,
    volume : 0
  }

  componentDidMount() {
    this.checkNotifications();
    this.callBackgroundRefresh();
  }

  callBackgroundRefresh = ()=>{
    this.setState({refreshing : true});
    this.fetchEventsNetwork(()=>{
      this.fetchEventsFromRealm(()=>{
        this.fetchStoriesFromNetwork(()=>{
          this.fetchChannelsFromRealm(()=>{
            this.fetchTrendingEvents(()=>{
              this.setState({refreshing : false});
            });
          });
        });
      });
    });
  }

  fetchTrendingEvents = (callback) =>{
    axios.post(urls.FETCH_TRENDING_EVENTS, {}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
        if(!response.data.error){
          this.setState({weekEventList : response.data.data});
          callback();
        } else {
          callback();
        }
    }).catch(e=>{
      new SessionStore().pushLogs({type : 'error', line : 83, file : 'Home.js', err : e});
      callback();
    });
  }

  checkNotifications = async () => {
    const store = new SessionStore();
    this.navigationEventListener = Navigation.events().bindComponent(this);
    const interests = store.getValue(INTERESTS);
    const {
      updateContent,
      handleStoryOpenNotification,
      handleEventOpenNotification
    } = this;
    
    shuffleArray(interests.split(','), value => this.setState({ interests: value }));

    this.notificationDisplayedListener = firebase
      .notifications().onNotificationDisplayed((notification) => {
        console.log(notification);
      });

    this.notificationListener = firebase
      .notifications().onNotification((notification) => {
        if(notification._data.type !== 'event') {
          const data = JSON.parse(notification._data.content);
          // Build a channel
          const channel = new firebase.notifications.Android.Channel('default-channel', 'Default Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('Campus Story Default channel');
          // Create the channel
          firebase.notifications().android.createChannel(channel);
          const noti = new firebase.notifications.Notification()
            .setNotificationId('default-channel')
            .setTitle('New Updates In College')
            .setBody(data.message);
          noti.android.setChannelId('default-channel');
          noti.android.setSmallIcon('ic_notification');
          firebase.notifications().displayNotification(noti);
        }
      });

    this.messageListener = firebase
      .messaging().onMessage((message) => {
        // eslint-disable-next-line no-underscore-dangle
        const {
          _data
        } = message;
        if (_data.type === 'post') {
          this.setState({ newUpdates: true });
        }
      });
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { notification } = notificationOpen;
      const { _data } = notification;
      const data = JSON.parse(_data.content);
      const { _id, type } = data;
      await updateContent();
      switch (type) {
        case 'post':
        case 'poll':
        case 'post-image':
        case 'post-video':
          handleStoryOpenNotification(data.channel);
          break;
        default:
          handleEventOpenNotification(_id);
      }
    }
  }

  fetchStoriesFromNetwork = (callback) =>{
    const subList = {}
    Realm.getRealm((realm)=>{
      const Subs = realm.objects('Firebase').filtered('type="channel"');
      processRealmObj(Subs, (result) => {
        result.forEach((value) => {
          const { _id } = value;
          const activity = realm.objects('Activity').filtered(`channel="${_id}"`).sorted('timestamp', true);
          let timestamp = 'NIL';
          if (activity.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            timestamp = activity[0].timestamp;
          }
          // eslint-disable-next-line no-underscore-dangle
          subList[_id] = timestamp;
        });
      });
    });

    const formData = new FormData();
    formData.append('channels_list', JSON.stringify(subList));

    axios.post(urls.FETCH_ACTIVITY_LIST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      const responseObject = response.data;
      if (!responseObject.error) {
        console.log(responseObject);
        Realm.getRealm((realm) => {
          Object.entries(responseObject.data).forEach(
            ([key, value]) => {
              const { data } = value;
              if (data.length > 0) {
                data.forEach((el) => {
                  el.reach = JSON.stringify(el.reach);
                  el.views = JSON.stringify(el.views);
                  el.reactions = JSON.stringify(el.reactions);
                  el.my_reactions = JSON.stringify(el.my_reactions);
                  el.audience = JSON.stringify(el.audience);
                  el.timestamp = new Date(el.timestamp);
                  if (el.type === 'post-video') { el.media = el.media; } else { el.media = JSON.stringify(el.media === undefined ? '' : el.media); }
                  el.read = false;
                });
                realm.write(() => {
                  let update = false;
                  for (let i = 0; i < data.length; i += 1) {
                    try {
                      realm.create('Activity', data[i]); 
                      update = true; /* PROCEED ONLY IF HAVE UPDATE */
                      console.log('Creating New');
                    } catch (e) {
                      try {
                        activity = realm.objects('Activity').filtered(`_id="${data[i]._id}"`);
                        data[i].read = activity[0].read;
                        realm.create('Activity', data[i], true); 
                        console.log('Updating Old');
                      } catch(e){
                        console.log('ERR', e);
                      }
                    }
                  }
                  if(update) realm.create('Channels', { _id: key, updates: true }, true);
                });
                callback();
              } else {
                callback();
              }
            });
        });
      } else {
        callback();
      }
    }).catch(err => {
      console.log(err);
      callback();
    });
  }

  fetchEventsFromRealm = (callback) => {
    let interests = new SessionStore().getValue(INTERESTS);
    interests = interests.split(',');

    Realm.getRealm((realm) => {
      const Events = realm.objects('Events').sorted('timestamp', true);
      const cs = Date.parse(new Date());
      const final = {};
      interests.forEach((value) => {
        const current = Events.filtered(`ms > ${cs}`).filtered(`going!=${true}`).filtered(`category="${value}"`).sorted('date');
        processRealmObj(current, (result) => {
          final[value] = result;
        });
      });

      const latestEvents = realm.objects('Events').filtered(`going!=${true}`).filtered(`ms > ${cs}`).sorted('date', true);
      processRealmObj(latestEvents, (result) => {
        const keys = Object.keys(final);
        for(let i=0; i<keys.length; i++){
          const cat = keys[i];
          const array = final[cat];
          for(let j=0; j<array.length; j++){
            const pos = result.map(function(x) {return x._id; }).indexOf(array[j]._id);
            if(pos !== -1) result.splice(pos, 1);
          }
        }
        this.setState({ eventList: result, ...final });
        callback();
      });
    });
  }

  fetchChannelsFromRealm = (callback) => {
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('type="channel"');
      processRealmObj(Subs, (result) => {
        const final = [];
        const Channels = realm.objects('Channels').sorted('updates');
        result.forEach((value) => {
          const { _id } = value;
          const current = Channels.filtered(`_id="${_id}"`);
          if (current[0].updates) final.unshift(current[0]);
          else final.push(current[0]);
        });
        processRealmObj(final, (channels) => {
          this.setState({ channels });
          callback();
        });
      });
    });
  }

  fetchEventsNetwork = (callback)=>{
    let lastUpdated = 'EMPTY';
    Realm.getRealm((realm) => {
      const Events = realm.objects('Events').sorted('timestamp', true);
      try {
        lastUpdated = Events[0].timestamp ? Events[0].timestamp : 'STATIC';
      } catch (e) {
        lastUpdated = 'NONE';
      }
      const form = new FormData();
      form.append('last_updated', lastUpdated);
      form.append('dummy', 'dummy');
      axios.post(urls.GET_EVENT_LIST, form , {
        headers: {
          'x-access-token': new SessionStore().getValue(TOKEN)
        }
      }).then((response) => {
        if (!response.data.error) {
          response.data.data.forEach((el) => {
            el.reach = JSON.stringify(el.reach);
            el.views = JSON.stringify(el.views);
            el.enrollees = JSON.stringify(el.enrollees);
            el.audience = JSON.stringify(el.audience);
            el.media = JSON.stringify(el.media);
            el.timestamp = new Date(el.timestamp);
            el.time = new Date(el.time);
            el.ms = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
          });
          const responseObject = response.data;
          const { data } = responseObject;
          if (data.length === 0) return;
          Realm.getRealm((realm) => {
            realm.write(() => {
              let i;
              for (i = 0; i < data.length; i += 1) {
                try {
                  realm.create('Events', data[i], true);
                } catch (e) {
                  console.log(e);
                }
              }
            });
          });
          callback();
        } else {
          callback();
        }
      }).catch(err => {
        console.log(err);
        callback();
      });
    });
  }

  checkForChanges = () => {
    const {
      updateLists
    } = this;
    let lastUpdated;
    const subList = {};
    Realm.getRealm((realm) => {
      const Events = realm.objects('Events').sorted('timestamp', true);
      try {
        lastUpdated = Events[0].timestamp;
      } catch (e) {
        lastUpdated = 'NONE';
      }
      const Subs = realm.objects('Firebase').filtered('type="channel"');
      processRealmObj(Subs, (result) => {
        result.forEach((value) => {
          const { _id } = value;
          const activity = realm.objects('Activity').filtered(`channel="${_id}"`).sorted('timestamp', true);
          let timestamp = 'NIL';
          if (activity.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            timestamp = activity[0].timestamp;
          }
          // eslint-disable-next-line no-underscore-dangle
          subList[_id] = timestamp;
        });
        const is_first_time = new SessionStore().getValue(Constants.FIRST_TIME);
        if(is_first_time) new SessionStore().putValue(Constants.FIRST_TIME, false);
        updateLists(lastUpdated, subList, is_first_time);
      });
    });
  }

  handleEventOpenNotification = (_id) => {
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        Navigation.showOverlay({
          component: {
            name: 'Event Detail Screen',
            passProps: {
              item: result[0],
              id: result[0].title
            },
            options: {
              topBar: {
                animate: true,
                visible: true,
                drawBehind: false,
                title: {
                  text: result[0].title,
                },
              },
              bottomTabs: {
                visible: false,
                drawBehind: true,
                animate: true
              }
            }
          }
        });
      });
    });
  }

  onEventClose = () =>{
    this.setState({CAN_OPEN_EVENT : true});
  }

  handleEventPress = (item) => {
    if(this.state.CAN_OPEN_EVENT){
      const { _id } = item;
      this.setState({CAN_OPEN_EVENT : false});
      Realm.getRealm((realm) => {
        const current = realm.objects('Events').filtered(`_id="${_id}"`);
        processRealmObj(current, (result) => {
          if(result.length >0)
          Navigation.showOverlay({
            component: {
              name: 'Event Detail Screen',
              passProps: {
                item: result[0],
                id: result[0].title,
                onClose : this.onEventClose
              },
              options: {
                modalPresentationStyle: 'overCurrentContext',
                topBar: {
                  animate: true,
                  visible: true,
                  drawBehind: false,
                  title: {
                    text: result[0].title,
                  },
                },
                bottomTabs: {
                  visible: false,
                  drawBehind: true,
                  animate: true
                },
              }
            }
          });
        });
      });
      new SessionStore().pushTrack({type : 'open_event', event : _id});
    }
  }

  handleEventPressSpotlight = (item) => {
    if(this.state.CAN_OPEN_EVENT){
      const { _id } = item;
      this.setState({CAN_OPEN_EVENT : false});
      Realm.getRealm((realm) => {
        const current = realm.objects('Events').filtered(`_id="${_id}"`);
        processRealmObj(current, (result) => {
          if (result.length === 0) {
            Navigation.showOverlay({
              component: {
                name: 'Event Detail Screen',
                passProps: {
                  item: { ...item, date: new Date(item.date), media: JSON.stringify(item.media) },
                  id: item.title,
                  onClose : this.onEventClose
                },
                options: {
                  modalPresentationStyle: 'overCurrentContext',
                  topBar: {
                    animate: true,
                    visible: true,
                    drawBehind: false,
                    title: {
                      text: item.title,
                    },
                  },
                  bottomTabs: {
                    visible: false,
                    drawBehind: true,
                    animate: true
                  },
                }
              }
            });
          } else {
            Navigation.showOverlay({
              component: {
                name: 'Event Detail Screen',
                passProps: {
                  item: result[0],
                  id: result[0].title,
                  onClose : this.onEventClose
                },
                options: {
                  modalPresentationStyle: 'overCurrentContext',
                  topBar: {
                    animate: true,
                    visible: true,
                    drawBehind: false,
                    title: {
                      text: result[0].title,
                    },
                  },
                  bottomTabs: {
                    visible: false,
                    drawBehind: true,
                    animate: true
                  },
                }
              }
            });
          }
        });
      });
      new SessionStore().pushTrack({type : 'SPOT_OPEN', event : _id});
    }
  }

  handleStoryOpenNotification = (_id) => {
    new SessionStore().pushTrack({type : 'STORY_OPEN_NOTI', _id});
    Navigation.showOverlay({
      component: {
        name: 'Story Screen',
        passProps: { _id },
        options: {
          overlay: {
            interceptTouchOutside: false
          }
        }
      }
    });
  }

  handleStoryPress = (item, index) => {
    const { channels } = this.state;
    const { _id } = item;
    const old = [...channels];
    new SessionStore().pushTrack({type : 'STORY_VIEW', _id});
    Navigation.showOverlay({
      component: {
        name: 'Story Screen',
        passProps: { _id },
        options: {
          overlay: {
            interceptTouchOutside: false
          }
        }
      }
    });
    if (old[index].updates) {
      old[index].updates = false;
      this.setState({ channels: old });
    }
  }

  render() {
    const {
      refreshing,
      channels,
      weekEventList,
      interests,
      eventList
    } = this.state;
    const { updateContent } = this;
    return (
      <ScrollView
        showsVerticalScrollIndicator = {false}
        style={{
          backgroundColor: '#333'
        }}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.callBackgroundRefresh}
          />
        )}
      >
        {
          Platform.OS === 'ios'
          && (<StatusBar barStyle="light-content" translucent />)
        }
        {
          channels.length !== 0
            && (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                data={channels}
                extraData={channels}
                renderItem={({ item, index }) => (
                  <StoryIcon
                    onPress={obj => this.handleStoryPress(obj, index)}
                    width={96}
                    height={64}
                    item={item}
                  />
                )}
              />
            )
        }
        {
          channels.length === 0
          && (
            <InformationCard
              touchable
              onPress={
                () => {
                  Navigation.mergeOptions(this.props.componentId, {
                    bottomTabs: {
                      currentTabIndex: 1
                    }
                  });
                }
              }
              title="Discover Channels"
              content="You can watch stories from your subscribed channels here. Tap to explore more channels."
              icon={(
                <FastImage
                  style={{
                    margin: 10,
                    width: 40,
                    height: 40,
                    opacity: 0.8,
                    alignSelf: 'center'
                  }}
                  // eslint-disable-next-line global-require
                  source={require('../media/LogoWhite.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              style_card={{ backgroundColor: '#555' }}
              style_title={{ color: '#d0d0d0' }}
              style_content={{ color: '#c0c0c0', }}
            />
          )
        }
        {
          weekEventList !== undefined
          && weekEventList.length > 0
          && (
            <View>
              <Swiper
                showsButtons={false}
                autoplay
                loop={true}
                loadMinimal
                loadMinimalSize = {5}
                paginationStyle = {{ position : 'absolute', bottom : 0,}}
                dotStyle = {{top : 0}}
                dot = {<View style={{backgroundColor:'#444', width: 10, height: 4,borderRadius: 2, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                activeDot = {<View style={{backgroundColor: '#FF6A16', width: 10, height: 4, borderRadius: 2, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                style={{ backgroundColor: '#222', height: 250 }}
                autoplayTimeout={7}
              >
                {
                  weekEventList !== undefined
                  // eslint-disable-next-line no-underscore-dangle
                  && weekEventList.map(item => (
                    <Spotlight
                      item={item}
                      // eslint-disable-next-line no-underscore-dangle
                      key={item._id}
                      onPress={this.handleEventPressSpotlight}
                    />
                  ))
                }
              </Swiper>
              <Text
                style={{
                  marginTop: 10,
                  left: 0,
                  right: 0,
                  position: 'absolute',
                  fontFamily: 'Roboto',
                  color: 'white',
                  fontSize: 25,
                  textAlign: 'center',
                  fontWeight: '300'
                }}
              >
                In the Spotlight
              </Text>
            </View>
          )
        }
        {
          interests.map(value => (
            <View key={value}>
              { this.state[value] !== undefined && this.state[value].length > 1
                && (
                  <View>
                    <Text style={{
                      color: '#f0f0f0',
                      marginTop: 8,
                      marginBottom: 8,
                      textAlign: 'center',
                      fontFamily: 'Roboto-Light',
                      fontSize: 20,
                      marginLeft: 10
                    }}
                    >
                      {getCategoryName(value)}
                    </Text>
                    <FlatList horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item, index) => `${index}`} data={this.state[value]} renderItem={({ item }) => <EventCard onPress={this.handleEventPress} width={200} height={150} item={item} />} />
                  </View>
                )}
            </View>
          ))
        }
        <FlatList
          horizontal={false}
          keyExtractor={(item, index) => `${index}`}
          data={eventList}
          renderItem={({ item }) => (
            <EventCardBig
              onPress={this.handleEventPress}
              width={WIDTH - 20}
              height={(WIDTH - 20) * 0.75}
              item={item}
            />
          )
          }
        />
      </ScrollView>
    );
  }
}
export default Home;
