/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  Dimensions,
  View,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import EventCard from '../components/EventCard';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import { processRealmObj } from './helpers/functions';

const WIDTH = Dimensions.get('window').width;

class InterestedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleEventPress = this.handleEventPress.bind(this);
  }

  state = {
    interested: [],
    going: [],
    count: 0,
    refreshing: false,
    loading : true,
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  updateContent = () => {
    Realm.getRealm((realm) => {
      const interested = realm.objects('Events').filtered('interested = "true"').filtered('going = "false"').sorted('date');
      const going = realm.objects('Events').filtered('going = "true"').sorted('date');
      processRealmObj(interested, (result) => {
        this.setState({ interested: result });
      });
      processRealmObj(going, (result) => {
        this.setState({ going: result, loading : false});
      });
    });
  }

  handleEventPress = (item) => {
    const { _id } = item;
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        Navigation.showOverlay({
          component: {
            name: 'Event Detail Screen',
            passProps: {
              item: result[0],
              id: result[0].title
            },
            options: {
              topBar: {
                animate: true,
                visible: true,
                drawBehind: false,
                title: {
                  text: result[0].title,
                },
              },
              bottomTabs: {
                visible: false,
                drawBehind: true,
                animate: true
              }
            }
          }
        });
      });
    });
  }

  handleLogout = async () => {
    const {
      count
    } = this.state;
    this.setState({ count: count + 1 });
    if (count > 16) {
      Realm.getRealm((realm) => {
        realm.write(async () => {
          realm.deleteAll();
          await AsyncStorage.clear();
          goInitializing();
        });
      });
    }
  }

  async componentDidAppear() {
    this.updateContent();
  }

  render() {
    const {
      interested,
      going,
      refreshing
    } = this.state;
    const {
      updateContent
    } = this;
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
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {' My Events  '}
          </Text>
          <IconMaterial name = 'heart' size = {25} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
            }}
            onPress={() => {
              Navigation.dismissModal(this.props.componentId)
            }}
          >
            <Icon size={22} style={{ position: 'absolute', right: 5, color: '#FF6A15', }} name="closecircle" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor : '#333'
          }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={updateContent}
            />
          )}
        >
          { 
                this.state.loading
                && <ActivityIndicator size="small" color="#fff" style={{margin : 10}} />
          }

          {
            going.length > 0 &&
            <Text style={{color : '#ddd', textAlign : 'center', margin : 10, fontSize : 14}}> You have {going.length} registered events.</Text>
          }

          <FlatList
            numColumns = {2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={going}
            renderItem={({ item }) => (
              <EventCard onPress={this.handleEventPress} width={WIDTH / 2 - 20} height={140} item={item} />
            )}
          />
          
          {
            interested.length > 0 &&
              <Text style={{color : '#ddd', textAlign : 'center', margin : 10 , fontSize : 14}}> You are interested in {interested.length} events.</Text>
          }
          <FlatList
            numColumns = {2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={interested}
            renderItem={({ item }) => (
              <EventCard onPress={this.handleEventPress} width={WIDTH / 2 - 20} height={140} item={item} />
            )}
          />
          {
            going.length === 0 && interested.length === 0 && !this.state.loading &&
            <View style={{alignSelf : 'center', alignItems : 'center'}}>
              <IconMaterial name = "delete-empty" size={180} style={{color : "#444",}} />
              <Text style={{color : '#fff', textAlign : 'center', marginLeft : 10, marginRight : 10, fontSize : 15, fontFamily : 'Roboto-Light'}}> Huh! You have no events in your list.</Text>
            </View>
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default InterestedScreen;
