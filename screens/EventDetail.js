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
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Octicons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import Constants from '../constants';
import { getMonthName, formatAMPM, getCategoryName } from './helpers/functions';
import SessionStore from '../SessionStore';

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
    // animations
    this.topHeight = new Animated.Value(HEIGHT);
    this.opacity = new Animated.Value(0.3);
    this.partial = true;
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      item: this.props.item,
      loading: false,
      pan: new Animated.ValueXY()
    };

    this._val = { y: 0 };
    this.state.pan.addListener((value) => {
      this._val = value
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
  
      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({ y: this.state.pan.y._value });
        this.state.pan.setValue({ y: 0 });
      },
      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dy: this.state.pan.y },
      ]),
      onPanResponderRelease: (e, {vx, dy}) => {
        if (dy > 5) {
          this.handleClose();
        } else {
          console.log(this.topHeight);
          this.state.pan.setOffset({ y: 0 });
          // this.state.pan.setValue({ y: 0 });
          // this.handleFull();
          Animated.parallel([
            Animated.timing(this.state.pan, {
              toValue: -this.topHeight._value,
              duration: 200,
              // friction: 20
            })
          ]).start();
          // Animated.spring(this.state.pan.y, {
          //   toValue: 100,
          //   duration: 200,
          //   friction: 7
          // }).start();
        }
      }
    });
  }

  

  componentDidMount() {
    const { item } = this.state;
    const { _id } = item;

    Animated.parallel([
      Animated.spring(this.topHeight, {
        toValue: HEIGHT * 0.30,
        duration: 200,
        friction: 7
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 400
      })
    ]).start();

    

    const { interested, going } = this.state;
    axios.post('https://www.mycampusdock.com/events/user/fetch-event-data', { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      console.log(response);
      const responseObj = response.data;
      if (!responseObj.error) {
        // Realm.getRealm((realm) => {
        //   const el = responseObj.data[0];
        //   realm.write(() => {
        //     const current = realm.objects('Events').filtered(`_id="${_id}"`);
        //     realm.delete(current);
        //     el.reach = JSON.stringify(el.reach);
        //     el.views = JSON.stringify(el.views);
        //     el.enrollees = JSON.stringify(el.enrollees);
        //     el.name = JSON.stringify(el.name);
        //     el.audience = JSON.stringify(el.audience);
        //     el.media = JSON.stringify(el.media);
        //     el.timestamp = new Date(el.timestamp);
        //     el.time = new Date(el.time);
        //     const ts = Date.parse(`${el.date}`);
        //     el.date = new Date(el.date);
        //     el.ms = ts;
        //     el.reg_end = new Date(el.reg_end);
        //     el.reg_start = new Date(el.reg_start);
        //     el.interested = interested;
        //     el.going = going;
        //     // console.log(el);
        //     try {
        //       realm.create('Events', el, true);
        //     } catch (e) {
        //       console.log(e);
        //     }
        //   });
        //   this.setState({ item: el });
        // });
      }
    }).catch(err => console.log(err));
  }

  handleClick = async () => {
    const { loading } = this.state;
    const { item } = this.props;
    const { _id } = item;
    if (loading) return;
    this.setState({ loading: true });
    axios.post('https://www.mycampusdock.com/events/user/interested', { _id }, {
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
              realm.create('Events', { _id, interested: 'true' }, true);
              this.setState({ item: { ...item, interested: 'true' } });
            } catch (e) {
              console.log(e);
            }
          });
        });
      }
    }).catch(err => console.log(err))
      .finally(() => this.setState({ loading: false }));
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
    Navigation.dismissOverlay(componentId)

    // Animated.timing(this.topHeight, {
    //   toValue: HEIGHT,
    //   duration: 150
    // }).start(() => Navigation.dismissModal(componentId));
  }

  handleFull = () => {
    this.partial = false;
    this.topHeight = 0;
    // Animated.parallel([
    //   Animated.spring(this.topHeight, {
    //     toValue: 150,
    //     duration: 200,
    //     friction: 7
    //   })
    // ]).start();
    Animated.spring(this.topHeight, {
      toValue: 150,
      duration: 200,
      friction: 7
    }).start();
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
      this.setState({ item: final });
    });
  }

    handleGoing = () => {
      const { loading } = this.state;
      const { item } = this.props;
      const { _id } = item;
      const { updateStatus } = this;
      if (loading) return;
      console.log(item);
      if (item.reg_link !== '') {
        Navigation.showModal({
          stack: {
            children: [{
              component: {
                name: 'Event Register',
                passProps: {
                  uri: item.reg_link
                },
                options: {
                  topBar: {
                    title: {
                      text: 'Event Registration Link'
                    }
                  }
                }
              }
            }]
          }
        });
      } else {
        let going = 'false';
        Realm.getRealm((realm) => {
          realm.write(() => {
            const Final = realm.objects('Events').filtered(`_id="${_id}"`);
            // eslint-disable-next-line prefer-destructuring
            going = Final[0].going;
          });
        });
        Navigation.showOverlay({
          component: {
            name: 'Going Details',
            passProps: {
              _id,
              going,
              updateStatus
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

    success = () => {
      const { item } = this.props;
      this.setState({ item: { ...item, going: 'true' } });
    }

    handleChannelOpenNetwork = () => {
      // Alert.alert('Channel Open Network');
      const { item } = this.props;
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
                text: item.name
              },
              visible: true
            }
          }
        }
      });
    }

    render() {
      const { item, loading } = this.state;
      const { componentId } = this.props;
      let { pan } = this.state;
      // Calculate the x and y transform from the pan value
      let [translateY] = [pan.y];
      // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
      // let imageStyle = {transform: [{translateX}, {translateY}]};
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
              backgroundColor: '#000000aa',
              opacity: this.opacity
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
              <FastImage
                style={{
                  width: WIDTH - 20,
                  height: (WIDTH - 20) * 0.75,
                  borderRadius: 10
                }}
                source={{
                  uri: `https://www.mycampusdock.com/${JSON.parse(item.media)[0]}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{
                position: 'absolute',
                top: 5,
                flexDirection: 'row',
                right: 15,
                padding: 10
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
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      color: '#333',
                      marginLeft: 10,
                      marginRight: 10,
                      margin: 5,
                      alignSelf: 'center'
                    }}
                  >
                    {getCategoryName(item.category)}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    textAlign: 'right',
                    width: 30,
                    left: 10,
                    height: 30,
                    padding: 5,
                    backgroundColor: '#ffffff99',
                    borderRadius: 20
                  }}
                  onPress={() => this.handleClose()}
                >
                  <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={20} name="close" />
                </TouchableOpacity>
              </View>
            </View>
          {
            Platform.OS === 'ios'
            && (<StatusBar barStyle="light-content" translucent />)
          }
          <ScrollView
            style={{
              flex: 1,
              borderRadius: 10
            }}
          >

            <View
              style={{
                // margin: 5,
                flex: 1,
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  // backgroundColor: '#222',
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
                  {/* { JSON.stringify( item.date ) } */}
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
                      // fontFamily: 'Roboto-Thin',
                      fontSize: 15,
                      color: '#a0a0a0',
                    }}
                  >

                    {'Hosted by ' }
                    <Text
                      style={{
                        color: '#FF6A15',
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
              item.faq > 0
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
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 80
            }}
          >
            { item.interested === 'false'
                        && (
                        <TouchableOpacity
                          onPress={this.handleClick}
                          style={{
                            padding: 15,
                            margin: 10,
                            marginLeft: 15,
                            marginRight: 15,
                            borderRadius: 50,
                            backgroundColor: '#0056e5',
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
                                  <Icon style={{ color: '#fff' }} name="heart" size={18} />
                                  {' '}
                                  {' Interested '}
                                  {' '}
                                  <Icon style={{ color: '#fff' }} name="heart" size={18} />
                                </Text>
                                )
                            }
                        </TouchableOpacity>
                        ) }
            { item.interested === 'true' && item.going === 'false'
                        && (
                        <TouchableOpacity
                          onPress={this.handleGoing}
                          style={{
                            padding: 15,
                            marginLeft: 15,
                            marginRight: 15,
                            borderRadius: 50,
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
                            <Icon4 name="bookmark" size={18} />
                            {
                                    '  Register Now  '
                            }
                            <Icon4 name="bookmark" size={18} />
                          </Text>
                        </TouchableOpacity>
                        ) }
            { item.interested === 'true' && item.going === 'true'
                        && (
                        <TouchableOpacity
                          style={{
                            padding: 15,
                            backgroundColor: '#c0c0c0',
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
          
          </Animated.View>
        </SafeAreaView>
      );
    }
}

export default EventDetail;
