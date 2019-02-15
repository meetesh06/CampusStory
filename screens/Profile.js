/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  View,
  AsyncStorage,
  TouchableOpacity,
  Text,
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
    this.handleCamera = this.handleCamera.bind(this);
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

  handleCamera = () => {
    // Navigation.showModal({
    //   component: {
    //     name: 'Camera Screen',
    //     options: {
    //       topBar: {
    //         animate: true,
    //         visible: true,
    //         drawBehind: false
    //       },
    //       bottomTabs: {
    //         visible: false,
    //         drawBehind: true,
    //         animate: true
    //       }
    //     }
    //   }
    // });
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
          flex: 1,
          backgroundColor: '#333'
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
          <TouchableOpacity
            onPress={this.handleCamera}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 15,
              backgroundColor: '#c0c0c0',
              borderRadius: 75,
              width: 120,
              height: 120
            }}
          >
            <IconFontAwesome5
              style={{
                alignSelf: 'center'
              }}
              name="user-tie"
              size={75}
            />
          </TouchableOpacity>
          {
            interested.length > 0 && (
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'center',
                  fontFamily: 'Roboto',
                  fontSize: 18,
                  color: '#f0f0f0',
                  marginLeft: 10,
                }}
              >
                {'Interested Events '}
                <Icon name="heart" size={15} />
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
                  marginTop: 10,
                  marginBottom: 10,
                  textAlign: 'center',
                  fontFamily: 'Roboto',
                  fontSize: 18,
                  marginLeft: 10,
                  color: '#f0f0f0',
                }}
              >
                {'Registered Events '}
                <Icon name="checkcircle" size={15} />
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
            <InformationCard
              touchable
              title="Secured Data"
              content="All of your data shared on this platform will be safe and never shared with anyone without your permission."
              icon={(
                <Icon
                  style={{
                    margin: 10,
                    color: '#f0f0f0',
                    alignSelf: 'center'
                  }}
                  name="lock1"
                  size={30}
                />
              )}
              onPress={this.handleLogout}
              style_card={{ backgroundColor: '#555' }}
              style_title={{ color: '#d0d0d0' }}
              style_content={{ color: '#c0c0c0', }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Profile;
