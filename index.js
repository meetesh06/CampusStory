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
import ShowTagScreen from './screens/ShowTagScreen';
import CollegeSelectionScreen from './screens/CollegeSelectionScreen';
import JoinCreatorsClub from './screens/JoinCreatorsClub';


const whiteTopBarImage = require('./media/app-bar/logo.png');
this.state = {
  appState : AppState.currentState,
};

const homeTopBar = () => (
  // <FastImage
  //     style={{
  //       marginTop: Platform.OS === 'android' ? 5 : 0,
  //       width: 36,
  //       backgroundColor: 'red',
  //       margin: 5,
  //       height: 36
  //     }}
  //     resizeMode={FastImage.resizeMode.contain}
  //     source={whiteTopBarImage}
  //   />
  // <Text style={{ fontFamily: 'Roboto', alignSelf: 'center', fontSize: 18, color: '#FF6A15' }}>Campus Story</Text>

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

const LeftDummy = () => (
  <TouchableOpacity
    style={{
      flex: 1,
      // padding : 10,
      alignItems : 'center',
      justifyContent: 'center',
    }}
  >
    <Icon size={22} style={{ color: '#222' }} name="heart"/>
  </TouchableOpacity>
);

const HeartIcon = () => (
  <TouchableOpacity
    style={{
      flex: 1,
      padding: Platform.OS === 'ios' ? undefined : 10,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onPress={
      () => {
        Navigation.showOverlay({
          component: {
            name: 'Interested Screen',
            options: {
              topBar: {
                visible: false,
                drawBehind: true
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
      justifyContent: 'center',
      paddingRight: 5,
      paddingLeft : 15
    }}
    onPress={
      () => {
        Navigation.showOverlay({
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
      justifyContent: 'center',
      paddingRight: 10,
      paddingLeft: 10,
    }}
    onPress={()=>  Navigation.showOverlay({
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


init = () =>{
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing Screen'
      }
    }
  });
};

submission = async () =>{
  const ts = new SessionStore().getValueTemp(Constants.APP_USAGE_TIME);
  const cs = new Date().getTime();
  const timespent = (cs - ts) /1000;
  if(timespent > 60){
    new SessionStore().pushTrack({timespent, type : Constants.APP_USAGE_TIME});
  } else {
    new SessionStore().putValueTemp(Constants.TRACKS, []);
  }
  new SessionStore().putValueTemp(Constants.APP_USAGE_TIME, cs);
  await new SessionStore().setValueBulk();
}

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
Navigation.registerComponent('app.LeftDummy', () => LeftDummy);
Navigation.registerComponent('app.SettingsIcon', () => SettingsIcon);
Navigation.registerComponent('app.HelpIcon', () => HelpIcon);
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
Navigation.registerComponent('Show Tag Screen', () => ShowTagScreen);
Navigation.registerComponent('College Selection Screen', () => CollegeSelectionScreen);
Navigation.registerComponent('Join Creators Club', () => JoinCreatorsClub);

Navigation.events().registerAppLaunchedListener(async () => {
  AppState.addEventListener('change', this.onAppStateChanged);
  const store = new SessionStore();
  await store.getValueBulk();
  this.init();
});

onAppStateChanged = (nextAppState) => {
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
    console.log('Background - Forground');
  } else if(nextAppState === 'background') {
    console.log('Background');
    if(Platform.OS === 'android') this.submission();
  } else if(nextAppState === 'active'){
    console.log('Forground');
  } else if(nextAppState === 'inactive'){
    console.log('Inactive');
    if(Platform.OS === 'ios') this.submission();
  }
  this.state.appState = nextAppState;
};
