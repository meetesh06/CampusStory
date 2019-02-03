/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  Platform,
  BackHandler,
  ActivityIndicator,
  Easing,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  AsyncStorage,
  View,
  Text
} from 'react-native';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import Constants from '../constants';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import Realm from '../realm';
import { processRealmObj } from './helpers/functions';

const { TOKEN } = Constants;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.opacity = new Animated.Value(1);
    this.height = new Animated.Value(HEIGHT);
    this.width = new Animated.Value(WIDTH);
    this.radius = new Animated.Value(0);
    this.updateRead = this.updateRead.bind(true);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.toUpdate = [];
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
        if (gestureState.dy > 0) {
          this.opacity.setValue(1 - gestureState.dy / HEIGHT);
        }
        if (Platform.OS === 'android') {
          if (gestureState.vy > 0.4) {
            return Navigation.dismissOverlay(componentId);
          }
        }
        return true;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy / HEIGHT * 100 > 30) {
          Animated.timing(
            this.opacity,
            {
              toValue: 0,
              easing: Easing.cubic,
              duration: 300
            }
          ).start(() => {
            Navigation.dismissOverlay(componentId);
          });
        } else {
          Animated.spring(
            this.opacity,
            {
              toValue: 1,
              friction: 5
            }
          ).start();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        if (gestureState.dy / HEIGHT * 100 > 30) {
          Animated.timing(
            this.opacity,
            {
              toValue: 0,
              easing: Easing.cubic,
              duration: 300
            }
          ).start(() => {
            Navigation.dismissOverlay(componentId);
          });
        } else {
          Animated.spring(
            this.opacity,
            {
              toValue: 1,
              friction: 5
            }
          ).start();
        }
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  state = {
    stories: [],
    current: 0,
    loading: true
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  async componentDidMount() {
    const { _id } = this.props;
    Realm.getRealm((realm) => {
      const Final = realm.objects('Activity').filtered(`channel="${_id}"`).sorted('timestamp', true);
      realm.write(() => {
        realm.create('Channels', { _id, updates: 'false' }, true);
      });
      processRealmObj(Final, (result) => {
        this.setState({ stories: result, loading: false }, () => this.updateRead());
      });
    });
  }

  async componentWillUnmount() {
    console.log(this.toUpdate);
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('activity_list', JSON.stringify(this.toUpdate));
    axios.post('https://www.mycampusdock.com/channels/update-read', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': await AsyncStorage.getItem(TOKEN)
      }
    }).then((response) => {
      console.log(response);
    }).catch(err => console.log(err));
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
    this.toUpdate.push(_id);
    Realm.getRealm((realm) => {
      realm.write(() => {
        realm.create('Activity', { _id, read: 'true' }, true);
      });
    });
  }

  handleBackButtonClick() {
    const {
      componentId
    } = this.props;
    Navigation.dismissOverlay(componentId);
    return true;
  }

  render() {
    const {
      loading,
      stories,
      current
    } = this.state;
    return (
      <Animated.View
        style={[this.position.getLayout(), {
          width: this.width,
          height: this.height,
          borderRadius: this.radius,
          overflow: 'hidden',
          justifyContent: 'center',
          opacity: this.opacity,
          backgroundColor: '#000000'
        }]}
      >
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
          && stories[current].type === 'post'
          && <Post key={stories[current]._id} message={stories[current].message} />
        }
        {
          stories.length > 0
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
          && stories[current].type === 'post-video'
            && (
              <PostVideo
                key={stories[current]._id}
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
          <TouchableOpacity
            onPress={
              () => {
                if (current === 0) return;
                this.setState({ current: current - 1 });
              }
            }
            style={{
              flex: 1,
            }}
          />
          <View
            collapsable={false}
            style={{
              width: WIDTH / 2,
            }}
            {...this._panResponder.panHandlers}
          />
          <TouchableOpacity
            onPress={
              () => {
                if (current === stories.length - 1) return;
                this.setState({ current: current + 1 }, () => this.updateRead());
              }
            }
            style={{
              flex: 1,
            }}
          />
        </View>
      </Animated.View>
    );
  }
}

export default StoryScreen;
