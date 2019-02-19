/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

class HelpScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#222'
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            padding : 10,
            flexDirection: 'row'
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: '#ddd',
              fontSize: 22,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'Privacy Policy  '}
          </Text>
          <IconIon name = 'md-information-circle-outline' color = '#fff' size = {25} style={{alignSelf : 'center',}} />
          {/* <IconMaterial name = 'help-circle' size = {25} color = '#ddd' /> */}
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
            }}
            onPress={() => {
              Navigation.dismissModal(this.props.componentId)
            }}
          >
            <Icon size={22} style={{ position: 'absolute', right: 5, color: '#FF6A16', }} name="closecircle" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor : '#333'
          }}
        >
        </ScrollView>
        <View style={{position : 'absolute', bottom : 20, alignSelf : 'center'}}>
            <Text style={{fontSize : 12, color : '#888'}}>Campus Dock © 2019</Text>
          </View>
      </SafeAreaView>
    );
  }
}

export default HelpScreen;
