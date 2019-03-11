/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  View,
  Platform,
  Text,
  Alert,
  ActivityIndicator,
  PanResponder,
  BackHandler,
  Linking,
  Animated,
  ScrollView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';
import Realm from '../realm';
import Constants from '../constants';
import { processRealmObj, getCategoryName } from './helpers/functions';
import SessionStore from '../SessionStore';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import urls from '../URLS';

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
      loading : false,
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
        if (((dy / HEIGHT) * 100) > 20) {
          this.handleClose();
        } else {
          this.handleFull();
        }
      }
    });
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT * 0.40,
        duration: 200,
        friction: 6,
      }),
      Animated.timing(this.opacity1, {
        toValue: 1 - (HEIGHT * 0.40 / HEIGHT),
        duration: 400,
      })
    ]).start();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    const { id } = this.props;
    const {
      fetchChannelRequest
    } = this;
    Realm.getRealm((realm) => {
      const element = realm.objects('Firebase').filtered(`_id="${id}"`);
      const item = realm.objects('Channels').filtered(`_id="${id}"`);
      processRealmObj(element, (result) => {
        if (result.length > 0) {
          this.setState({ subscribed: true, notify: result[0].notify !== false});
        }
        processRealmObj(item, (result1) => {
          this.setState({ item: result1[0], loading : true }, () => fetchChannelRequest(result1[0] !== undefined));
        });
      });
    });
  }

  handleBackButtonClick = () =>{
    this.handleClose();
    return true;
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  fetchChannelRequest = async (already) => {
    const {
      subscribed
    } = this.state;
    const { id } = this.props;
    axios.post(urls.FETCH_CHANNEL_DATA, { _id: id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if (!response.data.error) {
        response.data.data.forEach((el) => {
          el.priority = JSON.stringify(el.priority);
          el.reactions = JSON.stringify(el.reactions);
          el.priority = JSON.stringify(el.priority);
          el.media = JSON.stringify(el.media);
          el.followers = JSON.stringify(el.followers);
          el.subscribed = JSON.stringify(already === true ? subscribed : false);
          el.updates = (already !== true);
        });
        const { data } = response.data;
        if (data.length === 0) return this.setState({loading : false});
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
        this.setState({ item: data[0], loading : false });
      } else {
        this.setState({loading : false });
      }
    }).catch(err => {
      console.log(err);
      this.setState({loading : false});
      new SessionStore().pushLogs({type : 'error', line : 162, file : 'ChannelDetailsScreen.js', err : err});
    });
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
            realm.create('Firebase', { _id, notify: true, type: 'channel' }, true);
            firebase.messaging().subscribeToTopic(_id);
            this.setState({ notify: true });
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
            realm.delete(element);
            realm.create('Firebase', { _id, notify: false, type: 'channel' });
            firebase.messaging().unsubscribeFromTopic(_id);
            this.setState({ notify: false });
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }

handleSubscribe = () =>{
  if(this.state.subscribed)
  Alert.alert(
    'Remove Subscription',
    'Are you sure you want to unsubscribe from this channel?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Unsubscribe', onPress: () => this.clickSubscribe()},
    ],
    {cancelable: true},
  );
  else
  this.clickSubscribe();
}

  clickSubscribe = () => {
    const {
      item,
      subscribed
    } = this.state;
    if (item === null) return;
    const {
      _id
    } = item;
    const URL = subscribed ? urls.UNFOLLOW_URL : urls.FOLLOW_URL;
    this.setState({loading : true});
    axios.post(URL, { channel_id:_id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        Realm.getRealm((realm) => {
          realm.write(() => {
            if (!subscribed) {
              try {
                realm.create('Firebase', { _id, notify: false, type: 'channel' });
                this.setState({ subscribed: true, loading : false });
              } catch (e) {
                console.log(e);
              }
            } else {
              try {
                const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
                realm.delete(element);
                this.setState({ subscribed: false, notify: false, loading : false});
              } catch (e) {
                console.log(e);
                this.setState({loading : false});
              }
            }
          });
        });
      }
    }).catch(e =>{
      console.log(e);
      this.setState({loading : false});
      new SessionStore().pushLogs({type : 'error', line : 162, file : 'ChannelDetailsScreen.js', err : e});
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
        friction: 6,
      }),
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 200,
      })
    ]).start();
    setTimeout(() => Navigation.dismissOverlay(componentId), 180);
  }

  handleFull = () => {
    this.setState({ partial: false });
    this.partial = false;
    const {
      pan
    } = this.state;
    const offset = pan.y._offset;
    Animated.spring(pan, {
      toValue: -(HEIGHT * 0.40) - offset,
      friction: 6,
    }).start(() => pan.setOffset({ y: -(HEIGHT * 0.40) }));
  }

  openSocialLink = (url) =>{
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
}

  render() {
    const {
      item,
      subscribed,
      notify,
      pan,
      loading
    } = this.state;
    const [translateY] = [pan.y];
    return (
      <View
        style={{
          flex: 1
        }}
      >
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
              justifyContent: 'center',
              width: WIDTH,
              padding: 10,
              backgroundColor : '#333',
              paddingTop : 70,
              paddingBottom : 20,
            }}
          >

            <TouchableOpacity
              style={{
                position: 'absolute',
                justifyContent: 'center',
                textAlign: 'center',
                top: -25,
                left: 0,
                right: 0,
                padding: 5,
                borderRadius: 20
              }}
              onPress={() => this.handleFull()}
            >
              <Icon style={{ alignSelf: 'center', color: '#fff' }} size={20} name={this.partial ? 'up' : 'down'} />
            </TouchableOpacity>
            {
              item !== null && item !== undefined && item.media !== undefined
              && (
              <View style={{width : 130, height : 130, borderRadius : 120,  backgroundColor : '#444', justifyContent : 'center', alignItems : 'center', alignSelf : 'center' }}>
              <FastImage
                style={{
                  width: 120,
                  backgroundColor : '#555',
                  height: 120,
                  borderRadius: 120,
                }}
                source={{ uri:  encodeURI( urls.PREFIX + '/' +  `${JSON.parse(item.media)[0]}`) }}
                resizeMode={FastImage.resizeMode.cover}
              />
              </View>
              )
            }
          </View>
        </View>
        <ScrollView
        contentContainerStyle = {{flexGrow : 1}}
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              margin : 10,
              marginBottom : 0,
              color : '#fff',
              fontFamily: 'Roboto'
            }}
          >
            {item !== null && item !== undefined && item.name !== undefined && item.name}
          </Text>
          <Text style={{color : '#888', fontSize : 14, textAlign : 'center', margin : 5, marginBottom : 15}}>
            {'('}
            {getCategoryName(item !== null && item !== undefined && item.category !== undefined && item.category)}
            {')'}
          </Text>
          <View style={{flexDirection : 'row', justifyContent : 'center'}}>
            <View style={{justifyContent : 'center'}}>
                <Icon2 name = { item ? item.private ? 'lock' : 'public' : 'public'} size = {20} color = '#ddd' style={{alignSelf : 'center', margin : 5}}/>
                <Text style={{fontSize : 13, color : '#ddd', textAlign : 'center'}}>{item !== null && item !== undefined && item.private ? 'Private Channel' : 'Public Channel'}</Text>
            </View>
            <View style={{width : 2, height : '80%', backgroundColor : '#444', margin : 5, marginLeft : 10, marginRight : 10 }} />
            <View style={{justifyContent : 'center'}}>
                <Icon2 name = 'person' size = {20} color = '#ddd' style={{alignSelf : 'center', margin : 5,}}/>
                <Text style={{fontSize : 13, color : '#ddd', textAlign : 'center'}}>{item !== null && item !== undefined && item.followers + ' Subscribers '}</Text>
            </View>
            <View style={{width : 2, height : '80%', backgroundColor : '#444', margin : 5, marginLeft : 10, marginRight : 10}} />
            <View style={{justifyContent : 'center'}}>
                <Icon3 name = 'heartbeat' size = {18} color = '#ddd' style={{alignSelf : 'center', margin : 5}}/>
                <Text style={{fontSize : 13, color : '#ddd', textAlign : 'center'}}>{item !== null && item !== undefined && item.reactions + ' Reactions '}</Text>
            </View>
          </View>

          {item !== null && item !== undefined && item.subscribed &&
          <View style={{
            backgroundColor: '#444',
            margin: 10,
            marginTop  : 20,
            borderRadius: 10,
          }}>

            <Text style={{textAlign : 'center', fontSize : 12, margin : 10, marginTop : 5, color : '#999', marginBottom : 5}}>Description</Text>
            <Text
              selectable
              style={{
                fontFamily: 'Roboto-Light',
                fontSize: 15,
                margin : 10,
                marginTop : 0,
                marginBottom : 15,
                overflow: 'hidden',
                textAlign: 'center',
                color: '#fff'
              }}
            >
              {item !== null && item !== undefined && item.description !== undefined && item.description}
            </Text>
            { item.social_link !== undefined && item.social_link !== null && item.social_link.length > 0 &&
              <View>
                  <Text style={{fontSize : 12, color : '#999', textAlign : 'center', marginTop : 10, marginBottom : 0}}>
                      {'Social Link'}
                  </Text>

                  <TouchableOpacity activeOpacity = {0.7} onPress = {()=>this.openSocialLink(item.social_link)}>
                      <Text selectable numberOfLines = {1} lineBreakMode = 'tail' style={{fontSize : 14, color : '#fff', textDecorationLine: 'underline', textAlign : 'center', marginTop : 10, marginBottom : 10, margin : 10}}>
                          {item.social_link}
                      </Text>
                  </TouchableOpacity>
              </View>
              }
          </View>
          }

          <Text style={{ fontSize: 12, color: '#888', textAlign: 'center', textAlignVertical : 'center', fontFamily : 'Roboto-Light'}}><Icon name = 'infocirlceo' size = {11} /> {' Subscribe channels for easy updates on home screen.'}</Text>
          
          <View style={{flex : 1}} />
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row'
            }}
          />
          <View>
        
        { subscribed &&
        <View
              style={{
                marginLeft: 10,
                margin : 5,
                padding: 5,
                justifyContent : 'center',
                alignItems : 'center',
                flexDirection: 'row'
              }}
            >

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 50,
                  backgroundColor : notify === false ? '#444' : '#2E8B57'
                }}
                onPress={this.handleNotify}
              >
                <Icon2 style={{ alignSelf: 'center', color: notify === false ? '#777' : '#fff', }} size={23} name = { notify === false ? 'notifications' : "notifications-active" } />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 12,
                    marginRight : 8,
                    color: '#a0a0a0',
                  }}
                >
                  {notify === false ? 'Click the bell icon to get notified for all future updates for this channel.' : 'You are now subscribed for all future updates for this channel.'}
                </Text>
              </View>
            </View>
          }

          { item && (subscribed || !item.private) &&
          <TouchableOpacity
            disabled={ this.state.item === null || this.state.item === undefined }
            onPress={this.handleSubscribe}
            style={{
              padding: 15,
              paddingLeft : 5,
              backgroundColor : subscribed ? '#666' : '#fa3e3e',
              paddingRight : 5,
              marginBottom: Platform.OS === 'ios' ? 0 : 20,
              flexDirection : 'row',
              justifyContent : 'center'
            }}
          >
            {
              loading &&
              <ActivityIndicator color = '#ddd' size = 'small' style={{margin : 5}} />
            }
            { !loading &&
               <Text
               style={{
                 color: '#fff',
                 fontSize: 20,
                 fontFamily: 'Roboto',
                 textAlign: 'center'
               }}
             >
               { !subscribed ? 'Subscribe Now ' : 'Unsubscribe Now '}
             </Text>
            }
          </TouchableOpacity>
          }
        </View>
      
        </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

export default ChannelDetailScreen;
