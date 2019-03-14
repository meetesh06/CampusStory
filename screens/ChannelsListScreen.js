/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Text,
  FlatList,
  Platform
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import Realm from '../realm';
import { processRealmObj } from './helpers/functions';
import ChannelCard from '../components/ChannelCard';

const WIDTH = Dimensions.get('window').width;
class HelpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () =>{
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  state = {
    channels : []
  }

  componentDidMount(){
    this.mounted = true;
    Realm.getRealm((realm) => {
      const Subs = realm.objects('Firebase').filtered('type="channel"');
      processRealmObj(Subs, (result) => {
        const final = [];
        const Channels = realm.objects('Channels');
        result.forEach((value) => {
          const { _id } = value;
          const current = Channels.filtered(`_id="${_id}"`);
          final.push(current[0])
        });
        processRealmObj(final, (channels) => {
          if(this.mounted) this.setState({ channels });
        });
      });
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
              fontSize: 22,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'My Channels  '}
          </Text>
          <IconIon name = 'ios-albums' size = {24} color = '#ddd' />
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
        {
            this.state.channels.length  > 0 &&
                  <Text style={{color : '#ddd', textAlign : 'center', margin : 10, marginBottom : 0, fontSize : 14}}> You have {this.state.channels.length} subsribed channels.</Text>
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
              <ChannelCard 
                width={WIDTH / 2 - 20}
                height = {140}
                onPress = {this.hanleOpen}
                item = {item}
              />
            )}
          />

          {
            this.state.channels.length === 0 &&
            <View style={{alignSelf : 'center', alignItems : 'center'}}>
              <IconIon name = "ios-albums" size={180} style={{color : "#444",}} />
              <Text style={{color : '#fff', textAlign : 'center', marginLeft : 10, marginRight : 10, fontSize : 15, fontFamily : 'Roboto-Light'}}> Oho! You have no subscribed channels.</Text>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default HelpScreen;
