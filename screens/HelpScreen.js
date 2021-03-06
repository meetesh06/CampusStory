/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  BackHandler
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import SessionStore from '../SessionStore';

class HelpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount(){
    new SessionStore().pushTrack({type : 'OPEN_HELP'});
  }

  state = {
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
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
            {'Help  '}
          </Text>
          <IconMaterial name = 'help-circle' size = {25} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
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
        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Events '} <IconMaterial name = 'ticket' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'Events going around you, you can either select an event as interested or register for the the event by providing details. Some events require you to register through URLs for which you will be redirected to the URL.\n\nAlso you can click bell icon to get notified for any update regarding the event through app notifications.'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Channels '} <IconIon name = 'ios-albums' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'Various groups, societies, communities, clubs, private groups around you. You can explore what they do & join them instantly by subscribing them.\n\n Click bell icon for easy updates from channels.'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'Stories '} <IconIon name = 'md-albums' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'Your subscribed channels update them through stories they can be informational cards, images, short videos. You can watch them directly from your home screen.\n\nExplore public stories on discover page from more channels category wise.'
            }
            </Text>
          </View>
        </View>

        <View style={{backgroundColor : '#555', margin : 10, borderRadius :10, padding : 10}}>
          <View>
            <Text style={{fontSize : 20, color : '#fff', marginBottom : 10}}>{'HashTags '} <IconFeather name = 'hash' size = {18} /></Text>
            <Text style={{fontSize : 14, color : '#eee', marginBottom : 10, fontFamily : 'Roboto-Light'}}>
            {
              'People can tag various stories & events under different hashtags, you can visit tags to see all posts from them.\n\nExplore tags to get quick view about different trends around you.'
            }
            </Text>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default HelpScreen;
