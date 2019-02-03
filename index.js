/** @format */
import { Navigation } from 'react-native-navigation';
import React from 'react';
import { Platform } from 'react-native';
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

const homeTopBar = () => (
  <LinearGradient
    style={{
      flex: 1
    }} 
    colors={['#FF6A15', '#ff5b29']}>
    <FastImage
      style={{
        marginTop: Platform.OS === 'android' ? 5 : 0,
        width: 150,
        height: 43,
        alignSelf: 'center',
      }}
      resizeMode={FastImage.resizeMode.contain}
      source={require('./media/white-top-bar.png')}
    />
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

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing Screen'
      }
    }
  });
});
