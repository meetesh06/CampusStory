/** @format */
import { Navigation } from 'react-native-navigation';
import React from 'react';
import { Platform, Text } from 'react-native';
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

const whiteTopBarImage = require('./media/LogoWhite.png');

const homeTopBar = () => (
  <LinearGradient
    style={{
      flex: 1,
      flexDirection : 'row',
      justifyContent : 'center',
      alignItems : 'center'
    }} 
    colors={['#FF6A15', '#ff5b29']}>
    <FastImage
      style={{
        marginTop: Platform.OS === 'android' ? 5 : 0,
        width: 36,
        margin : 5,
        height: 36,
      }}
      resizeMode={FastImage.resizeMode.contain}
      source={whiteTopBarImage}
    />
    <Text style={{fontSize : 18, color : '#fff'}}>Campus Story</Text>
  </LinearGradient>
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
Navigation.registerComponent('Preview Overlay Screen', () => PreviewOverlayScreen);
Navigation.registerComponent('Discover Preview', () => DiscoverPreview);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing Screen'
      }
    }
  });
});
