/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ScrollView,
  FlatList,
  StatusBar,
  AsyncStorage,
  View,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import firebase from 'react-native-firebase';
// import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import Constants from '../constants';
import EventCard from '../components/EventCard';
import EventCardBig from '../components/EventCardBig';
import StoryIcon from '../components/StoryIcon';
import Realm from '../realm';
import Spotlight from '../components/Spotlight';
import InformationCard from '../components/InformationCard';
import { processRealmObj } from './helpers/functions';

const { TOKEN, INTERESTS } = Constants;
const WIDTH = Dimensions.get('window').width;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleEventPress = this.handleEventPress.bind(this);
    this.handleStoryPress = this.handleStoryPress.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateLists = this.updateLists.bind(this);
    this.fetchEventsFromRealm = this.fetchEventsFromRealm.bind(this);
    this.fetchChannelsFromRealm = this.fetchChannelsFromRealm.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
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
    newUpdates: false
  }

  async componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
    const interests = await AsyncStorage.getItem(INTERESTS);
    const {
      updateContent,
      handleStoryOpenNotification,
      handleEventOpenNotification,
      fetchEventsFromRealm,
      fetchChannelsFromRealm
    } = this;
    fetchEventsFromRealm();
    fetchChannelsFromRealm();
    // checkForChanges();
    this.setState({ interests: interests.split(',') });
    if (!firebase.messaging().hasPermission()) {
      await firebase.messaging().requestPermission();
    }
    this.notificationDisplayedListener = firebase
      .notifications().onNotificationDisplayed((notification) => {
        console.log(notification);
      });
    this.notificationListener = firebase
      .notifications().onNotification((notification) => {
        console.log(notification);
      });
    this.messageListener = firebase
      .messaging().onMessage((message) => {
        // eslint-disable-next-line no-underscore-dangle
        if (message._data.type === 'post') {
          this.setState({ newUpdates: true });
        }
      });
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      // const { action } = notificationOpen;
      // Get information about the notification that was opened
      const { notification } = notificationOpen;
      const { _data } = notification;
      const data = JSON.parse(_data.content);
      const { _id, type } = data;
      // console.log(notification);
      // Alert.alert(JSON.stringify(`${type} ${_id}`));
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

  updateLists = async (lastUpdated, channelsList) => {
    axios.post('https://www.mycampusdock.com/events/user/get-event-list', { last_updated: lastUpdated }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': await AsyncStorage.getItem(TOKEN)
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
        if (this.props.first) this.fetchEventsFromRealm();
        else this.setState({ newUpdates: true });
      }
    }).catch(err => console.log(err));

    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('channels_list', JSON.stringify(channelsList));

    axios.post('https://www.mycampusdock.com/channels/fetch-activity-list', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': await AsyncStorage.getItem(TOKEN)
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
                if (this.props.first) this.fetchChannelsFromRealm();
                else this.setState({ newUpdates: true });
              }
            }
          );
        });
      }
    }).catch(err => console.log(err));
  }

  fetchEventsFromRealm = async () => {
    // const { processRealmObj } = this;
    let interests = await AsyncStorage.getItem(INTERESTS);
    interests = interests.split(',');
    Realm.getRealm((realm) => {
      const Events = realm.objects('Events').sorted('timestamp', true);
      const ts = Date.parse(new Date()) + (7 * 24 * 60 * 60 * 1000);
      const cs = Date.parse(new Date());
      interests.forEach((value) => {
        const current = Events.filtered(`ms > ${cs}`).filtered('going="false"').filtered(`category="${value}"`).sorted('date', true);
        processRealmObj(current, (result) => {
          console.log(value, result);
          this.setState({ [value]: result });
        });
      });
      const latestEvents = realm.objects('Events').filtered('going = "false"').filtered(`ms > ${cs}`).sorted('date', true);
      const weekEvents = realm.objects('Events').filtered('going = "false"').filtered(`ms < ${ts} AND ms > ${cs}`).sorted('date', true);
      processRealmObj(latestEvents, (result) => {
        this.setState({ eventList: result });
      });
      processRealmObj(weekEvents, (result) => {
        this.setState({ weekEventList: result });
      });
    });
  }

  fetchChannelsFromRealm = async () => {
    // const { processRealmObj } = this;
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('channel="true"');
      processRealmObj(Subs, (result) => {
        const final = [];
        result.forEach((value) => {
          const { _id } = value;
          const current = realm.objects('Channels').filtered(`_id="${_id}"`);
          final.push(current[0]);
        });
        processRealmObj(final, (channels) => {
          this.setState({ channels });
        });
      });
    });
  }

  checkForChanges = async () => {
    const {
      // processRealmObj,
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
      const Subs = realm.objects('Firebase').filtered('channel="true"');
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
    await updateLists(lastUpdated, subList);
  }

  updateContent = async () => {
    this.setState({ refreshing: true });
    const {
      fetchEventsFromRealm,
      fetchChannelsFromRealm,
      checkForChanges
    } = this;
    await fetchEventsFromRealm();
    await fetchChannelsFromRealm();
    await checkForChanges();
    this.setState({ refreshing: false, newUpdates: false });
  }

  handleEventOpenNotification = (_id) => {
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        Navigation.showModal({
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
    // const { componentId } = this.props;
    const { _id } = item;
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        Navigation.showModal({
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
              // customTransition: {
              //   animations: [
              //     {
              //       type: 'sharedElement',
              //       fromId: 'image1',
              //       toId: 'image2',
              //       startDelay: 0,
              //       springVelocity: 0.2,
              //       duration: 10
              //     }
              //   ],
              //   duration: 0.8
              // }
            }
          }
        });
      });
    });
  }

  handleStoryOpenNotification = (_id) => {
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
      <View
        style={{
          flex: 1,
        }}
      >
      <StatusBar barStyle="light-content" translucent />
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={updateContent}
            />
          )}
        >
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
                        title="Discover Channels"
                        content="You can watch stories from your subscribed channels here. Explore for more channels."
                        icon={(
                          <FastImage
                            style={{
                              width: 80,
                              height: 60,
                              alignSelf: 'center'
                            }}
                            // eslint-disable-next-line global-require
                            source={require('../media/app-bar/logo.png')}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        )}
                        style_card={{ backgroundColor: '#e0e0e0' }}
                        style_title={{ color: '#444' }}
                        style_content={{ color: '#444', }}
                      />
                      )
                  }
          <Swiper
            showsButtons={false}
            autoplay
            loop = {false}
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
                  onPress={this.handleEventPress}
                />
              ))
            }
          </Swiper>
          {
              interests.map(value => (
                <View key={value}>
                  { this.state[value] !== undefined && this.state[value].length > 0
                    && (
                    <View>
                      <Text style={{
                        marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10
                      }}
                      >
                        {value.toUpperCase()}
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

        </ScrollView>
        {
          this.state.newUpdates && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              borderRadius: 75,
              left: 0,
              right: 0,
              justifyContent: 'center'
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
      </View>
    );
  }
}
export default Home;
