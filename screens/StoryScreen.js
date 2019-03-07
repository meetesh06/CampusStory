/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Alert,
  View,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import ReactionButton from '../components/ReactionButton';
import Realm from '../realm';
import { processRealmObj, timelapse } from './helpers/functions';
import SessionStore from '../SessionStore';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import urls from '../URLS';
import axios from 'axios'
import constants from '../constants';

const STORY_THRESHOLD = constants.STORY_THRESHOLD;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.opacity = new Animated.Value(1);
    this.updateRead = this.updateRead.bind(true);
    this.topHeight = new Animated.Value(HEIGHT);

    // eslint-disable-next-line no-underscore-dangle
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          pan
        } = this.state;
        if (gestureState.dy > 0) {
          this.opacity.setValue(1 - gestureState.dy / HEIGHT);
          pan.setValue({ y: gestureState.dy });
        }
        return true;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (((gestureState.dy / HEIGHT) * 100) > 30) {
          this.closeWithAnimation();
        } else {
          const {
            pan
          } = this.state;
          Animated.parallel([
            Animated.spring(pan, {
              toValue: 0,
              friction: 10
            }),
            Animated.timing(this.opacity, {
              toValue: 1,
              duration: 200
            })
          ]).start();
        }
        const {
          current,
          stories
        } = this.state;

        if (gestureState.x0 > 0 && gestureState.x0 < WIDTH / 3) {
          if(this.props.online){
            if (current === 0){
              console.log('END BACKWARD');
            }
            else {
              console.log('BACKWARD');
              this.setState({ current: current - 1 });
            }
          } else {
            if (current === stories.length - 1){
              console.log('END BACKWARD');
            }
            else {
              console.log('BACKWARD');
              this.setState({ current: current + 1 });
            }
          }
        } else if (gestureState.x0 > (WIDTH * 2) / 3) {
          if(this.props.online){
            if (current === stories.length - 1) {
              console.log('END');
              this.updateRead(()=>{
                this.closeWithAnimation();
              });
            }
            else{
              this.setState({ current: current + 1 }, ()=>{
                this.updateRead(()=>{
                  console.log('FORWARD');
                });
              });
            }
          } else {
            if (current === 0) {
              console.log('END');
              this.updateRead(()=>{
                this.closeWithAnimation();
              });
            }
            else{
              this.setState({ current: current - 1 }, ()=>{
                this.updateRead(()=>{
                  console.log('FORWARD');
                });
              });
            }
          }
        } else if (gestureState.dx < 5, gestureState.dy < 5) {
          console.log('TAP FORWARD');
          this.tapped(this.props.online);
        }
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  state = {
    stories: [],
    current: 0,
    channel: { media: '"xxx"' },
    loading: true,
    pan: new Animated.ValueXY()
  }

  closeWithAnimation = () =>{
    const {
      componentId
    } = this.props;
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT + this.topHeight._value,
        duration: 200,
        friction: 7
      }),
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 200
      })
    ]).start();
    setTimeout(() => Navigation.dismissOverlay(componentId), 180);
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: 0,
        friction: 10
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 200
      })
    ]).start(() => {
      if(this.props.online){
        this.setState({
          current : 0,
          stories: this.props.data,
          loading: false,
          channel: this.props.channel_data
        }, () => this.updateRead(()=>{
          
        }));
      } else {
        this.fetchOrderedStories(()=>{

        });
      }
    });
  }

  fetchOrderedStories = (callback) =>{
    const { _id } = this.props;
    Realm.getRealm((realm) => {
      const d = new Date(new Date().getTime() - ( STORY_THRESHOLD * 24  * 3600 * 1000));
      const Activity = realm.objects('Activity').filtered('timestamp > $0', d).filtered(`channel="${_id}"`).sorted('timestamp', true);
      console.log(Activity, Activity[0]);
      const unreadActivity = Activity.filtered(`read!=${true}`).sorted('timestamp', true);
      const readActivity = Activity.filtered(`read=${true}`).sorted('timestamp', true);
      const channel = realm.objects('Channels').filtered(`_id="${_id}"`);
      processRealmObj(channel, (channelResult) => {
        realm.write(() => {
          realm.create('Channels', { _id, updates: false}, true);
        });
        let Final;
        processRealmObj(readActivity, (result1) => {
          processRealmObj(unreadActivity, (result2) => {
            Final = result2.concat(result1);
            let current;
            if(result2.length === 0){ /* NO NEW UPDATE */
              if(result1.length === 0){ /* NO OLD DATA */
                current = 0;
              } else {
                current = Final.length - 1;
              }
            } else {
              current = (0 + (result2.length - 1)) > 0 ? 0 + (result2.length - 1) : 0;
            }
            this.setState({
              current,
              stories: Final,
              loading: false,
              channel: channelResult[0]
            }, () => this.updateRead(()=>{
              return callback();
            }));
          });
        });
      });
    });
  }

  fetch_event_data = async (_id, token) =>{
    axios.post(urls.FETCH_EVENT_DATA, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then((response) => {
      const responseObj = response.data;
      if (!responseObj.error) {
        Realm.getRealm((realm) => {
          const el = responseObj.data[0];
          realm.write(() => {
            const current = realm.objects('Events').filtered(`_id="${_id}"`);
            realm.delete(current);
            el.reach = JSON.stringify(el.reach);
            el.views = JSON.stringify(el.views);
            el.enrollees = JSON.stringify(el.enrollees);
            el.name = JSON.stringify(el.name);
            el.audience = JSON.stringify(el.audience);
            el.media = JSON.stringify(el.media);
            el.timestamp = new Date(el.timestamp);
            el.time = new Date(el.time);
            el.ms = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            /* MISSING */
            try {
              realm.create('Events', el, true);
              this.navigateEvent(el, _id);
            } catch (e) {
              console.log(e);
            }
          });
        });
      }
    }).catch((err)=>{
      console.log(err);
      new SessionStore().pushLogs({type : 'error', line : 210, file : 'StoryScreen.js', err : err});
    });
  }

  navigateEvent = (item, id) =>{
    Navigation.showOverlay({
      component: {
        name: 'Event Detail Screen',
        passProps: {
          item,
          id
        },
        options: {
          modalPresentationStyle: 'overCurrentContext',
          topBar: {
            animate: true,
            visible: true,
            drawBehind: false,
            title: {
              text: id,
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
    Navigation.dismissOverlay(this.props.componentId);
  }

  navigateTag = (hashtag) =>{
    Navigation.showOverlay({
      component: {
        name: 'Show Tag Screen',
        passProps: {
          hashtag
        },
        options: {
          modalPresentationStyle: 'overCurrentContext',
          topBar: {
            animate: true,
            visible: true,
            drawBehind: false,
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true
          },
        }
      }
    });
    Navigation.dismissOverlay(this.props.componentId);
  }

  gotoEvent = (_id) =>{
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, async (result) => {
        if(result.length > 0) this.navigateEvent(result[0], _id);
        else{
          this.navigateEvent({_id, media : '["xxx"]', dummy : true}, _id);
        }
      });
    });
    this.action_taken();
  }

  action_taken = () =>{
    const _id = this.state.stories[this.state.current]._id;
    axios.post(urls.UPDATE_ACTION_TAKEN, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(constants.TOKEN)
      }
    }).then((response) => {
      console.log(response);
    });
  }

  channel_visit = () =>{
    const _id = this.state.stories[this.state.current]._id;
    axios.post(urls.UPDATE_CHANNEL_VISITS, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(constants.TOKEN)
      }
    }).then((response) => {
      console.log(response);
    }).catch((e)=>{
      console.log(e)
    });
  }

  tapped = (online) => {
    const {current, stories} = this.state;
    if(online){
      if (current === stories.length - 1){
        this.updateRead(()=>{
          this.closeWithAnimation();
        });
      }else this.setState({ current : current + 1 }, ()=>{
        this.updateRead(()=>{
          /* READ */
        });
      });
    } else {
      if (current === 0){
        this.updateRead(()=>{
          this.closeWithAnimation();
        });
      }else this.setState({ current: current - 1 }, ()=>{
        this.updateRead(()=>{
          /* READ */
        });
      });
    }
  }

  updateRead = (callback) => {
    const{online} = this.props;
    if(online) return callback();
    const {
      stories,
      channel,
      current
    } = this.state;
    const currentObj = stories[current];
    if (currentObj === undefined) return callback();
    const {
      _id
    } = currentObj;

    const store = new SessionStore();
    store.pushUpdate(_id);
    store.pushViews(channel._id, _id);
    console.log('Updating Read');
    Realm.getRealm((realm) => {
      realm.write(() => {
        realm.create('Activity', { _id, read: true }, true);
        return callback();
      });
    });
  }

  gotoTag = (tag) =>{
    this.navigateTag(tag);
    this.action_taken();
  }

  gotoChannel = (item) => {
    const {
      stories,
      current
    } = this.state;
    const currentObj = stories[current];
    let _id;
    if (currentObj === undefined){
      _id = '';
    }
    else {
      _id = currentObj._id;
      this.channel_visit();
    }
    Navigation.showOverlay({
      component: {
        name: 'Channel Detail Screen',
        passProps: {
          id: item.channel
        },
        options: {
          bottomTabs: {
            animate: true,
            drawBehind: false,
            visible: false
          },
          topBar: {
            title: {
              text: item.channel_name
            },
            visible: true
          }
        }
      }
    });
    const {
      componentId
    } = this.props;
    Navigation.dismissOverlay(componentId);
  }

  gotoLink = (link)=>{
    Navigation.dismissOverlay(this.props.componentId);
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Event Register',
            passProps: {
              uri: link,
            },
            options: {
              topBar: {
                visible: false
              }
            }
          }
        }]
      }
    });
    this.action_taken();
  }

  handleReport = ()=>{
    Alert.alert(
      'Report this Story',
      'Any abusive content on the story? Are you sure you want to report this story?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Report', onPress: () => this.reportStory()},
      ]
    );
  }

  reportStory = () =>{
    /* REPORT SOMETHING */
    Alert.alert(
      'Story Reported',
      'We have flagged this story as a report from you and we will look into it if it does not follow our content guidelines we will remove it as soon as possible.',
    );
  }

  render() {
    const {
      loading,
      stories,
      current,
      channel,
      pan
    } = this.state;
    const {online} = this.props;
    console.log(stories[current]);
    const [translateY] = [pan.y];
    return (
      <Animated.View
        style={{
          top: this.topHeight,
          width: WIDTH,
          height: HEIGHT,
          borderRadius: this.radius,
          overflow: 'hidden',
          justifyContent: 'center',
          opacity: this.opacity,
          backgroundColor: '#000000',
          transform: [{ translateY }]
        }}
      >
        <StatusBar barStyle="light-content" hidden />
        {
          loading
          && <ActivityIndicator size="small" color="#fff" />
        }
        {
            !loading && stories.length === 0
            && (
            <View>
              <Text style={{ textAlign: 'center', color: '#fff' }}> Sorry there are no new stories yet! </Text>
            </View>
            )
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post'
          && <Post key={stories[current]._id} data={stories[current]} />
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post-image' && (
          <PostImage
            key={stories[current]._id}
            message={stories[current].message}
            _id = {stories[current]._id}
            image={online ?  stories[current].media[0] : JSON.parse(stories[current].media)[0]}
          />
          )
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post-video'
            && (
              <PostVideo
                key={stories[current]._id}
                _id = {stories[current]._id}
                message={stories[current].message}
                video={stories[current].media}
              />
            )
        }

        <View
          style={{
            flex: 1,
            height: HEIGHT,
            width: WIDTH,
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            position: 'absolute'
          }}
        >
          <View
            collapsable={false}
            style={{
              width: WIDTH,
            }}
            {...this._panResponder.panHandlers}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: 18,
            left: 0,
            width: '100%'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <TouchableOpacity onPress={() => this.gotoChannel({ channel: channel._id, channel_name: channel.name })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginTop: 5 }}>
              <FastImage
                style={{
                  width: 36, height: 36, borderRadius: 20
                }}
                source={{ uri:  encodeURI(urls.PREFIX + '/' +  `${JSON.parse(channel.media)[0]}`) }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={{ fontSize: 14, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold' }} > {channel.name} </Text>
              {stories !== null && stories !== undefined && stories[current] !== undefined &&<Text style={{fontSize : 13, color : '#dfdfdf'}}>{online ? timelapse(new Date(stories[current].timestamp)) :timelapse(stories[current].timestamp)}</Text>}
              {stories[current] !== undefined && stories[current].read !== true && !online && <Text style={{fontSize : 13, color : '#ccc',}}>{'  •  New'}</Text>}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            { !loading &&
              <View
                style={{
                  justifyContent: 'center',
                  textAlign: 'right',
                  padding: 4,
                  paddingLeft : 8,
                  paddingRight : 8,
                  marginRight: 12,
                  backgroundColor: '#ffffff99',
                  borderRadius: 20
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    alignSelf: 'center',
                    fontSize: 15,
                    color: '#222'
                  }}
                >
                
                  {online ? (current + 1) : (stories.length - current)}
                  {'/'}
                  {stories.length}
                </Text>
              </View>
            }    
          </View>
        </View>
      {
          stories[current] !== undefined && stories[current].event &&
          <TouchableOpacity 
            style={{
              position : 'absolute',
              bottom : 10, 
              alignSelf : 'center', 
              padding : 15, 
              paddingRight : 50, 
              paddingLeft : 50, 
              justifyContent : 'center', 
              alignItems : 'center'
            }} 
            onPress = {()=>this.gotoEvent(stories[current].event)}
            >
            <IconIon name = 'ios-arrow-dropup-circle' color = '#fff' size = {25} />
            <Text style = {{color : '#fff', fontSize : 12, textAlign : 'center'}}>Visit Event</Text>
          </TouchableOpacity>
      }

      {
          stories[current] !== undefined && stories[current].hashtag &&
          <TouchableOpacity 
            style={{
              position : 'absolute',
              bottom : 10, 
              alignSelf : 'center', 
              padding : 15, 
              paddingRight : 50, 
              paddingLeft : 50, 
              justifyContent : 'center', 
              alignItems : 'center'
            }} 
            onPress = {()=>this.gotoTag(stories[current].hashtag)}
            >
            <IconIon name = 'ios-arrow-dropup-circle' color = '#fff' size = {25}/>
            <Text style = {{color : '#fff', fontSize : 12, textAlign : 'center'}}>View Hashtag</Text>
          </TouchableOpacity>
      }

      {
          stories[current] !== undefined && stories[current].url &&
          <TouchableOpacity 
            style={{
              position : 'absolute',
              bottom : 10, 
              alignSelf : 'center', 
              padding : 15, 
              paddingRight : 50, 
              paddingLeft : 50, 
              justifyContent : 'center',
              alignItems : 'center'
            }} 
            onPress = {()=>this.gotoLink(stories[current].url)}
            >
            <IconIon name = 'ios-arrow-dropup-circle' color = '#fff' size = {25}/>
            <Text style = {{color : '#fff', fontSize : 12, textAlign : 'center'}}>Visit Link</Text>
          </TouchableOpacity>
      }
      { stories[current] !== undefined &&
        <View style={{position : 'absolute', bottom : 20, right : 15,}}>
          <ReactionButton index = {current} _id = {stories[current]._id} reactions = {stories[current].reactions} my_reactions = { online ? stories[current].my_reactions : JSON.parse(stories[current].my_reactions)} data = {stories[current].reaction_type} online = {online} />
        </View>
      }
      { stories[current] !== undefined &&
        <TouchableOpacity activeOpacity = {0.7} onPress = {this.handleReport} style={{position : 'absolute', bottom : 20, left : 15, backgroundColor : 'rgba(255, 255, 255, 0.3)', padding : 5, borderRadius : 50 }}>
          <IconMaterial name = 'report' size = {25} color = '#fff' />
        </TouchableOpacity>
      }
      </Animated.View>
    );
  }
}

export default StoryScreen;
