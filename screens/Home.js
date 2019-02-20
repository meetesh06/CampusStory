/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
import React from 'react';
import {
  TouchableOpacity,
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
    this.handleEventPress = this.handleEventPress.bind(this);
    this.handleEventPressSpotlight = this.handleEventPressSpotlight.bind(this);
    this.handleStoryPress = this.handleStoryPress.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateLists = this.updateLists.bind(this);
    this.fetchEventsFromRealm = this.fetchEventsFromRealm.bind(this);
    this.fetchChannelsFromRealm = this.fetchChannelsFromRealm.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
    this.handleStoryOpenNotification = this.handleStoryOpenNotification.bind(this);
    
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
    volume : 0
  }

  componentDidMount() {
    this.updateContent();
    this.checkPermission();
    this.fetchTrendingEvents();
  }

  fetchTrendingEvents = () =>{
    axios.post(urls.FETCH_TRENDING_EVENTS, {}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
        if(!response.data.error){
          this.setState({weekEventList : response.data.data});
        }
    }).catch(e=>{
      new SessionStore().pushLogs({type : 'error', line : 84, file : 'Home.js', err : e});
    });
  }

  checkPermission = async () => {
    const store = new SessionStore();
    const enabled = await firebase.messaging().hasPermission();

    if (!enabled) {
      console.log('REQUESTING PERMISSION');
      try {
        await firebase.messaging().requestPermission();
        console.log('PERMISSION GRANTED');
        const config = store.getValue(CONFIG);
        config.firebase_enabled = true;
        const fcmToken = await firebase.messaging().getToken();
        config.firebase_token = fcmToken;
        config.platform = Platform.OS === 'android' ? 'android' : 'ios';
        store.putValue(CONFIG, config);
      } catch (error) {
        console.log('PERMISSION DENIED');
        const config = store.getValue(CONFIG);
        config.firebase_enabled = false;
        config.platform = Platform.OS === 'android' ? 'android' : 'ios';
        store.putValue(CONFIG, config);
      }
    } else {
      const config = store.getValue(CONFIG);
      config.firebase_enabled = true;
      const fcmToken = await firebase.messaging().getToken();
      config.firebase_token = fcmToken;
      config.platform = Platform.OS === 'android' ? 'android' : 'ios';
      store.putValue(CONFIG, config);
    }
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

  updateLists = (lastUpdated, channelsList, should_not_update) => {
    axios.post(urls.GET_EVENT_LIST, { last_updated: lastUpdated }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if (!response.data.error) {
        response.data.data.forEach((el) => {
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
          el.enrollees = JSON.stringify(el.enrollees);
          el.name = JSON.stringify(el.name);
          el.audience = JSON.stringify(el.audience);
          el.media = JSON.stringify(el.media);
          el.timestamp = new Date(el.timestamp);
          el.time = new Date(el.time);
          const ts = Date.parse(`${el.date}`);
          el.date = new Date(el.date);
          el.ms = ts;
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.interested = 'false';
          el.going = 'false';
          el.remind = 'false';
        });
        const responseObject = response.data;
        const { data } = responseObject;
        if (data.length === 0) return this.setState({ refreshing: false, newUpdates: false });;
        Realm.getRealm((realm) => {
          realm.write(() => {
            let i;
            for (i = 0; i < data.length; i += 1) {
              try {
                realm.create('Events', data[i], !should_not_update);
              } catch (e) {
                console.log(e);
              }
            }
          });
        });
        if (this.props.first) {
          this.setState({ refreshing: false, newUpdates: false });
          this.fetchEventsFromRealm();
        } else {
          this.setState({ refreshing: false, newUpdates: true });
        }
      } else {
        this.setState({ refreshing: false });
      }
    }).catch(err => {
      this.setState({ refreshing: false });
      new SessionStore().pushLogs({type : 'error', line : 235, file : 'Home.js', err : err});
    });

    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('channels_list', JSON.stringify(channelsList));

    axios.post(urls.FETCH_ACTIVITY_LIST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      const responseObject = response.data;
      if (!responseObject.error) {
        Realm.getRealm((realm) => {
          Object.entries(responseObject.data).forEach(
            ([key, value]) => {
              const { data } = value;
              if (data.length > 0) {
                data.forEach((el) => {
                  el.reach = JSON.stringify(el.reach);
                  el.views = JSON.stringify(el.views);
                  el.audience = JSON.stringify(el.audience);
                  el.timestamp = new Date(el.timestamp);
                  el.poll_type = el.poll_type === undefined ? '' : el.poll_type;
                  el.options = JSON.stringify(el.options === undefined ? '' : el.options);
                  el.answered = el.answered === undefined ? '' : el.answered;
                  if (el.type === 'post-video') { el.media = el.media; } else { el.media = JSON.stringify(el.media === undefined ? '' : el.media); }
                  el.name = JSON.stringify(el.name);
                  el.read = 'false';
                });
                realm.write(() => {
                  let i;
                  for (i = 0; i < data.length; i += 1) {
                    try {
                      realm.create('Activity', data[i], true);
                    } catch (e) {
                      console.log(e);
                    }
                  }
                  // TODO HERE
                  //  make a logic to update the purecomponent based on shouldupdate
                  realm.create('Channels', { _id: key, updates: 'true' }, true);
                });
                this.fetchChannelsFromRealm();
              }
            }
          );
        });
      }
    }).catch(err => {
      console.log(err);
      new SessionStore().pushLogs({type : 'error', line : 84, file : 'GoindDetails.js', err : err});
    });
  }

  fetchEventsFromRealm = () => {
    let interests = new SessionStore().getValue(INTERESTS);
    interests = interests.split(',');

    Realm.getRealm((realm) => {
      const Events = realm.objects('Events').sorted('timestamp', true);
      const ts = Date.parse(new Date()) + (7 * 24 * 60 * 60 * 1000);
      const cs = Date.parse(new Date());
      const final = {};
      interests.forEach((value) => {
        const current = Events.filtered(`ms > ${cs}`).filtered('going="false"').filtered(`category="${value}"`).sorted('date', true);
        processRealmObj(current, (result) => {
          final[value] = result;
        });
      });
      const latestEvents = realm.objects('Events').filtered('going = "false"').filtered(`ms > ${cs}`).sorted('date', true);
      processRealmObj(latestEvents, (result) => {
        this.setState({ eventList: result, ...final });
      });
    });
  }

  fetchChannelsFromRealm = () => {
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('type="channel"');
      processRealmObj(Subs, (result) => {
        const final = [];
        const Channels = realm.objects('Channels').sorted('updates');
        result.forEach((value) => {
          const { _id } = value;
          const current = Channels.filtered(`_id="${_id}"`);
          if (current[0].updates === 'true') final.unshift(current[0]);
          else final.push(current[0]);
        });
        processRealmObj(final, (channels) => {
          this.setState({ channels });
        });
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
      });
    });
    const is_first_time = new SessionStore().getValue(Constants.FIRST_TIME);
    if(is_first_time) new SessionStore().putValue(Constants.FIRST_TIME, false);
    updateLists(lastUpdated, subList, is_first_time);
  }

  updateContent = () => {
    this.setState({ refreshing: true });
    const {
      fetchEventsFromRealm,
      fetchChannelsFromRealm,
      checkForChanges
    } = this;
    fetchEventsFromRealm();
    fetchChannelsFromRealm();
    checkForChanges();
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

  handleEventPress = (item) => {
    const { _id } = item;
    new SessionStore().pushTrack({type : 'open_event', event : _id});
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        if(result.length >0)
        Navigation.showOverlay({
          component: {
            name: 'Event Detail Screen',
            passProps: {
              item: result[0],
              id: result[0].title
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
  }

  handleEventPressSpotlight = (item) => {
    const { _id } = item;
    new SessionStore().pushTrack({type : 'SPOT_OPEN', event : _id});
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        if (result.length === 0) {
          Navigation.showOverlay({
            component: {
              name: 'Event Detail Screen',
              passProps: {
                item: { ...item, date: new Date(item.date), media: JSON.stringify(item.media) },
                id: item.title
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
                id: result[0].title
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
    if (old[index].updates === 'true') {
      old[index].updates = 'false';
      this.setState({ channels: old });
    }
  }

  componentDidAppear() {
    this.fetchChannelsFromRealm();
    this.fetchEventsFromRealm();
    this.setState({ newUpdates: false });
    this.checkForChanges();
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
            onRefresh={updateContent}
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
        {/* <Text style={{color : '#fff', fontSize : 20}}>{this.state.volume} </Text> */}
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
              content="You can watch stories from your subscribed channels here. Explore for more channels."
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
                loop={false}
                showsPagination={false}
                loadMinimal
                style={{ backgroundColor: '#333', height: 250 }}
                autoplayTimeout={5}
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
          showsHorizontalScrollIndicator={false}
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
        {
          this.state.newUpdates && (
            <View
              style={{
                flex: 1,
                position: 'absolute',
                top: 20,
                left: 0,
                right: 0
              }}
            >
              <TouchableOpacity
                style={{
                  width: 100,
                  alignSelf: 'center',
                  padding: 10,
                  borderRadius: 50,
                  backgroundColor: '#4475c4',
                }}
                disabled={refreshing}
                onPress={updateContent}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: '#fff',
                    textAlign: 'center'
                  }}
                >
                  NEW UPDATES
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
    );
  }
}
export default Home;
