/** @format */
import { Navigation } from 'react-native-navigation';
import React from 'react';
import { TouchableOpacity, Platform, AppState, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
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
import NotificationsAllScreen from './screens/NotificationsAllScreen';
import BackupScreen from './screens/BackupScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import Constants from './constants';
import SessionStore from './SessionStore';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import InterestsDetailsScreen from './screens/InterestsDetailsScreen';
import ChannelsListScreen from './screens/ChannelsListScreen';
import ListPrivateChannels from './screens/ListPrivateChannels';
import NotificationsSettings from './screens/NotificationsSettings';
import AboutUsScreen from './screens/AboutUsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';


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

const HeartIcon = () => (
  <TouchableOpacity
    style={{
      flex: 1,
      padding : 10,
      alignItems : 'center',
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
    <Icon size={22} style={{ color: '#fa3e3e' }} name="heart"/>
  </TouchableOpacity>
);

const SettingsIcon = () => (
  <TouchableOpacity
    style={{
      flex: 1,
      padding : 10,
    }}
    onPress={
      () => {
        Navigation.showModal({
          component: {
            name: 'Settings Screen',
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
    <Icon1 size={22} style={{ color: '#fff' }} name="settings"/>
  </TouchableOpacity>
);

const HelpIcon = () => (
  <TouchableOpacity
    style={{
      flex: 1,
      padding : 10,
    }}
    onPress={()=>  Navigation.showModal({
      component: {
        name: 'Help Screen',
        options: {
          topBar: {
            visible: false
          }
        }
      }
    })
  }
  >
    <Icon1 size={22} style={{ color: '#fff' }} name="help-circle"/>
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
Navigation.registerComponent('app.SettingsIcon', () => SettingsIcon);
Navigation.registerComponent('app.HelpIcon', () => HelpIcon);
Navigation.registerComponent('Preview Overlay Screen', () => PreviewOverlayScreen);
Navigation.registerComponent('Discover Preview', () => DiscoverPreview);
Navigation.registerComponent('Event Register', () => EventRegister);
Navigation.registerComponent('Interested Screen', () => InterestedScreen);
Navigation.registerComponent('Notifications All Screen', () => NotificationsAllScreen);
Navigation.registerComponent('Backup Screen', () => BackupScreen);
Navigation.registerComponent('Settings Screen', () => SettingsScreen);
Navigation.registerComponent('Help Screen', () => HelpScreen);
Navigation.registerComponent('Profile Details Screen', () => ProfileDetailsScreen);
Navigation.registerComponent('Channels List Screen', () => ChannelsListScreen);
Navigation.registerComponent('Interests Details Screen', () => InterestsDetailsScreen);
Navigation.registerComponent('List Private Channels', () => ListPrivateChannels);
Navigation.registerComponent('Notifications Settings', () => NotificationsSettings);
Navigation.registerComponent('About Us Screen', () => AboutUsScreen);
Navigation.registerComponent('Privacy Policy Screen', () => PrivacyPolicyScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  AppState.addEventListener('change', this.onAppStateChanged);
  const store = new SessionStore();
  await store.getValueBulk();
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
    console.log('Background - Forground'); /* forground */
  } else if(nextAppState === 'background') {
    console.log('Background'); /* background */
    const ts = new SessionStore().getValueTemp(Constants.APP_USAGE_TIME);
    const cs = new Date().getTime();
    const timespent = (cs - ts) /1000;
    new SessionStore().pushTrack({timespent, type : Constants.APP_USAGE_TIME});
    new SessionStore().putValueTemp(Constants.APP_USAGE_TIME, cs);
    await new SessionStore().setValueBulk();
  } else if(nextAppState === 'active'){
    console.log('Forground'); /* from background to forground */
  }
  this.state.appState = nextAppState;
};
