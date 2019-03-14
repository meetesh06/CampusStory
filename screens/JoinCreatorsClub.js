/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Platform,
  BackHandler,
  TextInput
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import urls from '../URLS';
import SessionStore from '../SessionStore';
import Constants from '../constants';

class JoinCreatorsClub extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount(){
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () =>{
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  state = {
    name : '',
    email : '',
    phone : '',
    channel_name : '',
    channel_type : '',
    handle : '',
    channel_description : ''
  }

  submit = () =>{
    const private_channels = true;
    axios.post(urls.GET_CATEGORY_CHANNEL_URL, {category : 'xxx', private : private_channels}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(Constants.TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        const list = response.data.data;
        const already = this.state.already;
        const already_list = [];
        const final_list = [];
        for(let i=0; i<already.length; i++){
          already_list.push(already[i]._id);
        }
        for(let i=0; i<list.length; i++){
          if(already_list.includes(list[i]._id))continue;
          final_list.push(list[i]);
        }
        if(this.mounted) this.setState({channels : final_list, error : false, refreshing : false});
      } else {
        if(this.mounted) this.setState({error : true, mssg : 'No Internet Connection', refreshing : false});
      }
    }).catch((e)=>{
      console.log(e);
      new SessionStore().pushLogs({type : 'error', line : 75, file : 'ListPrivateChannels.js', err : e});
    });
  }

  render() {
    const {
      name, email, phone, channel_name, handle, channel_type, channel_description
    } = this.state;
    
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
              fontSize: 20,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'Become a Creator  '}
          </Text>
          <IconFontAwesome5 name = 'user-tie' size = {20} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10, 
            }}
            onPress={() => {
              Navigation.dismissOverlay(this.props.componentId);
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
        <TextInput
            keyboardAppearance = 'dark'
            autoCapitalize="none"
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="Your Full Name"
            onChangeText={val => {if(this.mounted) this.setState({ name: val })}}
            value={name}
          />

          <TextInput
            keyboardAppearance = 'dark'
            autoCapitalize="none"
            keyboardType = 'email-address'
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="Your E-mail ID"
            onChangeText={val => {if(this.mounted) this.setState({ email: val })}}
            value={email}
          />

          <TextInput
            keyboardAppearance = 'dark'
            keyboardType = 'phone-pad'
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="Your Phone Number"
            onChangeText={val => {if(this.mounted) this.setState({ phone: val })}}
            value={phone}
          />

          <TextInput
            keyboardAppearance = 'dark'
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="Your Channel Name"
            onChangeText={val => {if(this.mounted) this.setState({ channel_name: val })}}
            value={channel_name}
          />

          <TextInput
            keyboardAppearance = 'dark'
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="+ Youtube / Instagram / Facebook"
            onChangeText={val => {if(this.mounted) this.setState({ handle: val })}}
            value={handle}
          />

          <TextInput
            textBreakStrategy = 'highQuality'
            keyboardAppearance = 'dark'
            multiline = {true}
            placeholderTextColor = '#999'
            style={{
              textAlign: 'center',
              fontSize: 15,
              padding: 15,
              margin : 10, 
              minHeight : 100,
              marginBottom : 3, 
              color : '#fff',
              borderRadius : 10,
              backgroundColor: '#555'
            }}
            placeholder="Tell us about your channel"
            onChangeText={val => {if(this.mounted) this.setState({ channel_description: val })}}
            value={channel_description}
          />
          <Text style={{color : '#999', fontSize : 12, margin : 10, textAlign : 'center'}}>{'We will verify your details if your channel matches our categories, we will keep you posted on your email as we proceed on your application, please provide your popular youtube facebook or instagram handle which will help us to identify you confidently. This usually takes around 3 days of time but can be extended upto a working week.'}</Text>
          <View
            style={{
              alignSelf: 'center',
              elevation: 10,
              backgroundColor: '#444',
              padding: 5,
              marginTop : 10,
              borderRadius: 30,
              marginBottom: 30
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6A15',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                flexDirection : 'row'
              }}
              onPress={this.handleSubmit}
            >
              <Text style={{color : '#fff', marginLeft : 10, marginRight :10, margin : 5, fontSize : 20, textAlignVertical : 'center', textAlign : 'center'}}>{' Submit '}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default JoinCreatorsClub;
