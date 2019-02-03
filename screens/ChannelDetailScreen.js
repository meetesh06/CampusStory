import React from 'react';
import {
  TouchableOpacity, Dimensions, View, Text, ScrollView
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import firebase from 'react-native-firebase';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import { processRealmObj } from './helpers/functions';

const WIDTH = Dimensions.get('window').width;

class ChannelDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
  }

    state = {
      item: null,
      subscribed: false,
      notify: false
    }

    componentDidMount() {
      const { id } = this.props;
      Realm.getRealm((realm) => {
        const element = realm.objects('Firebase').filtered(`_id="${id}"`);
        const item = realm.objects('Channels').filtered(`_id="${id}"`);
        processRealmObj(element, (result) => {
          console.log(result);
          if (result.length > 0) {
            this.setState({ subscribed: true, notify: result[0].notify !== 'false' });
          }
        });
        processRealmObj(item, (result) => {
          console.log(result[0]);
          this.setState({ item: result[0] });
        });
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
              realm.create('Firebase', { _id, notify: 'true', channel: 'true' }, true);
              firebase.messaging().subscribeToTopic(_id);
              this.setState({ notify: true });
            } catch (e) {
              console.log(e);
            }
          } else {
            try {
              const element = realm.objects('Firebase').filtered(`_id="${_id}"`);
              realm.delete(element);
              realm.create('Firebase', { _id, notify: 'false', channel: 'true' });
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
      const {
        _id
      } = item;
      if (item === null) return;
      Realm.getRealm((realm) => {
        realm.write(() => {
          if (!subscribed) {
            try {
              realm.create('Firebase', { _id, notify: 'false', channel: 'true' });
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

    render() {
      const {
        item,
        subscribed,
        notify
      } = this.state;
      const { componentId } = this.props;
      return (
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1
          }}
        >

          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                textAlign: 'left',
                flexDirection: 'row',
                paddingRight: 10,
                paddingLeft: 10
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  // backgroundColor: 'red',
                  textAlign: 'right',
                  width: 35,
                  height: 35
                }}
                onPress={() => Navigation.dismissModal(componentId)}
              >
                <Icon style={{ alignSelf: 'flex-end', color: '#a0a0a0' }} size={25} name="close" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: '#fff'
              }}
            >

              {
                item !== null
                && (
                <FastImage
                  style={{
                    width: WIDTH - 20, marginLeft: 10, marginTop: 10, height: 200, borderRadius: 10, backgroundColor: '#000'
                  }}
                  source={{ uri: `https://www.mycampusdock.com/${JSON.parse(item.media)[0]}` }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                )
              }
            </View>
            <Text
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Roboto-Light'
              }}
            >
              ABOUT US
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'Roboto-Light',
                fontSize: 15,
                padding: 10,
                backgroundColor: '#e0e0e0',
                margin: 10,
                borderRadius: 10,
                minHeight: 50,
                overflow: 'hidden',
                textAlign: 'center',
                color: '#333'
              }}
            >
              {item !== null && item.description}
            </Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row'
              }}
            />
          </ScrollView>
          <View
            style={{
              backgroundColor: subscribed ? '#c0c0c0' : 'blue',
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              onPress={this.handleSubscribe}
              style={{
                padding: 20,
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
                            padding: 20,
                            backgroundColor: notify ? '#c0c0c0' : '#0a9ad3',
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
                                GET NOTIFIED
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
