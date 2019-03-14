/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  BackHandler,
  Text,
  Platform
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import {logout} from './helpers/functions';
import urls from '../URLS';

class HelpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      email : '',
      phone : '',
      gender : 'm',
      count : 0,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () =>{
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  componentDidMount(){
    this.mounted = true;
    new SessionStore().pushTrack({type : 'OPEN_PROFILE'});
    let user_data = new SessionStore().getValue(Constants.USER_DATA);
    if(user_data === null || user_data === undefined) return;
    this.setState({name : user_data.name, email : user_data.email, phone : user_data.phone, gender : user_data.gender === undefined ? 'm' : user_data.gender});
  }

  handleSubmit = async () => {
    const {
      name,
      email,
      phone,
      gender
    } = this.state;

    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // eslint-disable-next-line no-useless-escape
    const re1 = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

    if (name.length < 3) return Alert.alert('Please put valid name.');
    if (!re.test(email.toLowerCase())) return Alert.alert('Please put valid email.');
    if (!re1.test(phone.toLowerCase())) return Alert.alert('Please put valid phone.');
    const store = new SessionStore();
    let user_data = store.getValue(Constants.USER_DATA);
    if(user_data === null || user_data === undefined){
      user_data = {}
    }
    user_data['name'] = name;
    user_data['email'] = email;
    user_data['phone'] = phone;
    user_data['gender'] = gender;
    store.putValue(Constants.USER_DATA, user_data);
    Navigation.dismissOverlay(this.props.componentId);
  }

  handleMysteryLogout = () =>{
    if(urls.DEBUG_APP) return logout();
    this.setState({count : this.state.count + 1});
    if(this.state.count > 50){
      return logout();
    }
  }

  render() {
    const {
      name, email, phone,
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
              fontSize: 22,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'My Profile  '}
          </Text>
          
          <TouchableOpacity onPress={this.handleMysteryLogout}>
            <Text><IconIon name = 'md-person' size = {25} color = '#ddd' /></Text>
          </TouchableOpacity>
          <View style={{flex : 1}} />
          <TouchableOpacity
            style={{
              padding : 10,
              paddingLeft : 30
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
        <View
            style={{
              flex: 1,
              justifyContent: 'center'
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
              onChangeText={val => this.setState({ name: val })}
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
              onChangeText={val => this.setState({ email: val })}
              value={email}
            />
            
            <TextInput
              keyboardAppearance = 'dark'
              autoCapitalize="none"
              keyboardType = 'phone-pad'
              placeholderTextColor = '#999'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 15,
                marginBottom : 3, 
                margin : 10, 
                color : '#fff',
                borderRadius : 10,
                backgroundColor: '#555'
              }}
              placeholder="Your Phone Number"
              onChangeText={val => this.setState({ phone: val })}
              value={phone}
            />

            <View style={{margin : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
              <TouchableOpacity style={{padding : 2, backgroundColor : this.state.gender === 'm' ? '#FF6A16' : 'transparent', borderRadius : 10}} onPress= {()=>this.setState({gender : 'm'})}>
                <View style={{backgroundColor : '#555', borderRadius : 10, padding : 10, paddingLeft : 20, paddingRight : 20}}>
                  <IconMaterial name = {'human-male'} size = {70} color = '#ddd' />
                  <Text style={{fontSize : 20, color : '#999', textAlign : 'center',}}>{' MALE '}</Text>
                </View>
              </TouchableOpacity>
              
              <View style={{width : 50, height :100}} />
              
              <TouchableOpacity style={{padding : 2, backgroundColor : this.state.gender  === 'f' ? '#FF6A16' : 'transparent', borderRadius : 10}} onPress= {()=>this.setState({gender : 'f'})}>
                <View style={{backgroundColor : '#555', borderRadius : 10, padding : 10, paddingLeft : 20, paddingRight : 20}}>
                  <IconMaterial name = {'human-female'} size = {70} color = '#ddd' />
                  <Text style={{fontSize : 19, color : '#999', textAlign : 'center',}}>{'FEMALE'}</Text>
                </View>
              </TouchableOpacity>
              </View>
              <Text style={{color : '#999', fontSize : 12, margin : 10, textAlign : 'center'}}>{'This data will be stored for future use in registering events.'}</Text>
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
              <Text style={{color : '#fff', marginLeft : 10, marginRight :10, margin : 5, fontSize : 20, textAlignVertical : 'center', textAlign : 'center'}}>{' Update Details '}</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default HelpScreen;
