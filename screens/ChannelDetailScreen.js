/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  View,
  Platform,
  Text,
  StatusBar,
  PanResponder,
  Animated,
  SafeAreaView,
  ScrollView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Octicons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';
import Realm from '../realm';
import Constants from '../constants';
import { processRealmObj, getCategoryName } from './helpers/functions';
import SessionStore from '../SessionStore';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const { TOKEN } = Constants;

class ChannelDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.fetchChannelRequest = this.fetchChannelRequest.bind(this);
    this.handleNotify = this.handleNotify.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleFull = this.handleFull.bind(this);
    // animations
    this.topHeight = new Animated.Value(HEIGHT);
    this.opacity = new Animated.Value(0.3);
    this.opacity1 = new Animated.Value(0);
    this.partial = true;
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      item: null,
      subscribed: false,
      notify: false,
      partial: true,
      pan: new Animated.ValueXY()
    };

    // eslint-disable-next-line no-underscore-dangle
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        const {
          pan
        } = this.state;
        const {
          _value
        } = pan.y;
        pan.setOffset({ y: _value });
        pan.setValue({ y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        const {
          pan
        } = this.state;
        pan.setValue({ y: gestureState.dy });
        this.opacity1.setValue(1 - gestureState.dy / HEIGHT);
        this.opacity.setValue(1 - gestureState.dy / HEIGHT);
      },
      onPanResponderRelease: (e, { dx, dy }) => {
        if (dy > 10) {
          this.handleClose();
        } else if(dy < -20) {
          this.handleFull();
        }
        else if (dx < 5, dy < 5) {
          if(this.state.partial) this.handleFull();
        }
      }
    });
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT * 0.30,
        duration: 200,
        friction: 7
      }),
      Animated.timing(this.opacity1, {
        toValue: 1 - (HEIGHT * 0.30 / HEIGHT),
        duration: 400
      })
    ]).start();

    const { id } = this.props;
    const {
      fetchChannelRequest
    } = this;
    Realm.getRealm((realm) => {
      const element = realm.objects('Firebase').filtered(`_id="${id}"`);
      const item = realm.objects('Channels').filtered(`_id="${id}"`);
      processRealmObj(element, (result) => {
        if (result.length > 0) {
          this.setState({ subscribed: true, notify: result[0].notify !== 'false' });
        }
      });
      processRealmObj(item, (result) => {
        this.setState({ item: result[0] }, () => fetchChannelRequest(result[0] !== undefined));
      });
    });
  }

  fetchChannelRequest = async (already) => {
    const {
      subscribed
    } = this.state;
    const { id } = this.props;
    axios.post('https://www.mycampusdock.com/channels/user/fetch-channel-data', { _id: id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      console.log(response);
      if (!response.data.error) {
        response.data.data.forEach((el) => {
          el.priority = JSON.stringify(el.priority);
          el.media = JSON.stringify(el.media);
          el.followers = JSON.stringify(el.followers);
          el.channel_already = 'false';
          el.category_found = 'false';
          el.recommended = JSON.stringify(true);
          el.subscribed = JSON.stringify(already === true ? subscribed : false);
          el.updates = JSON.stringify(already !== true);
        });
        const { data } = response.data;
        if (data.length === 0) return;
        Realm.getRealm((realm) => {
          realm.write(() => {
            let i;
            for (i = 0; i < data.length; i += 1) {
              try {
                realm.create('Channels', data[i], true);
              } catch (e) {
                console.log(e);
              }
            }
          });
        });
        // console.log(data[0]);
        this.setState({ item: data[0] });
      }
    }).catch(err => console.log(err));
  }

  handleNotify = () => {
    const {
      item,
      notify
    } = this.state;
    const {
      _id
    } = item;
    if (item === null) return;
    Realm.getRealm((realm) => {
      realm.write(() => {
        if (!notify) {
          try {
            realm.create('Firebase', { _id, notify: 'true', type: 'channel' }, true);
            firebase.messaging().subscribeToTopic(_id);
            this.setState({ notify: true });
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
            realm.delete(element);
            realm.create('Firebase', { _id, notify: 'false', type: 'channel' });
            firebase.messaging().unsubscribeFromTopic(_id);
            this.setState({ notify: false });
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }

  handleSubscribe = () => {
    const {
      item,
      subscribed
    } = this.state;
    if (item === null) return;
    const {
      _id
    } = item;
    Realm.getRealm((realm) => {
      realm.write(() => {
        if (!subscribed) {
          try {
            realm.create('Firebase', { _id, notify: 'false', type: 'channel' });
            this.setState({ subscribed: true });
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
            realm.delete(element);
            this.setState({ subscribed: false, notify: false });
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }

  handleClose = () => {
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

  handleFull = () => {
    this.setState({ partial: false });
    const {
      pan
    } = this.state;
    pan.setOffset({ y: 0 });
    Animated.spring(pan, {
      toValue: -(HEIGHT * 0.30),
      friction: 15
    }).start();
  }
  render() {
    const {
      item,
      subscribed,
      notify,
      pan
    } = this.state;
    const [translateY] = [pan.y];
    const { componentId } = this.props;
    return (
      <View
        style={{
          // width: WIDTH,
          flex: 1
        }}
      >
        {
          Platform.OS === 'ios'
          && (<StatusBar barStyle="light-content" translucent />)
        }

        <Animated.View
          style={{
            flex: 1,
            height: HEIGHT,
            width: WIDTH,
            backgroundColor: '#000000dd',
            opacity: this.opacity1
          }}
        />

        <Animated.View
          style={{
            flex: 1,
            position: 'absolute',
            top: this.topHeight,
            height: HEIGHT,
            backgroundColor: '#333',
            transform: [{ translateY }]
          }}
        >
        <View
        {...this._panResponder.panHandlers}
        >

          <View
            style={{
              backgroundColor: '#222',
              justifyContent: 'center',
              width: WIDTH,
              padding: 10,
              height: (WIDTH - 20) * 0.75 + 20
            }}
          >
            {
              item !== null && item !== undefined && item.media !== undefined
              && (
              <FastImage
                style={{
                  width: WIDTH - 20,
                  height: (WIDTH - 20) * 0.75,
                  borderRadius: 10
                }}
                source={{ uri: `https://www.mycampusdock.com/${JSON.parse(item.media)[0]}` }}
                // source={{ uri: 'https://mycampusdock.com/undefined' }}
                resizeMode={FastImage.resizeMode.cover}
              />
              )
            }
          </View>
          <View
            style={{
              position: 'absolute',
              // top: 5,
              flexDirection: 'row',
              // right: 15,
              // backgroundColor: 'red',
              padding: 15
            }}
          >
            <View
              style={{
                // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backgroundColor: '#ffffff99',
                borderRadius: 5,
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: '#333',
                  marginLeft: 10,
                  marginRight: 10,
                  margin: 5,
                  alignSelf: 'center'
                }}
              >
                {getCategoryName(item !== null && item !== undefined && item.category !== undefined && item.category)}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          
          
          <Text
            style={{
              // marginTop: 20,
              textAlign: 'center',
              fontSize: 20,
              fontFamily: 'Roboto-Light'
            }}
          >
            {item !== null && item !== undefined && item.name !== undefined && item.name}
          </Text>
          <Text
            style={{
              // marginTop: 10,
              fontFamily: 'Roboto-Light',
              fontSize: 14,
              padding: 10,
              backgroundColor: '#444',
              margin: 10,
              borderRadius: 10,
              minHeight: 50,
              overflow: 'hidden',
              textAlign: 'center',
              color: '#f0f0f0'
            }}
          >
            {item !== null && item !== undefined && item.description !== undefined && item.description}
          </Text>

          <Text style={{ fontSize: 10, color: '#FF6A15', textAlign: 'center', textAlignVertical : 'center'}}><Icon name = 'infocirlceo' size = {12} /> {' Subscribe channels to get new updates from them easily!'}</Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row'
            }}
          />
        </ScrollView>

        </Animated.View>
        <View
          style={{
            backgroundColor: (subscribed || this.state.item === null || this.state.item === undefined) ? '#c0c0c0' : '#FF6A15',
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            disabled={ this.state.item === null || this.state.item === undefined }
            onPress={this.handleSubscribe}
            style={{
              padding: 15,
              paddingLeft : 5, 
              paddingRight : 5,
              flex: 1
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Roboto',
                textAlign: 'center'
              }}
            >
              { !subscribed && 'SUBSCRIBE'}
              { subscribed && 'UNSUBSCRIBE'}
            </Text>
          </TouchableOpacity>
          {
                      subscribed
                      && (
                      <TouchableOpacity
                        onPress={this.handleNotify}
                        style={{
                          padding: 15,
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor: notify ? '#0a9ad3' : '#c0c0c0',
                          flex: 1
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontFamily: 'Roboto',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                          }}
                        >
                          {'GET NOTIFIED  '}
                          <IconMaterial name = {notify ? 'notifications-active' : 'notifications-off'} size={20} style={{ marginLeft: 10, marginTop: 2 }} />
                        </Text>
                      </TouchableOpacity>
                      
                      )
                  }

        </View>
      </View>
    );
  }
}

export default ChannelDetailScreen;
