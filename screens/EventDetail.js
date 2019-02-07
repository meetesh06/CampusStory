/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  StatusBar,
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
import { getMonthName, formatAMPM } from './helpers/functions';

const WIDTH = Dimensions.get('window').width;
const { TOKEN } = Constants;

class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.success = this.success.bind(this);
    this.handleGoing = this.handleGoing.bind(this);
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
        'x-access-token': await AsyncStorage.getItem(TOKEN)
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
            const ts = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            el.ms = ts;
            el.reg_end = new Date(el.reg_end);
            el.reg_start = new Date(el.reg_start);
            el.interested = interested;
            el.going = going;
            console.log(el);
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
        'x-access-token': await AsyncStorage.getItem(TOKEN)
      }
    }).then((response) => {
      const responseObj = response.data;
      if (!responseObj.error) {
        Realm.getRealm((realm) => {
          realm.write(() => {
            try {
              realm.create('Events', { _id, interested: 'true' }, true);
              this.setState({ item: { ...item, interested: 'true' } });
            } catch(e) {
              console.log(e);
            }
          });
        });
      }
    }).catch(err => console.log(err))
      .finally(() => this.setState({ loading: false }));
  }

    handleGoing = () => {
      const { loading } = this.state;
      const { item } = this.props;
      const { _id } = item;
      if (loading) return;
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
            going
          },
          options: {
            overlay: {
              interceptTouchOutside: true
            }
          }
        }
      });
    }

    success = () => {
      const { item } = this.props;
      this.setState({ item: { ...item, going: 'true' } });
    }

    render() {
      const { item, loading } = this.state;
      const { componentId } = this.props;
      return (
        <View
          style={{
            flex: 1,
          }}
        >
        
        <StatusBar barStyle="light-content" hidden />
        

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
                source={{ uri: `https://www.mycampusdock.com/${JSON.parse(item.media)[0]}` }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{
                position: 'absolute', top: 15, flexDirection : 'row', right: 15,
              }}
              >

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  textAlign: 'right',
                  width: 35,
                  left : 10,
                  height: 35,
                  padding : 5
                }}
                onPress={() => Navigation.dismissModal(componentId)}
              >
                <Icon style={{ alignSelf: 'flex-end', color: '#000' }} size={25} name="close" />
              </TouchableOpacity>
              <View style={{flex : 1,}} />
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',  borderRadius: 5}}>
                <Text style={{
                  fontSize: 15, color: '#efefef',  marginLeft: 10, marginRight: 10, margin: 5
                }}
                >
                  {item.category.toUpperCase()}
                </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                // margin: 5,
                flex: 1,
                marginTop: 5,
                marginLeft: 5,
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
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                padding: 5,
                flexDirection: 'row'
              }}
            >
            {
              item.faq.length > 0 && 
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
                            padding: 20,
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
                                    fontSize: 20,
                                    fontFamily: 'Roboto',
                                    textAlign: 'center'
                                  }}
                                >
                                    I'M INTERESTED
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
                            padding: 20,
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
                              fontSize: 20,
                              fontFamily: 'Roboto',
                              textAlign: 'center'
                            }}
                          >
                            {
                                    !loading
                                    && 'Want to Register Now?'
                                }
                          </Text>
                        </TouchableOpacity>
                        ) }
            { item.interested === 'true' && item.going === 'true'
                        && (
                        <TouchableOpacity
                          style={{
                            padding: 20,
                            backgroundColor: '#c0c0c0',
                            flex: 1
                          }}
                        >
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 20,
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
