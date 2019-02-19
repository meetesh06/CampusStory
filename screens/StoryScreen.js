/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  StatusBar,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  PanResponder,
  View,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import Constants from '../constants';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import Realm from '../realm';
import { processRealmObj, timelapse } from './helpers/functions';
import SessionStore from '../SessionStore';
import IconIon from 'react-native-vector-icons/Ionicons';
import urls from '../URLS';
import axios from 'axios'

const { MUTED, } = Constants;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.opacity = new Animated.Value(1);
    this.updateRead = this.updateRead.bind(true);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.topHeight = new Animated.Value(HEIGHT);

    const {
      componentId
    } = props;
    // eslint-disable-next-line no-underscore-dangle
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        console.log('GRANT')
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log('TOUCH')
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
        console.log('TOUCH END')
        if (((gestureState.dy / HEIGHT) * 100) > 30) {
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
        if (gestureState.x0 > 0 && gestureState.x0 < WIDTH / 4) {
          if (current === stories.length - 1) console.log('DO NOTHING')
          else this.setState({ current: current + 1 }, () => this.updateRead());
        } else if (gestureState.x0 > (WIDTH * 3) / 4) {
          if (current === 0)this.close();
          else this.setState({ current: current - 1 });
        // eslint-disable-next-line no-sequences
        } else if (gestureState.dx < 5, gestureState.dy < 5) {
          this.tapped();
        }
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  state = {
    stories: [],
    current: 0,
    channel: { media: '""' },
    loading: true,
    muted: new SessionStore().getValue(MUTED),
    pan: new Animated.ValueXY()
  }

  async componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: 0,
        friction: 10
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 200
      })
    ]).start();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    const { _id } = this.props;
    Realm.getRealm((realm) => {
      const d = new Date(new Date().getTime() - (24  * 3600 * 1000)); /* LAST 24 HOURS */
      const Activity = realm.objects('Activity').filtered('timestamp > $0', d).filtered(`channel="${_id}"`).sorted('timestamp', true);
      const unreadActivity = Activity.filtered('read="false"').sorted('timestamp', true);
      const readActivity = Activity.filtered('read="true"').sorted('timestamp', true);
      const channel = realm.objects('Channels').filtered(`_id="${_id}"`);
      processRealmObj(channel, (channelResult) => {
        realm.write(() => {
          realm.create('Channels', { _id, updates: 'false' }, true);
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
            }, () => this.updateRead());
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
      console.log('Something', responseObj);
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
            const ts = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            el.ms = ts;
            el.reg_end = new Date(el.reg_end);
            el.reg_start = new Date(el.reg_start);
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

  navigateTag = (tag) =>{
    console.log(tag);
    Navigation.showOverlay({
      component: {
        name: 'Show Tag Screen',
        passProps: {
          tag
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
        console.log(result);
        if(result.length > 0) this.navigateEvent(result[0], _id);
        else{
          console.log('TRYING');
          this.navigateEvent({_id, media : '["xxx"]', dummy : true}, _id);
        }
      });
    });
  }

  async componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  tapped = () => {
    const {
      muted
    } = this.state;
    new SessionStore().putValue(MUTED, !muted);
    this.setState({ muted: !muted });
  }

  updateRead = () => {
    const {
      stories,
      current
    } = this.state;
    const currentObj = stories[current];
    if (currentObj === undefined) return;
    const {
      _id
    } = currentObj;
    const store = new SessionStore();
    store.pushUpdate(_id);
    store.pushViews(this.state.channel._id, _id);
    Realm.getRealm((realm) => {
      realm.write(() => {
        realm.create('Activity', { _id, read: 'true' }, true);
      });
    });
  }

  gotoTag = (tag) =>{
    console.log('Tag', tag);
    this.navigateTag(tag);
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
      new SessionStore().publishVisits(item.channel, _id);
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
            drawBehind: true,
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

  close = () => {
    const {
      componentId
    } = this.props;
    Navigation.dismissOverlay(componentId);
  }

  handleBackButtonClick() {
    this.close();
    return true;
  }

  render() {
    const {
      loading,
      stories,
      current,
      muted,
      pan
    } = this.state;
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
          && <Post thumb={false} key={stories[current]._id} message={stories[current].message} />
        }
        {
          stories.length > 0
          && stories[current] !== undefined
          && stories[current].type === 'post-image' && (
          <PostImage
            key={stories[current]._id}
            message={stories[current].message}
            image={JSON.parse(stories[current].media)[0]}
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
                message={stories[current].message}
                video={stories[current].media}
                muted={muted}
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
            <TouchableOpacity onPress={() => this.gotoChannel({ channel: this.state.channel._id, channel_name: this.state.channel.name })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginTop: 5 }}>
              <FastImage
                style={{
                  width: 36, height: 36, borderRadius: 20
                }}
                source={{ uri: `https://www.mycampusdock.com/${JSON.parse(this.state.channel.media)[0]}` }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={{ fontSize: 14, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold' }} > {this.state.channel.name} </Text>
              {this.state.stories !== null && this.state.stories !== undefined && this.state.stories[current] !== undefined &&<Text style={{fontSize : 13, color : '#dfdfdf'}}>{timelapse(this.state.stories[current].timestamp)}</Text>}
              {stories[current] !== undefined && stories[current].read !== 'true' && <Text style={{fontSize : 13, color : '#ccc',}}>{'  •  New'}</Text>}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
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
                {this.state.stories.length - this.state.current}/{this.state.stories.length}
              </Text>
            </View>
          </View>
        </View>
      {
          stories[current] !== undefined && stories[current].event_link !== null && stories[current].tag === null && 
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
            onPress = {()=>this.gotoEvent(stories[current].event_link)}
            >
            <IconIon name = 'ios-arrow-dropup-circle' color = '#fff' size = {25} />
            <Text style = {{color : '#ddd', fontSize : 12, textAlign : 'center'}}>Visit Event</Text>
          </TouchableOpacity>
      }

      {
          stories[current] !== undefined && stories[current].tag !== null && stories[current].event_link === null && 
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
            onPress = {()=>this.gotoTag(stories[current].tag)}
            >
            <IconIon name = 'ios-arrow-dropup-circle' color = '#fff' size = {25}/>
            <Text style = {{color : '#ddd', fontSize : 12, textAlign : 'center'}}>View Hashtag</Text>
          </TouchableOpacity>
      }
      </Animated.View>
    );
  }
}

export default StoryScreen;
