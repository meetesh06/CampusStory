/* eslint-disable global-require */
import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import { processRealmObj, timelapse } from '../screens/helpers/functions';
import Realm from '../realm';

class NotificationsAllScreen extends React.Component {
  state ={
    notifications: []
  }

  componentDidMount() {
    const {
      _id
    } = this.props;
    Realm.getRealm((realm) => {
      const Notifications = realm.objects('Notifications').filtered(`audience="${_id}"`).sorted('timestamp', true);
      processRealmObj(Notifications, (result) => {
        console.log(result);
        this.setState({ notifications: result });
      });
    });
  }

  render() {
    const {
      notifications
    } = this.state;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >

        <View
          style={{
            justifyContent: 'center',
            // height: 50,
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row'
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: '#fff',
              fontSize: 20,
              marginLeft: 10
            }}
          >
            {this.props.title}
          </Text>
          <TouchableOpacity
            style={{
              flex: 1
            }}
            onPress={() => {
              Navigation.dismissModal(this.props.componentId)
            }}
          >
            <Icon size={20} style={{ position: 'absolute', right: 15, color: '#FF6A15' }} name="closecircle" />
          </TouchableOpacity>
        </View>
        <FlatList
          // horizontal
          keyExtractor={(item, index) => `${index}`}
          data={notifications}
          renderItem={(value) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#f0f0f0',
                margin: 5,
                borderRadius: 5
              }}
            >
              <Text
              numberOfLines={3}
              style={{
                flex: 1,
                fontFamily: 'Roboto',
                color: '#000',
                margin: 10
              }}
              >
                {JSON.stringify(value.item.message)}
              </Text>
              <Text style={{
                textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#333', marginRight: 10, marginBottom: 10
              }}
              >
                {/* {' '}
                {JSON.stringify(value.item.timestamp)}
                {' '} */}
                {timelapse(new Date(value.item.timestamp))}
                  {' ago'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }
}

export default NotificationsAllScreen;
