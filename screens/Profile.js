/* eslint-disable global-require */
import React from 'react';
import {
  FlatList,
  BackHandler,
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import SessionStore from '../SessionStore';
import Realm from '../realm';
import EventNotification from '../components/EventNotification';
import NormalNotification from '../components/NormalNotification';
import Constants from '../constants';
import { processRealmObj, stackBackHandler } from './helpers/functions';
import urls from '../URLS';

const { TOKEN, STACK } = Constants;
const today = new Date();

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handleDisplayData = this.handleDisplayData.bind(this);
  }

  state = {
    current: today,
    refreshing: false,
    notifications: [],
    count: 0
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
    this.handleUpdateData();
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
      axios.post(urls.FETCH_NOTIFICATIONS, { subs: JSON.stringify(final) }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': new SessionStore().getValue(TOKEN)
        }
      }).then((response) => {
        const responseErr = response.data.error;
        const responseData = response.data.data;
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
      }).catch((err) => {
        console.log(err);
        new SessionStore().pushLogs({
 type: 'error', line: 106, file: 'Profile.js', err 
});
      })
        .finally(() => this.setState({ refreshing: false }));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidAppear() {
    BackHandler.addEventListener('hardwareBackPress', stackBackHandler);
    const store = new SessionStore();
    const current = store.getValue(STACK);
    if (current[current.length - 1] !== 2) store.putValue(STACK, [...current, 2].slice(-3));
  }

  render() {
    const {
      notifications
    } = this.state;
    return (
      <ScrollView
        refreshControl={(
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={this.state.refreshing}
            onRefresh={this.handleUpdateData}
          />
        )}
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >
        {
        notifications.length > 0
        && <FlatList
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
              return (
                <NormalNotification
                  _id={item._id}
                  title="Latest Updates"
                  updates={item.updates}
                  touchable ={false}
                  onPressNotification ={() => console.log('Clicked')}
                  timestamp={item.updates[0].timestamp}
                />
              );
            }
          }
          }
        />
      }

        {
        notifications.length === 0
        && <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 14, color: '#ddd', textAlign: 'center' }}>
            {
              'No recent updates for you'
            }
          </Text>
        </View>
      }
      </ScrollView>
    );
  }
}

export default Profile;
