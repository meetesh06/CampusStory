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
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import Constants from '../constants';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import Realm from '../realm';
import { processRealmObj } from './helpers/functions';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import SessionStore from '../SessionStore';

const { TOKEN, MUTED } = Constants;
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
        // if (Platform.OS === 'android') {
        //   if (gestureState.vy > 0.4) {
        //     return Navigation.dismissOverlay(componentId);
        //   }
        // }
        return true;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log(gestureState.moveX, gestureState.moveY, gestureState.dx, gestureState.dy, gestureState.x0, gestureState.y0, WIDTH);
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
              friction: 4
            }
          ).start();
        }
        if(gestureState.x0 > 0 && gestureState.x0 < WIDTH /4){
          if (this.state.current === this.state.stories.length - 1) this.close();
          else this.setState({ current: this.state.current + 1 }, () => this.updateRead());
          
        }
        else if(gestureState.x0 > (WIDTH * 3) / 4){
          if (this.state.current === 0) this.close();
          else this.setState({ current: this.state.current - 1 });
        }
        else if(gestureState.dx < 5, gestureState.dy < 10){
          this.tapped();
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
              friction: 4
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
    channel : {media : '""'},
    loading: true,
    muted : new SessionStore().getValue(MUTED)
  }

  tapped = () =>{
    new SessionStore().putValue(MUTED, !this.state.muted);
    this.setState({muted : !this.state.muted});
  }

  async componentDidMount() {
    const { _id } = this.props;
    Realm.getRealm((realm) => {
      let Activity = realm.objects('Activity').filtered(`channel="${_id}"`).sorted('timestamp', true);
      const readActivity = Activity.filtered('read="true"').sorted('timestamp', true);
      const unreadActivity = Activity.filtered('read="false"').sorted('timestamp', true);
      const channel = realm.objects('Channels').filtered(`_id="${_id}"`);
      processRealmObj(channel, (channelResult) => {
        // console.log('Channel', channel_result);
        realm.write(() => {
          realm.create('Channels', { _id, updates: 'false' }, true);
        });
        let Final;
        processRealmObj(readActivity, (result1) => {
          // console.log(result1);
          const res1 = result1.slice(0, 15);
          // console.log(res1);
          processRealmObj(unreadActivity, (result2) => {
            console.log(result2);
            Final = result2.concat(res1);
            const current = (0 + (result2.length - 1)) > 0 ? 0 + (result2.length - 1) : 0;
            // if(result2.length === 0) current -= 1;
            console.log(Final);
            console.log(current);
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
    console.log(this.toUpdate);
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('activity_list', JSON.stringify(this.toUpdate));
    axios.post('https://www.mycampusdock.com/channels/update-read', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': new SessionStore().getValue(TOKEN)
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
    this.close();
    return true;
  }

  gotoChannel = (item) =>{
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
    Navigation.dismissOverlay(this.props.componentId);
  }

  close = () =>{
    const {
      componentId
    } = this.props;
    Navigation.dismissOverlay(componentId);
  }

  draw_progres = (indx, size, width) =>{
    let pos = size - indx - 1;
    let len = (width - 30) / size;
    let dummy = [];
    for(var i=0; i<size; i++){
      if(i <= pos) dummy.push(1);
      else dummy.push(0);
    }
    return(
      <View style={{flex : 1, marginLeft : 10, marginRight : 10, margin : 5, flexDirection : 'row'}}>
        {
          dummy.map((value, index)=><View style={{height : 3, marginLeft : 2, marginRight : 2, width : len, borderRadius : 5, backgroundColor : value === 0 ? 'rgba(180, 180, 180, 0.5)' : 'rgba(255, 255, 255, 0.8)'}} key={index}/>)
        }
      </View>
    );
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
                muted = {this.state.muted}
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
          {/* <TouchableOpacity
            onPress={
              () => {
                if (current === stories.length - 1) return;
                this.setState({ current: current + 1 }, () => this.updateRead());
              }
            }
            style={{
              flex: 1,
              backgroundColor : '#890'
            }}
          /> */}
          <View
            collapsable={false}
            style={{
              width: WIDTH,
            }}
            {...this._panResponder.panHandlers}
          />
          {/* <TouchableOpacity
            onPress={
              () => {
                if (current === 0) return;
                this.setState({ current: current - 1 });
              }
            }
            style={{
              flex: 1,
              backgroundColor : '#890'
            }}
          /> */}
        </View>

        <View style={{position : 'absolute', top : 18, left : 0, width : '100%'}}>
          <View style={{width : '100%', marginTop : 8}}>
            {
              this.draw_progres(current, stories.length, WIDTH)
            }
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', width : '100%'}}>
            <TouchableOpacity onPress ={()=>this.gotoChannel({channel : this.state.channel._id, channel_name : this.state.channel.name})} style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 12, marginTop : 5}}>
              <FastImage
                style={{
                  width : 36, height : 36, borderRadius : 20
                }}
                source={{ uri: `https://www.mycampusdock.com/${JSON.parse(this.state.channel.media)[0]}` }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={{fontSize : 15, color : '#fff', margin : 5, fontFamily : 'Roboto', fontWeight : 'bold'}}>{this.state.channel.name}</Text>
            </TouchableOpacity>
            <View style={{flex : 1}}/>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                textAlign: 'right',
                width: 30,
                height: 30,
                padding: 5,
                marginRight : 12, 
                backgroundColor: '#ffffff99',
                borderRadius: 20
              }}
              onPress={() => this.close()}
            >
              <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={20} name="close" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
}

export default StoryScreen;
