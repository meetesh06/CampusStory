import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  Platform,
  View,
  AsyncStorage,
  Text,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import EventCard from '../components/EventCard';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import { processRealmObj } from './helpers/functions';
import InformationCard from '../components/InformationCard';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleEventPress = this.handleEventPress.bind(this);
  }

  state = {
    interested: [],
    going: [],
    count: 0,
    refreshing: false
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
        this.setState({ going: result });
      });
    });
  }

  handleEventPress = (item) => {
    const { _id } = item;
    Realm.getRealm((realm) => {
      const current = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(current, (result) => {
        Navigation.showModal({
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
    this.setState({count : this.state.count + 1});
    if(this.state.count > 16){
      Realm.getRealm((realm) => {
        realm.write(async () => {
          realm.deleteAll();
          await AsyncStorage.clear();
          goInitializing();
        });
      });
    }
  }

  componentDidAppear() {
    this.updateContent();
  }

  render() {
    const {
      // count,
      interested,
      going,
      refreshing
    } = this.state;
    const {
      updateContent
    } = this;
    return (
      <View
        style={{
          flex: 1
        }}
      >

        <ScrollView
          style={{
            flex: 1
          }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={updateContent}
            />
          )}
        >
          {
            Platform.OS === 'android' && (
              <View
                style={{
                  flex: 1,
                  height: 50
                }}
              />
            )}
          {
            interested.length > 0 && (
              <Text
                style={{
                  marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 18, marginLeft: 10
                }}
              >
                {'Interested Events '}
                <Icon name = 'heart' size = {18} />
              </Text>
            )
          }
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={interested}
            renderItem={({ item }) => (
              <EventCard onPress={this.handleEventPress} width={180} height={140} item={item} />
            )}
          />
          {
            going.length > 0 && (
              <Text
                style={{
                  marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 18, marginLeft: 10
                }}
              >
                {'Registered Events '}
                <Icon name = 'checkcircle' size = {18} />
              </Text>
            )}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={going}
            renderItem={({ item }) => (
              <EventCard onPress={this.handleEventPress} width={180} height={(140)} item={item} />
            )}
          />
          <View>
            {/* <InformationCard icon={<IconIonicons name="md-settings" size={45} color="#c5c5c5" style={{ margin: 10, alignSelf: 'center', }} />} title="Settings" content="Modify Settings for better app experience." style_card={{}} onPress = {this.handleLogout} touchable = {true}/> */}
            <InformationCard icon={<Icon name="lock1" size={45} color="#888" style={{ margin: 10, alignSelf: 'center', }} />} title="Secured Data" content="All of your data shared on this platform will be safe and never shared with anyone without your permission." style_card={{}} onPress = {this.handleLogout}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Profile;
