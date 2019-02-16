/* eslint-disable global-require */
import React from 'react';
import {
  SafeAreaView,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import EventNotification from '../components/EventNotification';
import NormalNotification from '../components/NormalNotification';

const today = new Date();

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  state = {
    current: today,
    count : 0
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  handleLogout = async () => {
    const {
      count
    } = this.state;
    this.setState({ count: count + 1 });
    if (count > 16) {
      Realm.getRealm((realm) => {
        realm.write(async () => {
          realm.deleteAll();
          await AsyncStorage.clear();
          goInitializing();
        });
      });
    }
  }

  render() {
    notifications = [
      {
        type: 'event',
        _id: '4Vw8X8bmZ5QR-TyS24xCh8k96',
        updates: [
          { title: 'Update1', timestamp: new Date().toUTCString() },
          { title: 'Update2', timestamp: new Date().toUTCString() },
          { title: 'Update3', timestamp: new Date().toUTCString() },
        ]
      },
      { type: 'normal', title: 'Hush', description: '25% off with DOPE75', timestamp: new Date().toUTCString() },
      {
        type: 'event',
        _id: '4Vw8X8bmZ5QR-TyS24xCh8k96',
        updates: [
          { title: 'Update1', timestamp: new Date().toUTCString() },
          { title: 'Update2', timestamp: new Date().toUTCString() },
          { title: 'Update3', timestamp: new Date().toUTCString() },
        ]
      },
      {
        type: 'event',
        _id: '4Vw8X8bmZ5QR-TyS24xCh8k96',
        updates: [
          { title: 'Update1', timestamp: new Date().toUTCString() },
          { title: 'Update2', timestamp: new Date().toUTCString() },
          { title: 'Update3', timestamp: new Date().toUTCString() },
        ]
      },
      {
        type: 'event',
        _id: '4Vw8X8bmZ5QR-TyS24xCh8k96',
        updates: [
          { title: 'Update1', timestamp: new Date().toUTCString() },
          { title: 'Update2', timestamp: new Date().toUTCString() },
          { title: 'Update3', timestamp: new Date().toUTCString() },
        ]
      }
    ];
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >
        <View
          style={{
            height: 80,
            backgroundColor: '#222',
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              padding: 10
            }}
            onPress={() => {
              Navigation.showModal({
                component: {
                  name: 'About Screen'
                }
              });
            }}
          >
            <Icon style={{ alignSelf: 'center', color: '#FF6A15' }} size={25} name="questioncircle" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
            onPress = {this.handleLogout}
          >
            <Icon style={{ alignSelf: 'center', color: '#f0f0f0' }} size={30} name="calendar" />
            <Text
              style={{
                marginTop: 5,
                textAlign: 'center',
                color: '#f0f0f0'
              }}
            >
              12 OCT 2019
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              padding: 10
            }}
            onPress={() => {
              Navigation.showModal({
                component: {
                  name: 'About Screen'
                }
              });
            }}
          >
            <Icon1 style={{ alignSelf: 'center', color: '#FF6A15' }} size={25} name="settings" />
          </TouchableOpacity>

        </View>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={notifications}
          extraData={notifications}
          renderItem={({ item, index }) => {
            if (item.type === 'event') {
              return (
                <EventNotification
                  _id={item._id}
                  updates={item.updates}
                />
              );
            }
            if (item.type === 'normal') {
              return (
                <NormalNotification
                  title={item.title}
                  description={item.description}
                  timestamp={item.timestamp}
                />
              );
            }
          }
          }
        />
      </SafeAreaView>
    );
  }
}

export default Profile;
