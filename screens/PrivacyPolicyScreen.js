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
import SessionStore from '../SessionStore';

class PrivacyPolicyScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  }

  componentDidMount(){
    new SessionStore().pushTrack({type : 'OPEN_T_N_C'});
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
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Terms & Conditions '} <IconIon name = 'ios-paper' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'PLEASE READ THESE T&C CAREFULLY\n\nCLICKING “I ACCEPT,” OR BY DOWNLOADING, INSTALLING, OR OTHERWISE ACCESSING OR USING THE SERVICE, YOU AGREE THAT YOU HAVE READ AND UNDERSTOOD AND, AS A CONDITION TO YOUR USE OF THE SERVICE, YOU AGREE TO BE BOUND BY, THE FOLLOWING TERMS AND CONDITIONS, INCLUDING CAMPUS STORY\'S PRIVACY POLICY AND ANY ADDITIONAL TERMS AND POLICIES CAMPUS STORY MAY PROVIDE FROM TIME TO TIME (TOGETHER, THESE "TERMS")'
              +
              '\n\nIf you are not eligible, or do not agree to the Terms, then you do not have our permission to use the Service. YOUR USE OF THE SERVICE, AND CAMPUS STORY\'S PROVISION OF THE SERVICE TO YOU, CONSTITUTES AN AGREEMENT BY CAMPUS STORY AND BY YOU TO BE BOUND BY THESE TERMS. '
              +
              '\n\n* All of the services provided to users are free unless stated or marked specially, reseeling of such items & content is illlegal.'
              +
              '\n\n* All of the data exchanged by users on the Campus Story will be covered under Privacy Policies and in case of any dispute final decision regarding the same will be taken by the Campus Story Owners & Board.'
              +
              '\n\n* Any data uploaded in any form using the service will belong to Campus Story and Campus Story will never be hold responsible for using it & modifying it in any manner.'
              +
              '\n\nANY UPDATE REGARDING THE PRIVACY POLICY WILL BE UPDATED IN VARIOUS SECTIONS IN APP IMMEDIATLY AND WILL BE CONVEYED THROUGH EMAIL IF POSSIBLE'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Privacy Policy '} <IconIon name = 'md-lock' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'PLEASE READ IT CAREFULLY.\n\nPrivacy Policy Campus Story provides the app owners the rights to modify , reuse the data in any manner possible without prior notice to the user.\n\n'
              +
              '* Any data shared on the campus story in any form will never be shared directly to any third party clients without user\'s permission.\n\n'
              +
              '* All of the data exchanged on campus story belong to campus story and in case of dispute app owners preserve the rights to make final decision regarding the same.\n\n'
              +
              '* Campus Story app collects the app usage data & basic system information like OS versions, IDs to improve user experience and better understanding the interests of the user.\n\n'
              +
              '* All the data collected by the app is uploaded to campus story owned private server and data will be preserved for future access.'
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

export default PrivacyPolicyScreen;
