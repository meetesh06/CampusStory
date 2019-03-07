import React from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import urls from '../URLS';
import axios from 'axios';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';
import firebase from 'react-native-firebase';

class PrivateChannel extends React.Component {
  state = {
    enabled : false,
    hash : '',
    error : '',
  }

  handlePress = () =>{
    if(this.state.enabled){
      if(this.state.hash.length < 6){
        Alert.alert('Please put a valid passkey.');
      } else {
        this.submit(this.state.hash);
      }
    } else {
      this.setState({enabled : !this.state.enabled});
    }
  }


  submit = (hash) =>{
    this.setState({error : ''});
    const URL =  urls.FOLLOW_URL;
    const _id = this.props.item._id;
    axios.post(URL, {channel_id :_id, hash}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(Constants.TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        Realm.getRealm((realm) => {
          realm.write(() => {
            realm.create('Firebase', { _id, notify: true, type: 'channel', private : true});
            firebase.messaging().subscribeToTopic(_id);
          });
        });
        this.hanleOpen(_id, this.props.item.name);
      } else {
        this.setState({error : response.data.mssg, hash : ''});
      }
    }).catch(e=>{
      new SessionStore().pushLogs({type : 'error', line : 54, file : 'PrivateChannels.js', err : e});
    });
  }

  hanleOpen = (_id, channel_name) =>{
    Navigation.showOverlay({
      component: {
        name: 'Channel Detail Screen',
        passProps: {
          id : _id,
          modal: true
        },
        options: {
          bottomTabs: {
            animate: true,
            drawBehind: true,
            visible: false
          },
          topBar: {
            title: {
              text: channel_name
            },
            visible: true
          }
        }
      }
    });
    Navigation.dismissModal(this.props.componentId);
  }
  
  render() {
    const{
      media,
      width,
      height
    } = this.props;
    return (
      <View style={{
        width,
        backgroundColor : '#555',
        borderRadius : 10,
        padding : 10,
        margin : 10,
        marginTop : 5,
        justifyContent : 'center',
        alignItems : 'center'
      }}>

        <FastImage
            style={{
              width : width > height ? width / 2 + 20 : height / 2 + 20,
              height : width > height ? width / 2 + 20: height / 2 + 20,
              borderRadius: width > height ? width : height,
            }}
            source={{ uri: encodeURI( urls.PREFIX + '/' +  `${media}`) }}
            resizeMode={FastImage.resizeMode.cover}
          />

          <TouchableOpacity style={{padding : 10, borderRadius : 10, backgroundColor : '#777', margin : 5, marginBottom : 10, marginTop : 10}} onPress ={this.handlePress}>
            <Text style={{color : '#ddd', fontSize : 15}}>{this.state.enabled ? 'Verify PassKey' :'Enter PassKey'}</Text>
          </TouchableOpacity>

          { this.state.enabled &&
          <TextInput
              keyboardAppearance = 'dark'
              keyboardType = 'url'
              numberOfLines = {1}
              maxLength = {10}
              secureTextEntry
              placeholderTextColor = '#999'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding : 3,
                marginBottom : 2, 
                color : '#fff',
                width : '100%',
                borderRadius : 10,
                backgroundColor: '#222'
              }}
              placeholder="Secret Key"
              onChangeText={val => this.setState({ hash: val })}
              value={this.state.hash}
            />
          }
          {
            this.state.error !== '' && 
            <Text style={{color : '#FF6A16', fontSize : 12, textAlign : 'center'}}>{this.state.error}</Text>
          }
      </View> 
    )
  }
}

export default PrivateChannel;
