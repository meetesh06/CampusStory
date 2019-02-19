/* eslint-disable global-require */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import axios from 'axios';
import Realm from '../realm';
import urls from '../URLS';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import firebase from 'react-native-firebase';

class BackupScreen extends React.Component {
  constructor(props){
    super(props);
  }

  state ={
    enabled : true,
    done : 0,
    log : '',
    total : 0
  }

  fetchBackup = async () =>{
    const data = this.props.data;
    const token = this.props.data.token;
    this.setState({help : 'Loading Events Data', enabled : false});
    await this.fetchBackupEvents(data.registered_events, token);
    await this.setState({help : 'Loading Channels Data', log : '', done : 0, total : 0})
    await this.fetchBackupChannels(data.followed_channels, token);
    this.props.proceed();
  }

  fetchBackupChannels = async (data, token) =>{
    const channel_list = data === undefined || data === null ? [] : data;
    this.setState({log : 'Fetched ' + this.state.done + ' out of ' + channel_list.length + ' channels.', total : channel_list.length});
    for(let i=0; i<channel_list.length; i++){
      await this.fetch_channel(channel_list[i], token);
    }
  }

  fetchBackupEvents = async (data, token) =>{
    const event_list = data === undefined || data === null ? [] : data;
    this.setState({log : 'Fetched ' + this.state.done + ' out of ' + event_list.length + ' events.', total : event_list.length});
    for(let i=0; i<event_list.length; i++){
      await this.fetch_event(event_list[i], token);
    }
  }

  fetch_channel =(_id, token) => {
    console.log('Fetching Channel', _id);
    let is_private = false;
    axios.post(urls.FETCH_CHANNEL_DATA, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then((response) => {
      if (!response.data.error) {
        response.data.data.forEach((el) => {
          el.priority = JSON.stringify(el.priority);
          el.media = JSON.stringify(el.media);
          el.followers = JSON.stringify(el.followers);
          el.channel_already = 'false';
          el.category_found = 'false';
          el.recommended = 'true';
          el.subscribed = 'true';
          el.updates = 'true';
          is_private = el.private === undefined ? false : el.private;
        });
        const { data } = response.data;
        if (data.length === 0) return;
        Realm.getRealm((realm) => {
          realm.write(() => {
            let i;
            for (i = 0; i < data.length; i += 1) {
              try {
                realm.create('Channels', data[i], true);
                console.log('Creating Channel', _id);
              } catch (e) {
                console.log(e);
              }
            }
          });
        });
      }
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      this.subscribe(_id, is_private);
      const done = this.state.total > this.state.done ? this.state.done+ 1 : this.state.total;
      this.setState({
        done,
        log : 'Fetched ' + done + ' out of ' + this.state.total + ' channels.'
      });
    });
  }

  fetch_event = (_id, token) =>{
    axios.post(urls.FETCH_EVENT_DATA, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then((response) => {
      const responseObj = response.data;
      if (!responseObj.error) {
        Realm.getRealm((realm) => {
          const el = responseObj.data[0];
          realm.write(() => {
            const current = realm.objects('Events').filtered(`_id="${_id}"`);
            realm.delete(current);
            el.reach = JSON.stringify(el.reach);
            el.views = JSON.stringify(el.views);
            el.enrollees = JSON.stringify(el.enrollees);
            el.name = JSON.stringify(el.name);
            el.audience = JSON.stringify(el.audience);
            el.media = JSON.stringify(el.media);
            el.timestamp = new Date(el.timestamp);
            el.time = new Date(el.time);
            const ts = Date.parse(`${el.date}`);
            el.date = new Date(el.date);
            el.ms = ts;
            el.reg_end = new Date(el.reg_end);
            el.reg_start = new Date(el.reg_start);
            el.interested = 'true';
            el.going = 'true';
            el.remind = 'true';
            try {
              realm.create('Events', el, true);
            } catch (e) {
              console.log(e);
            }
          });
        });
      }
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      const done = this.state.total > this.state.done ? this.state.done+ 1 : this.state.total;
      this.setState({
        done,
        log : 'Fetched ' + done + ' out of ' + this.state.total + ' events.'
      });
    });
  }

  subscribe = (_id, is_private) => {
    Realm.getRealm((realm) => {
      realm.write(() => {
        realm.create('Firebase', { _id, notify: 'true', type: 'channel', private : is_private});
        firebase.messaging().subscribeToTopic(_id);
      });
    });
  }

  reset = () =>{
    this.setState({log : 'Resetting your data, please wait', help : 'Resetting you identity, profile & other data'});
    this.props.reset();
  }
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      > 
        <View
          style={{
            alignItems : 'center',
            height: 50,
            marginTop: 10,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              alignSelf : 'center',
              color: '#fff',
              fontSize: 18,
              textAlign : 'center',
            }}
          >
            {'Backup Details'}
          </Text>

          <View style={{
            backgroundColor: '#c5c5c5', 
            borderRadius: 10, 
            height: 2, 
            width: 150, 
            marginTop: 5, 
            alignSelf: 'center',
          }}
          />
      </View>
      
        <View style={{ alignItems: 'center', marginBottom : 50 }}>
          <IconMaterial name='cloud-download' size={220} style={{color : "#444",}}/>
        </View>
      <View style={{justifyContent : 'center', alignItems : 'center'}}>
        <View style={{justifyContent : 'center', alignItems : 'center', backgroundColor : '#555', padding : 15, borderRadius : 10}}>
          <Text style={{fontSize : 16, color : '#fff', margin : 3}}>Active backup found for this device.</Text>
          <Text style={{fontSize : 12, color : '#fff', margin : 3}}>Would you like to restore your backup?</Text>
          <View style={{flexDirection : 'row', margin : 5}}>
          <TouchableOpacity style={{borderRadius : 10, backgroundColor : '#777', margin : 5, padding : 5}} onPress={()=> this.state.enabled ? this.reset() : console.log('NO WAY')}>
            <View style={{flexDirection : 'row', padding: 5}}>
              <IconMaterial name='delete-forever' size={18} style={{color : "#fff", margin : 3}}/>
              <Text style={{color : '#fff', fontSize : 15, textAlign : 'center', marginLeft : 6, margin : 3}}>Remove</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{borderRadius : 10, backgroundColor : '#FF6A15', margin : 5, padding : 5,}} onPress={()=> this.state.enabled ? this.fetchBackup() : console.log('NO WAY')}>
            <View style={{flexDirection : 'row', padding : 5, alignItems : 'center', justifyContent : 'center'}}>
              <IconMaterial name='backup' size={18} style={{color : "#fff",}}/>
              <Text style={{color : '#fff', fontSize : 15, textAlign : 'center', marginLeft : 6, margin : 3}}>Restore</Text>
            </View>
          </TouchableOpacity>
          </View>
          {
            this.state.log !== '' &&
          <View style={{
            margin : 10,
          }}>
            <Text style={{color : '#ddd', fontSize : 14, marginBottom : 5, textAlign : 'center'}}>{this.state.log}</Text>
            <Text style={{color : '#999', fontSize : 12, marginBottom : 5, textAlign : 'center'}}>{this.state.help}</Text>
          </View>
          }
        </View>
      </View>
      
      <View style={{position : 'absolute', bottom : 30, alignSelf : 'center'}}>
          <Text style={{margin : 5, color : '#777', fontSize : 14}}>
            {<IconAnt name='infocirlceo' size = {14} style={{color : '#777'}}/>}
            {'  Removing permanently deletes the backup!'}
          </Text>
      </View>
      </SafeAreaView>
    );
  }
}

export default BackupScreen;
