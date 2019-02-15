/** @format */
import { Navigation } from 'react-native-navigation';
import React from 'react';
import { TouchableOpacity, Platform, AppState, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Initializing from './screens/Initializing';
import Interests from './screens/Interests';
import Home from './screens/Home';
import Discover from './screens/Discover';
import Profile from './screens/Profile';
import EventDetail from './screens/EventDetail';
import ChannelDetailScreen from './screens/ChannelDetailScreen';
import StoryScreen from './screens/StoryScreen';
import GoingDetails from './screens/GoingDetails';
import PreviewOverlayScreen from './screens/PreviewOverlayScreen';
import DiscoverPreview from './screens/DiscoverPreview';
import EventRegister from './screens/EventRegister';
import InterestedScreen from './screens/InterestedScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';
import Icon from 'react-native-vector-icons/AntDesign';

// import CameraScreen from './screens/CameraScreen';
import SessionStore from './SessionStore';

const whiteTopBarImage = require('./media/app-bar/logo.png');
this.state = {
  appState : AppState.currentState,
};

const homeTopBar = () => (
  <View
    style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#222'
    }}
  >
    <FastImage
      style={{
        marginTop: Platform.OS === 'android' ? 5 : 0,
        width: 36,
        margin: 5,
        height: 36
      }}
      resizeMode={FastImage.resizeMode.contain}
      source={whiteTopBarImage}
    />
    <Text style={{ fontFamily: 'Roboto', alignSelf: 'center', fontSize: 18, color: '#FF6A15' }}>Campus Story</Text>
  </View>
);



const HeartIcon = (props) => (
  <TouchableOpacity
    style={{
      flex: 1,
      justifyContent: 'center',
    }}
    onPress={
      () => {
        Navigation.showModal({
          component: {
            name: 'Interested Screen',
            options: {
              topBar: {
                visible: false
              }
            }
          }
        });
      }
    }
  >
    <Icon size={20} style={{ color: '#FF6A15' }} name="heart"/>
  </TouchableOpacity>
);

Navigation.registerComponent('Initializing Screen', () => Initializing);
Navigation.registerComponent('Interests Selection Screen', () => Interests);
Navigation.registerComponent('Home Screen', () => Home);
Navigation.registerComponent('Discover Screen', () => Discover);
Navigation.registerComponent('Profile Screen', () => Profile);
Navigation.registerComponent('Event Detail Screen', () => EventDetail);
Navigation.registerComponent('Channel Detail Screen', () => ChannelDetailScreen);
Navigation.registerComponent('Story Screen', () => StoryScreen);
Navigation.registerComponent('Going Details', () => GoingDetails);
Navigation.registerComponent('homeTopBar', () => homeTopBar);
Navigation.registerComponent('app.HeartIcon', () => HeartIcon);
Navigation.registerComponent('app.goBackButton', () => goBackButton);
Navigation.registerComponent('Preview Overlay Screen', () => PreviewOverlayScreen);
Navigation.registerComponent('Discover Preview', () => DiscoverPreview);
Navigation.registerComponent('Event Register', () => EventRegister);
Navigation.registerComponent('Interested Screen', () => InterestedScreen);
Navigation.registerComponent('About Screen', () => AboutScreen);
// Navigation.registerComponent('Camera Screen', () => CameraScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  AppState.addEventListener('change', this.onAppStateChanged);
  await new SessionStore().getValueBulk();
  this.init();
});

init = () =>{
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing Screen'
      }
    }
  });
};

onAppStateChanged = async (nextAppState) => {
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
    /* forground */
    console.log('Background - Forground');
  } else if(nextAppState === 'background') {
    /* background */
    await new SessionStore().setValueBulk();
  } else if(nextAppState === 'active'){
    /* from background to forground */
    console.log('Forground');
  }
  this.state.appState = nextAppState;
};
