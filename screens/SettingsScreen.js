/* eslint-disable global-require */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

class SettingsScreen extends React.Component {
  render() {
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
            marginBottom: 10,
            marginTop: 10,
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
            Settings
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
      </SafeAreaView>
    );
  }
}

export default SettingsScreen;
