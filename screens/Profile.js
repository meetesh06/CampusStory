/* eslint-disable global-require */
import React from 'react';
import {
  SafeAreaView,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
  View,
  RefreshControl,
  Text
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { Navigation } from 'react-native-navigation';
import SessionStore from '../SessionStore';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import EventNotification from '../components/EventNotification';
import NormalNotification from '../components/NormalNotification';
import Constants from '../constants';
import { processRealmObj } from './helpers/functions';

const { TOKEN } = Constants;
const today = new Date();

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handleDisplayData = this.handleDisplayData.bind(this);
  }

  state = {
    current: today,
    refreshing: false,
    notifications: [],
    count : 0
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  handleDisplayData = () => {
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('NOT type="category"').sorted('type');
      const final = [];
      processRealmObj(Subs, (result) => {
        result.forEach((element) => {
          const current = {};
          const Notifications = realm.objects('Notifications').filtered(`audience="${element._id}"`).sorted('timestamp', true);
          try {
            current.type = Notifications[0].type;
            current._id = element._id;
            processRealmObj(Notifications, (result) => {
              current.updates = result.slice(0, 3);
            });
            // final[element._id] = lastUpdated;
            final.push(current);
          } catch (e) {
            console.log(e);
          }
        });
        this.setState({ notifications: final });
      });
    });
  }

  handleUpdateData = () => {
    this.setState({ refreshing: true });
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('NOT type="category"');
      const final = {};
      processRealmObj(Subs, (result) => {
        result.forEach((element) => {
          const Notifications = realm.objects('Notifications').filtered(`audience="${element._id}"`).sorted('timestamp', true);
          let lastUpdated;
          try {
            lastUpdated = Notifications[0].timestamp;
          } catch (e) {
            lastUpdated = 'NONE';
          }
          final[element._id] = lastUpdated;
        });
      });
      axios.post('https://www.mycampusdock.com/notifications/user/fetch', { subs: JSON.stringify(final) }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': new SessionStore().getValue(TOKEN)
        }
      }).then((response) => {
        const responseErr = response.data.error;
        const responseData = response.data.data;
        console.log(response);
        if (!responseErr) {
          responseData.forEach((value) => {
            realm.write(() => {
              try {
                realm.create('Notifications', value, true);
              } catch (e) {
                console.log(e);
              }
            });
          });
          this.handleDisplayData();
        }
      }).catch(err => console.log(err))
        .finally(() => this.setState({ refreshing: false }));
    });
  }

  handleLogout = async () => {
    console.log('CLIKING');
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

  componentDidAppear() {
    this.handleDisplayData();
  }

  render() {
    const {
      notifications
    } = this.state;
    console.log(notifications);
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >
        <TouchableOpacity onPress ={this.handleLogout}>
          <Text style={{color : '#fff'}}>LOGOUT</Text>
        </TouchableOpacity>
        <FlatList
          refreshControl={(
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={this.state.refreshing}
              onRefresh={this.handleUpdateData}
            />
          )}
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
            if (item.type === 'college') {
              console.log(item);
              return (
                <NormalNotification
                  _id={item._id}
                  title="Latest Updates"
                  updates={item.updates}
                  onPressNotification = {this.handleLogout}
                  timestamp={item.updates[0].timestamp}
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
