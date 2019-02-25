/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import SessionStore from '../SessionStore';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    new SessionStore().pushTrack({type : 'OPEN_SETTINGS'});
  }

  state = {
  }

  gotoScreen = (name) =>{
    Navigation.showModal({
      component: {
        name,
        options: {
          topBar: {
            visible: false
          }
        }
      }
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop : Platform.OS === 'ios' ? 45 : 8,
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
            {'Settings  '}
          </Text>
          <IconIon name = 'ios-settings' size = {25} color = '#ddd' />
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
        
        <TouchableOpacity style={{backgroundColor : '#555', marginTop : 5, marginBottom : 8}} onPress = {()=>this.gotoScreen('Profile Details Screen')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>My Profile</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>Edit your profile information</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'md-person' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor : '#555', marginBottom : 8}} onPress = {()=>this.gotoScreen('Interests Details Screen')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>My Interests</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>Edit your interests for content setting</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'md-pricetags' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor : '#555', marginBottom : 8}} onPress = {()=>this.gotoScreen('Channels List Screen')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>My Channels</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>List your subscribed channels</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'ios-albums' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor : '#555', marginBottom : 8}} onPress = {()=>this.gotoScreen('List Private Channels')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>Discover Private Channels ⋆</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>Find private channels here</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'ios-search' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor : '#555', marginBottom : 8}} onPress = {()=>this.gotoScreen('Privacy Policy Screen')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>Privacy Policy</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>Read about our terms & conditions</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'md-information-circle-outline' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor : '#555', marginBottom : 8}} onPress = {()=>this.gotoScreen('About Us Screen')}>
          <View style={{padding : 5, flexDirection : 'row', alignItems : 'center' }}>
            <View>
              <Text style={{color : '#ddd', fontSize : 18 ,marginLeft : 10}}>About Us</Text>
              <Text style={{color : '#aaa', fontSize : 12 ,marginLeft : 10, marginTop : 5, marginBottom : 5,}}>how we started?</Text>
            </View>
            <View style={{flex : 1}} />
            <View style={{padding : 5, borderRadius : 20, backgroundColor : '#777', width : 30, height : 30, marginRight : 5}}>
              <IconIon name = 'ios-people' color = '#fff' size = {20} style={{alignSelf : 'center',}} />
            </View>
          </View>
        </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}

export default SettingsScreen;
