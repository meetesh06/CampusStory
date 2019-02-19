/* eslint-disable consistent-return */
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Animated,
  View,
  Text,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Constants from '../constants';
import Realm from '../realm';
import SessionStore from '../SessionStore';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;
const { TOKEN } = Constants;

class GoingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    this.handleClose = this.handleClose.bind(this);
  }

  state = {
    name: '',
    email: '',
    phone: '',
    loading: false
  }

  componentDidMount() {
    Animated.spring(
      this.position,
      {
        toValue: 300,
        friction: 5
      }
    ).start();
    let user_data = new SessionStore().getValue(Constants.USER_DATA);
    if(user_data === null || user_data === undefined) return;
    this.setState({name : user_data.name, email : user_data.email, phone : user_data.phone});
  }

  handleClose = () => {
    const { componentId, updateStatus } = this.props;
    Animated.timing(
      this.position,
      {
        duration: 300,
        toValue: 0,
      }
    ).start(() => { updateStatus(); Navigation.dismissOverlay(componentId); });
  }

  clear = () => {
    this.setState({ name: '', email: '', phone: '' });
  }

  handleSubmit = async () => {
    const {
      loading,
      name,
      email,
      phone
    } = this.state;
    const {
      _id
    } = this.props;
    const { handleClose } = this;
    if (loading) return;

    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // eslint-disable-next-line no-useless-escape
    const re1 = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

    if (name.length < 3) return Alert.alert('Please put valid name.');
    if (!re.test(email.toLowerCase())) return Alert.alert('Please put valid email.');
    if (!re1.test(phone.toLowerCase())) return Alert.alert('Please put valid phone.');
    this.setState({ loading: true });
    axios.post(urls.SET_ENROLLED, {
      _id, name, email, phone
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      console.log(response);
      if (!response.data.error) {
        Realm.getRealm((realm) => {
          realm.write(() => {
            realm.create('Events', { _id, going: 'true' }, true);
          });
          handleClose();
        });
      } else { this.setState({ loading: false }); }
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const {
      loading,
      name,
      email,
      phone
    } = this.state;
    const {
      going
    } = this.props;
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
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <TextInput
              autoCapitalize="none"
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 15,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your Full Name"
              onChangeText={val => this.setState({ name: val })}
              value={name}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType = 'email-address'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 15,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your E-mail ID"
              onChangeText={val => this.setState({ email: val })}
              value={email}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType = 'phone-pad'
              style={{
                textAlign: 'center',
                fontSize: 15,
                padding: 15,
                marginTop: 10,
                marginBottom : 10,
                backgroundColor: '#f0f0f0'
              }}
              placeholder="Your Phone Number"
              onChangeText={val => this.setState({ phone: val })}
              value={phone}
            />


          </View>
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

            <TouchableOpacity style={{ backgroundColor: going === 'true' ? '#c0c0c0' : '#2E8B57', width: '50%' }} onPress={this.handleSubmit}>
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
          disabled={this.loading}
          onPress={this.handleClose}
        >
          {
            loading
            && <ActivityIndicator size="small" color="#fff" />
          }

          <Text
            style={{
              textAlign: 'center',
              color: '#fff'
            }}
          >
            {
              !loading
              && 'Cancel'
            }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default GoingDetails;
