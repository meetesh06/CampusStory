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
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../constants';
import { goToInterestsSelector, goHome } from './helpers/Navigation';
import SessionStore from '../SessionStore';

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
      <View style={{ flex: 1 }}>
      {
          Platform.OS === 'ios'
          && (<StatusBar barStyle="light-content" translucent />)
        }
        <LinearGradient style={{ flex: 1 }} colors={['#FF4A3F', '#FF6A15']}>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Image
              source={logoWhite}
              style={{
                width: 120, height: 120, resizeMode: 'contain', alignSelf: 'center'
              }}
            />
            <Text style={{
              textAlign: 'center', marginTop: 20, color: 'white', fontSize: 35, fontFamily: 'Roboto-Regular'
            }}
            >
              {' '}
              Campus Story
              {' '}
            </Text>
            <Text style={{
              textAlign: 'center', marginTop: 20, color: 'white', fontSize: 20, fontFamily: 'Roboto-Light'
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
                    backgroundColor: '#fff', alignItems: 'center', marginLeft: 20, marginRight: 20, padding: 15, borderRadius: 10
                  }}
                  >
                    <Text style={{ fontFamily: 'Roboto-Regular' }}>Let's get started</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          </View>
        </LinearGradient>
      </View>
    );
  }
}
export default App;
