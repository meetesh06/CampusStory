/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Constants from '../constants';
import { goToInterestsSelector, goHome } from './helpers/Navigation';
import SessionStore from '../SessionStore';
import firebase from 'react-native-firebase';

const logoWhite = require('../media/LogoWhite.png');

const { SET_UP_STATUS } = Constants;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.continueNext = this.continueNext.bind(this);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const status = new SessionStore().getValue(SET_UP_STATUS);
      if (status === true) {
        await new SessionStore().setSessionId();
        goHome(false);
      } else {
        firebase.messaging().subscribeToTopic('ogil7190');
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log('error: ', err);
      this.setState({ loading: false });
    }
  }

  continueNext = () => {
    goToInterestsSelector();
  }

  render() {
    const { loading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor : '#333' }}>
      {
          Platform.OS === 'ios'
          && (<StatusBar barStyle="light-content" translucent />)
        }
          <View style={{ flex: 2, justifyContent: 'center' }}>
          <View style={{padding : 3, borderRadius : 100, alignSelf : 'center'}}>
            <View style={{backgroundColor : '#555', padding : 15, borderRadius : 100, alignSelf : 'center'}}>
              <Image
                source={logoWhite}
                style={{
                  width: 120,
                  padding : 10,
                  height: 120,
                  resizeMode: 'contain',
                }}
              />
            </View>
            </View>
            <Text style={{
              textAlign: 'center', marginTop: 20, color: '#ddd', fontSize: 35, fontFamily: 'Roboto'
            }}
            >
              {' '}
              Campus Story
              {' '}
            </Text>
            <Text style={{
              textAlign: 'center', marginTop: 15, color: '#ddd', fontSize: 18, fontFamily: 'Roboto-Light'
            }}
            >
              {' '}
              Think. Learn. Inspire.
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {
              loading
              && <ActivityIndicator size="small" color="#fff" />
            }
            {
              !loading
              && (
                <TouchableOpacity
                  onPress={this.continueNext}
                >
                  <View style={{
                    backgroundColor: '#FF6A15', alignItems: 'center', marginLeft: 25, marginRight: 25, padding: 15, borderRadius: 10
                  }}
                  >
                    <Text style={{ fontFamily: 'Roboto', color : '#fff', fontSize : 16 }}>Let's get started</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          </View>
          <View style={{position : 'absolute', bottom : 20, alignSelf : 'center'}}>
            <Text style={{fontSize : 12, color : '#888'}}>Campus Dock © 2019</Text>
          </View>
      </View>
    );
  }
}
export default App;
