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
  PanResponder,
  Animated,
  SafeAreaView,
  BackHandler,
  ScrollView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
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
import { getMonthName, formatAMPM, getCategoryName } from './helpers/functions';
import SessionStore from '../SessionStore';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const { TOKEN } = Constants;

class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.success = this.success.bind(this);
    this.handleGoing = this.handleGoing.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFull = this.handleFull.bind(this);
    this.handleChannelOpenNetwork = this.handleChannelOpenNetwork.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    
    this.topHeight = new Animated.Value(HEIGHT);
    this.opacity = new Animated.Value(0.3);
    this.opacity1 = new Animated.Value(0);
    this.partial = true;
    this.tapped = 0;
    this.tapped_time = new Date().getTime();
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      item: props.item,
      remind : props.item.remind,
      loading: false,
      partial: true,
      pan: new Animated.ValueXY(),
      zoom : false
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
        if(this.tapped === 0){
          this.tapped = 1;
          this.tapped_time = new Date().getTime();
        } else {
          this.tapped = 2;
        }
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
        if(this.tapped === 1){
          let diff = new Date().getTime() - this.tapped_time;
          if(diff > 800){
            this.tapped = 0;
          } else {
            setTimeout(()=>{
              this.tapped = 0;
            }, 800);
          }
        }
        else if(this.tapped === 2){
          let diff = new Date().getTime() - this.tapped_time;
          if(diff < 800){
            if(this.mounted) this.setState({zoom : !this.state.zoom});
          }
          this.tapped = 0;
        }
      }
    });
  }

  componentWillMount() {
    this.mounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT * 0.40,
        duration: 200,
        friction: 7,
      }),
      Animated.timing(this.opacity1, {
        toValue: 1 - (HEIGHT * 0.40 / HEIGHT),
        duration: 200,
      })
    ]).start( () => {
      this.fetchEventFromNetwork(()=>{

      });
    });
  }

  fetchEventFromNetwork = (callback) =>{
    const { item } = this.state;
    const { _id } = item;
    
    axios.post(urls.FETCH_EVENT_DATA, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
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
            el.audience = JSON.stringify(el.audience);
            el.media = JSON.stringify(el.media);
            el.timestamp = new Date(el.timestamp);
            el.time = new Date(el.time);
            el.ms = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            el.going = item.going;
            el.interested = item.interested;
            el.remind = item.remind;
            try {
              realm.create('Events', el, true);
            } catch (e) {
              console.log(e);
            }
          });
          el.dummy = false
          if(this.mounted) this.setState({ item: el, });
        });
        callback();
      } else {
        callback();
      }
    }).catch(err => {
      console.log(err);
      callback();
    });
  }

  handleBackButtonClick = () =>{
    this.handleClose();
    return true;
  }

  componentWillUnmount(){
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleClick = async () => {
    const { loading } = this.state;
    const { item } = this.props;
    const { _id } = item;
    if (loading) return;
    if(this.mounted) this.setState({ loading: true });
    axios.post(urls.SET_USER_INTERESTED, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      const responseObj = response.data;
      if (!responseObj.error) {
        Realm.getRealm((realm) => {
          realm.write(() => {
            try {
              realm.create('Events', { _id, interested: true }, true);
              if(this.mounted) this.setState({ item: { ...item, interested: true } });
            } catch (e) {
              console.log(e);
            }
          });
        });
      }
    }).catch(err => {
      console.log(err)
      new SessionStore().pushLogs({type : 'error', line : 191, file : 'EventDetails.js', err : err});
    }).finally(() => {if(this.mounted) this.setState({ loading: false })});
  }

  handleClose = () => {
    const {
      componentId
    } = this.props;
    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT + this.topHeight._value,
        duration: 200,
        friction: 7,
      }),
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 200,
      })
    ]).start();
    setTimeout(() => Navigation.dismissOverlay(componentId), 180);
    this.props.onClose ? this.props.onClose() : console.log('not here');
  }

  handleFull = () => {
    if(this.mounted) this.setState({ partial: false });
    this.partial = false;
    const {
      pan
    } = this.state;
    const offset = pan.y._offset;
    Animated.spring(pan, {
      toValue: -(HEIGHT * 0.40) - offset,
      friction: 8,
    }).start(() => pan.setOffset({ y: -(HEIGHT * 0.40) }));
  }

  updateStatus = () => {
    const {
      item
    } = this.state;
    const {
      _id
    } = item;
    Realm.getRealm((realm) => {
      const element = realm.objects('Events').filtered(`_id="${_id}"`);
      const final = { ...element[0] };
      if(this.mounted) this.setState({ item: final });
    });
  }

  handleGoing = () => {
    const { loading } = this.state;
    const { item } = this.props;

    if (loading) return;
    if (item.reg_link !== '') {
      // Navigation.dismissOverlay(this.props.componentId);
      // this.handleClose();
      Navigation.showOverlay({
        component: {
          name: 'Event Register',
          passProps: {
            uri: item.reg_link,
            parentId: this.props.componentId
          },
          options: {
            topBar: {
              visible: false,
              drawBehind: true,
              // title: {
              //   text: 'Event Register',
              //   color: '#333'
              // }
            }
          }
        }
      });
    } else {
      Navigation.showOverlay({
        component: {
          name: 'Going Details',
          passProps: {
            submit : this.submit
          },
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
    }
  }

  submit = (data) => {
    const { _id } = this.props.item;
    data._id = _id;
    if(this.mounted) this.setState({ loading: true });
    axios.post(urls.SET_ENROLLED, data, {
      headers: {
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if (!response.data.error) {
        Realm.getRealm((realm) => {
          realm.write(() => {
            realm.create('Events', { _id, going: true }, true);
            if(this.mounted) this.setState({ loading: false });
            this.updateStatus();
          });
        });
      } else { if(this.mounted) this.setState({ loading: false }); }
    }).catch((e) => {
      if(this.mounted) this.setState({ loading: false });
    });
  }

  success = () => {
    const { item } = this.props;
    if(this.mounted) this.setState({ item: { ...item, going: true } });
  }

  handleChannelOpenNetwork = () => {
    const { item } = this.props;
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
              text: item.name
            },
            visible: true
          }
        }
      }
    });
  }

  handleRemind = () => {
    const { item } = this.props;
    const {
      remind
    } = this.state;
    const { _id } = item;
    if (item === null) return;
    Realm.getRealm((realm) => {
      realm.write(() => {
        if (!remind) {
          try {
            realm.create('Firebase', { _id, notify: true, type: 'event' }, true);
            realm.create('Events', { _id, remind: true }, true);
            firebase.messaging().subscribeToTopic(_id);
            if(this.mounted) this.setState({ remind: true });
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
            realm.create('Events', { _id, remind: false }, true);
            realm.delete(element);
            firebase.messaging().unsubscribeFromTopic(_id);
            if(this.mounted) this.setState({ remind: false });
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }

  render() {
    const { item, loading, remind, partial, zoom } = this.state;
    const { pan } = this.state;
    const [translateY] = [pan.y];
    const {
      handleChannelOpenNetwork
    } = this;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          borderRadius: 10,
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
            style={{
              backgroundColor: '#222',
              padding: 10,
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
              <Icon style={{ alignSelf: 'center', color: '#fff' }} size={20} name={partial ? 'up' : 'down'} />
            </TouchableOpacity>
            <FastImage
              style={{
                width: WIDTH - 20,
                height: (WIDTH - 20) * 0.75,
                borderRadius: 10
              }}
              source={{
                uri: encodeURI(urls.PREFIX + '/' +  `${JSON.parse(item.media)[0]}`)
              }}
              resizeMode={zoom ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
            />
          </View>
          {
            !item.dummy &&
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            style={{
              flex: 1,
              backgroundColor: '#333',
            }}
          >
          <View>
            <View
              style={{
                marginLeft: 5,
                marginRight: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  marginRight: 10,
                  width: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 15,
                    color: '#FF6A15',
                    textAlign: 'center',
                    fontWeight: '900'
                  }}
                >
                  { getMonthName(item.date.getMonth() + 1) }
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 22,
                    color: '#a0a0a0',
                  }}
                >
                  { JSON.stringify(item.date.getDate()) }
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: 20,
                    color: '#f0f0f0',
                  }}
                >
                  { item.title }
                </Text>
                <TouchableOpacity
                  onPress={handleChannelOpenNetwork}
                  style={{
                    marginTop: 5
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily : 'Roboto-Light',
                      fontSize: 14,
                      color: '#a0a0a0',
                    }}
                  >

                    {getCategoryName(item.category)}
                    {' event by '}
                    <Text
                      numberOfLines = {1}
                      lineBreakMode = 'tail'
                      style={{
                        color: '#FF6A15',
                        fontSize: 14,
                        textDecorationLine: 'underline',
                        fontFamily: 'Roboto'
                      }}
                    >
                      { item.channel_name }
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginLeft: 5,
                flex: 1,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <Icon1 style={{ alignSelf: 'center', color: '#FF6A15', }} size={23} name="location-pin" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  selectable
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#f0f0f0',
                  }}
                >
                  { item.location }
                </Text>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#a0a0a0',
                  }}
                >
                  {formatAMPM(item.date)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <Icon2 style={{ alignSelf: 'center', color: '#FF6A15', }} size={23} name="people" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#f0f0f0',
                  }}
                >
                  { item.enrollees }
                  {' '}
People Going
                </Text>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#a0a0a0',
                  }}
                >
                  { item.views }
                  {' '}
Views
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <Icon1 style={{ alignSelf: 'center', color: '#FF6A15', }} size={30} name="text" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#f0f0f0',
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <IconIonicons style={{ alignSelf: 'center', color: '#FF6A15', }} size={23} name="ios-call" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  selectable
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#f0f0f0',
                  }}
                >
                  {item.contact_details}
                </Text>
              </View>
            </View>
            {
            item.faq !== undefined
            && item.faq.length > 0
            && (
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >

              <View
                style={{
                  justifyContent: 'center',
                  marginRight: 10,
                  width: 50,
                  height: 50,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 5
                }}
              >
                <Icon3 style={{ alignSelf: 'center', color: '#FF6A15', }} size={23} name="comment-question" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  selectable
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#f0f0f0',
                  }}
                >
                  {item.faq}
                </Text>
              </View>

            </View>
            )
          }
          </View>

          <View style={{flex : 1}} />
        
          {
            item.interested && 
          <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                paddingBottom : 0,
                marginTop : 20,
                marginBottom : 10,
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
                  borderRadius: 50,
                  backgroundColor : !remind ? '#555' : '#2E8B57'
                }}
                onPress={this.handleRemind}
              >
                <Icon2 style={{ alignSelf: 'center', color: !remind  ? '#777' : '#fff', }} size={23} name = { !remind ? 'notifications' : "notifications-active" } />
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
                  {!remind ? 'Click the bell icon to get notified for all the future updates for this event.' : 'You are now subscribed for all the future updates for this event.'}
                </Text>
              </View>

            </View>
          }
          <View
            style={{
              flexDirection: 'row',
              marginBottom:  Platform.OS === 'ios' ? 0 : 20
            }}
          >
            { !item.interested && (
            <TouchableOpacity
              onPress={this.handleClick}
              style={{
                padding: 15,
                backgroundColor: '#555',
                flex: 1
              }}
            >
              {
                loading
                && <ActivityIndicator size="small" color="#fff" />
              }
              {
                !loading
                && (
                <Text
                  style={{
                    color: '#fafafa',
                    fontSize: 18,
                    fontFamily: 'Roboto',
                    textAlign: 'center'
                  }}
                >
                  {" I'm Interested  "}
                </Text>
                )
            }
            </TouchableOpacity>
            ) }
            { item.interested && !item.going
                    && (
                    <TouchableOpacity
                      onPress={this.handleGoing}
                      style={{
                        padding: 15,
                        backgroundColor: '#fa3e3e',
                        flex: 1
                      }}
                    >
                      {
                            loading
                            && <ActivityIndicator size="small" color="#fff" />
                        }
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          fontFamily: 'Roboto',
                          textAlign: 'center'
                        }}
                      >
                        <Icon4 style={{ color: '#fa3e3e' }} name="bookmark" size={18} />
                        {
                                '  Register Now  '
                        }
                        <Icon4 style={{ color: '#fa3e3e' }} name="bookmark" size={18} />
                      </Text>
                    </TouchableOpacity>
                    ) }
            { item.interested && item.going
                    && (
                    <TouchableOpacity
                      activeOpacity = {0.95}
                      style={{
                        padding: 15,
                        backgroundColor: '#2E8B57',
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
                            GOING
                      </Text>
                    </TouchableOpacity>
                    ) }
          </View>
        
          </ScrollView>
          }
        </Animated.View>
      
      </SafeAreaView>
    );
  }
}

export default EventDetail;
