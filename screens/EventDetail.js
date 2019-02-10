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
  Linking,
  ScrollView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import Constants from '../constants';
import { getMonthName, formatAMPM, getCategoryName } from './helpers/functions';
import SessionStore from '../SessionStore';

const WIDTH = Dimensions.get('window').width;
const { TOKEN } = Constants;

class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.success = this.success.bind(this);
    this.handleGoing = this.handleGoing.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.handleChannelOpenNetwork = this.handleChannelOpenNetwork.bind(this);
  }

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    item: this.props.item,
    loading: false
  }

  async componentDidMount() {
    const { item } = this.state;
    const { _id, interested, going } = item;
    // const { interested, going } = this.state;
    axios.post('https://www.mycampusdock.com/events/user/fetch-event-data', { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      console.log(response);
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
            const ts = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            el.ms = ts;
            el.reg_end = new Date(el.reg_end);
            el.reg_start = new Date(el.reg_start);
            el.interested = interested;
            el.going = going;
            // console.log(el);
            try {
              realm.create('Events', el, true);
            } catch (e) {
              console.log(e);
            }
          });
          this.setState({ item: el });
        });
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
      const {
        handleChannelOpenNetwork
      } = this;
      // console.log(item);
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff'
          }}
        >
          {
            Platform.OS === 'ios'
            && (<StatusBar barStyle="dark-content" translucent />)
          }
          {/* <StatusBar barStyle="light-content" hidden /> */}
          <ScrollView
            style={{
              flex: 1,
              // backgroundColor: '#333'
            }}
          >

            <View
              style={{
                backgroundColor: '#efefef',
                padding: 10,
              }}
            >
              <FastImage
                style={{
                  width: WIDTH - 20, height: (WIDTH - 20) * 0.75, borderRadius: 10
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
                  <Text style={{
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
                  onPress={() => Navigation.dismissModal(componentId)}
                >
                  <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={20} name="close" />
                </TouchableOpacity>
              </View>
            </View>
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
                  backgroundColor: '#f1f1f1',
                  marginRight: 10,
                  paddingRight: 10,
                  paddingLeft: 10,
                  // padding: 5,
                  borderRadius: 10
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 15,
                    color: '#fa3e3e',
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
                    color: '#333',
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
                  style={{
                    textAlign: 'left',
                    fontSize: 20,
                    color: '#222',
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
                    style={{
                      fontFamily: 'Roboto-Thin'
                    }}
                  >

                    {'Hosted by ' }
                    <Text
                      style={{
                        color: '#1111aa',
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
                  backgroundColor: '#f1f1f1',
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 10
                }}
              >
                <Icon1 style={{ color: '#fa3e3e', }} size={30} name="location-pin" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  selectable = {true}
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    // color: '#222',
                  }}
                >
                  { item.location }
                </Text>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    color: '#222',
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
                  backgroundColor: '#f1f1f1',
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 10
                }}
              >
                <Icon style={{ color: '#444', }} size={30} name="smileo" />
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
                    // color: '#222',
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
                    color: '#222',
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
                  backgroundColor: '#f1f1f1',
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 10
                }}
              >
                <Icon1 style={{ color: '#444', }} size={30} name="text" />
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
                    // color: '#222',
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
                  backgroundColor: '#f1f1f1',
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 10
                }}
              >
                <IconIonicons style={{ color: '#444', }} size={30} name="md-contact" />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text
                  selectable = {true}
                  style={{
                    textAlign: 'left',
                    fontSize: 15,
                    // color: '#222',
                  }}
                >
                  {item.contact_details}
                </Text>
              </View>
            </View>
            { item.reg_link !== '' && (
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
                    backgroundColor: '#f1f1f1',
                    padding: 10,
                    marginRight: 10,
                    borderRadius: 10
                  }}
                >
                  <IconIonicons style={{ color: '#444', }} size={30} name="ios-link" />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{color: 'blue'}}
                    onPress={() => Linking.openURL(item.reg_link)}>
                    {item.reg_link}
                  </Text>
                </View>
              </View>
              )
            }
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
              {
                item.faq.length > 0
                && (
                <View>
                  <View
                    style={{
                      backgroundColor: '#f1f1f1',
                      padding: 10,
                      marginRight: 10,
                      borderRadius: 10
                    }}
                  >
                    <Icon style={{ color: '#444', }} size={30} name="questioncircleo" />
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
                        // color: '#222',
                      }}
                    >
                      {item.faq}
                    </Text>
                  </View>
                </View>
                )
            }
            </View>

          </ScrollView>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            { item.interested === 'false'
                        && (
                        <TouchableOpacity
                          onPress={this.handleClick}
                          style={{
                            padding: 15,
                            backgroundColor: 'blue',
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
                                    color: '#fff',
                                    fontSize: 18,
                                    fontFamily: 'Roboto',
                                    textAlign: 'center'
                                  }}
                                >
                                    {'I am  Interested! '} <Icon name='heart' size = {18} />
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
                            {
                                    'Want to Register Now?  '
                            }
                            <Icon name='checkcircle' size = {18} />
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
        </View>
      );
    }
}

export default EventDetail;
