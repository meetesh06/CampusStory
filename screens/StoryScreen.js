/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  StatusBar,
  BackHandler,
  ActivityIndicator,
  Easing,
  Dimensions,
  TouchableOpacity,
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
          // const {
          //   componentId
          // } = this.props;
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
          //   Animated.timing(this.opacity, {
          //     toValue: 1,
          //     duration: 200
          //   })
          // ]).start();
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
      // onPanResponderTerminate: (evt, gestureState) => {
      //   if (gestureState.dy / HEIGHT * 100 > 30) {
      //     Animated.timing(
      //       this.opacity,
      //       {
      //         toValue: 0,
      //         easing: Easing.cubic,
      //         duration: 300
      //       }
      //     ).start(() => {
      //       Navigation.dismissOverlay(componentId);
      //     });
      //   } else {
      //     Animated.spring(
      //       this.opacity,
      //       {
      //         toValue: 1,
      //         friction: 4
      //       }
      //     ).start();
      //   }
      // },
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
      const d = new Date();
      d.setDate(d.getDate() - 1);
      d.setHours(0,0,0,0);
      const Activity = realm.objects('Activity').filtered('timestamp > $0', d).filtered(`channel="${_id}"`).sorted('timestamp', true);
      const readActivity = Activity.filtered('read="true"').sorted('timestamp', true);
      const unreadActivity = Activity.filtered('read="false"').sorted('timestamp', true);
      const channel = realm.objects('Channels').filtered(`_id="${_id}"`);
      processRealmObj(channel, (channelResult) => {
        realm.write(() => {
          realm.create('Channels', { _id, updates: 'false' }, true);
        });
        let Final;
        processRealmObj(readActivity, (result1) => {
          const res1 = result1.slice(0, 15);
          processRealmObj(unreadActivity, (result2) => {
            Final = result2.concat(res1);
            const current = (0 + (result2.length - 1)) > 0 ? 0 + (result2.length - 1) : 0;
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

  gotoChannel = (item) => {
    const {
      stories,
      current
    } = this.state;
    const currentObj = stories[current];
    if (currentObj === undefined) return;
    const {
      _id
    } = currentObj;
    new SessionStore().publishVisits(item.channel, _id);
    Navigation.showModal({
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
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View
              style={{
                justifyContent: 'center',
                textAlign: 'right',
                padding: 5,
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
                  fontSize: 14,
                  color: '#333'
                }}
              >
                {this.state.stories.length - this.state.current}/{this.state.stories.length}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
}

export default StoryScreen;
