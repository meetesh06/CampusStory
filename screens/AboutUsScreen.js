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
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMat from 'react-native-vector-icons/MaterialIcons';

class AboutUsScreen extends React.Component {
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
            {'About Us  '}
          </Text>
          <IconIon name = 'ios-people' size = {25} color = '#ddd' />
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
        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Who are we? '} <IconIon name = 'md-people' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'A bunch of college students just like everyone, we missed on so many things going on around us. You didn\'t come for one day to college and everything happened someone gets slapped, kissed & what not.'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Why we started? '} <IconIon name = 'ios-help-circle' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'College is the best time anyone can have, you can enjoy up to most without being worried about anything, and if something missed it strikes a lot, many times opportunities got missed'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Who can use this? '} <IconMat name = 'person-pin-circle' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'It\'s fun to use apps anonymously. Anyone can use this, without sharing much of your data, get started with the basic setup screen and you are all ready to receive the relevant information in no time.'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Want to make channel? '} <IconMat name = 'person-pin' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'Channel brings a lot of power to share and spread, we want this power to be limited, if you are still interested, bring some recommendations with you and contact us on info@mycampusdock.com'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Contact Us '} <IconMat name = 'email' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'For any of your queries contact us at info@mycampusdock.com\nYou can reach us through our Instagram handle.Feel free to share your advice.'
            }
            </Text>
          </View>
        </View>
        </ScrollView>
        <View style={{position : 'absolute', bottom : 20, alignSelf : 'center'}}>
            <Text style={{fontSize : 12, color : '#888'}}>Campus Dock © 2019</Text>
          </View>
      </SafeAreaView>
    );
  }
}

export default AboutUsScreen;
