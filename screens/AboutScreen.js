/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

class AboutScreen extends React.Component {
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >
        <TouchableOpacity
          style={{
            // flex: 1,
            justifyContent: 'center',
            height: 50,
            // backgroundColor: 'red'
          }}
          onPress={() => {
            Navigation.dismissModal(this.props.componentId)
          }}
        >
          <Icon size={20} style={{ position: 'absolute', right: 15, color: '#FF6A15' }} name="closecircle" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default AboutScreen;
