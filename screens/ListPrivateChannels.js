/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Platform
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import PrivateChannel from '../components/PrivateChannel';
import urls from '../URLS';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import Realm from '../realm';
import { processRealmObj } from './helpers/functions';

const WIDTH = Dimensions.get('window').width;

class ListPrivateChannels extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    channels : [],
    already : [],
    refreshing : false
  }

  componentDidMount(){
    this.setState({refreshing : true});
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('type="channel"').filtered('private=true');
      processRealmObj(Subs, (result) => {
        this.setState({already : result});
        this.fetch_data();
      });
    });
    new SessionStore().pushTrack({type : 'OPEN_PRIVATE_CHANNELS'});
  }

  fetch_data = () =>{
    const private_channels = true;
    axios.post(urls.GET_CATEGORY_CHANNEL_URL, {category : 'xxx', private : private_channels}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(Constants.TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        const list = response.data.data;
        const already = this.state.already;
        const already_list = [];
        const final_list = [];
        for(let i=0; i<already.length; i++){
          already_list.push(already[i]._id);
        }
        for(let i=0; i<list.length; i++){
          if(already_list.includes(list[i]._id))continue;
          final_list.push(list[i]);
        }
        this.setState({channels : final_list, error : false, refreshing : false});
      } else {
        this.setState({error : true, mssg : 'No Internet Connection', refreshing : false});
      }
    }).catch((e)=>{
      console.log(e);
      this.setState({refreshing : false});
      new SessionStore().pushLogs({type : 'error', line : 75, file : 'ListPrivateChannels.js', err : e});
    });
  }

  hanleOpen = (_id, channel_name) =>{
    Navigation.showOverlay({
      component: {
        name: 'Channel Detail Screen',
        passProps: {
          id : _id,
          modal: true
        },
        options: {
          bottomTabs: {
            animate: true,
            drawBehind: true,
            visible: false
          },
          topBar: {
            title: {
              text: channel_name
            },
            visible: true
          }
        }
      }
    });
    Navigation.dismissModal(this.props.componentId);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop : Platform.OS === 'ios' ? 45 : 8,
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
              fontSize: 20,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'Private Channels  '}
          </Text>
          <IconMaterial name = 'pageview' size = {25} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
            }}
            onPress={() => {
              Navigation.dismissModal(this.props.componentId)
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
          {
            this.state.channels.length  > 0 && !this.state.refreshing &&
                  <Text style={{color : '#ddd', textAlign : 'center', margin : 10, marginBottom : 0, fontSize : 14}}> There are {this.state.channels.length} private channels.</Text>
          }
          {
            this.state.refreshing &&
            <ActivityIndicator size = 'small' style={{margin : 10}} color = '#ddd' />
          }
          <FlatList
            style={{
              paddingTop: 10,
              margin : 10,
            }}
            numColumns = {2}
            keyExtractor={(item, index) => `${index}`}
            data={this.state.channels}
            renderItem={({ item }) => (
              <PrivateChannel 
                width={WIDTH / 2 - 30}
                height = {140}
                componentId = {this.props.componentId}
                media = {item.media[0]}
                item = {item}
              />
            )}
          />
          {
            this.state.channels.length === 0 &&
            <View style={{alignSelf : 'center', alignItems : 'center'}}>
              <IconIon name = "ios-albums" size={180} style={{color : "#444",}} />
              <Text style={{color : '#fff', textAlign : 'center', marginLeft : 10, marginRight : 10, fontSize : 15, fontFamily : 'Roboto-Light'}}> Oho! There are no private channels.</Text>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default ListPrivateChannels;
