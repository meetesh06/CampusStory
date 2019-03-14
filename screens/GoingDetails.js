/* eslint-disable consistent-return */
import React from 'react';
import {
  Alert,
  TextInput,
  TouchableOpacity,
  Animated,
  View,
  Text,
  BackHandler,
  ScrollView,
  Switch,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Constants from '../constants';
import SessionStore from '../SessionStore';

const WIDTH = Dimensions.get('window').width;

class GoingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    this.handleClose = this.handleClose.bind(this);
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
    this.handleClose();
    return true;
  }

  state = {
    name: '',
    email: '',
    phone: '',
    auto : false,
    future : true,
  }

  componentDidMount() {
    this.mounted = true;
    Animated.spring(
      this.position,
      {
        toValue: 300,
        friction: 5
      }
    ).start();
    let user_data = new SessionStore().getValue(Constants.USER_DATA);
    if(user_data === null || user_data === undefined) return;
    if(this.mounted) this.setState({name : user_data.name, email : user_data.email, phone : user_data.phone, auto : true});
  }

  handleClose = () => {
    const { componentId } = this.props;
    Animated.timing(
      this.position,
      {
        duration: 300,
        toValue: 0,
      }
    ).start(() => { Navigation.dismissOverlay(componentId); });
  }

  clear = () => {
    if(this.mounted) this.setState({ name: '', email: '', phone: '', auto : false, future : true });
  }

  handleSubmit = async () => {
    const {
      name,
      email,
      phone,
      future
    } = this.state;

    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // eslint-disable-next-line no-useless-escape
    const re1 = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

    if (name.length < 3) return Alert.alert('Please put valid name.');
    if (!re.test(email.toLowerCase())) return Alert.alert('Please put valid email.');
    if (!re1.test(phone.toLowerCase())) return Alert.alert('Please put valid phone.');
    
    const data = {
      name, email, phone
    };
    this.props.submit(data);
    if(future){
      let user_data = {}
      user_data['name'] = name;
      user_data['email'] = email;
      user_data['phone'] = phone;
      new SessionStore().putValue(Constants.USER_DATA, user_data);
    }
    this.handleClose();
  }

  render() {
    const {
      name,
      email,
      phone,
      auto,
      future
    } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Roboto',
            fontSize: 22,
            margin: 5,
            color: '#fff'
          }}
        >
                  Enter Contact Details
        </Text>
        <Animated.View style={{
          width: WIDTH - 40,
          marginLeft: 20,
          // flex: 2,
          borderRadius: 10,
          overflow: 'hidden',
          height: this.position,
          backgroundColor: '#fff'
        }}
        >
          <ScrollView
            style={{
              flex: 1,
              // justifyContent: 'center'
            }}
          >
            <TextInput
              keyboardAppearance = 'dark'
              autoCapitalize="none"
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 10,
                marginLeft: 5,
                marginRight: 5,
                borderRadius: 10,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your Full Name"
              onChangeText={val => {if(this.mounted) this.setState({ name: val })}}
              value={name}
            /> 
            <TextInput
              autoCapitalize="none"
              keyboardType = 'email-address'
              keyboardAppearance = 'dark'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 10,
                marginLeft: 5,
                marginRight: 5,
                borderRadius: 10,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your E-mail ID"
              onChangeText={val => {if(this.mounted) this.setState({ email: val })}}
              value={email}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType = 'phone-pad'
              keyboardAppearance = 'dark'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 10,
                marginLeft: 5,
                marginRight: 5,
                borderRadius: 10,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your Phone Number"
              onChangeText={val => {if(this.mounted) this.setState({ phone: val })}}
              value={phone}
            />

            {
              <View style={{flexDirection : 'row', marginBottom: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: '#555', flex: 1, marginLeft: 15 }}>
                  {'Save these details for future use.'}
                </Text>
                <Switch value={future} onValueChange={ val => {if(this.mounted) this.setState({ future: val })}} />
              </View>
            }
            
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ backgroundColor: '#c0c0c0', width: '50%' }} onPress={this.clear}>
              <Text
                style={{
                  fontSize: 22,
                  padding: 5,
                  color: '#fff',
                  textAlign: 'center',
                  margin: 5
                }}
              >
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#2E8B57', width: '50%' }} onPress={this.handleSubmit}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#fff',
                  padding: 5,
                  textAlign: 'center',
                  margin: 5
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        
        </Animated.View>

        <TouchableOpacity
          style={{
            height: 100,
            justifyContent: 'center',
          }}
          onPress={this.handleClose}
        >

          <Text
            style={{
              textAlign: 'center',
              color: '#fff'
            }}
          >
            {
              'Cancel'
            }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default GoingDetails;
