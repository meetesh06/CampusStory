import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  AsyncStorage,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
// import EventCardBig from '../components/EventCardBig';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import EventCard from '../components/EventCard';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import { processRealmObj } from './helpers/functions';
import InformationCard from '../components/InformationCard';

const logoWhite = require('../media/LogoWhite.png');
// const WIDTH = Dimensions.get('window').width;

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
    this.updateContent();
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
    // const { componentId } = this.props;
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
    Realm.getRealm((realm) => {
      realm.write(async () => {
        realm.deleteAll();
        await AsyncStorage.clear();
        goInitializing();
      });
    });
  }

  render() {
    const {
      count,
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

        <LinearGradient
          style={{
            overflow: 'hidden', justifyContent: 'center', alignItems: 'center', padding: 2
          }}
          colors={['#FF4A3F', '#FF6A15']}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ count: count + 1 }, () => {
                if (count > 15) {
                  this.handleLogout();
                }
              });
            }}
          >
            <FastImage
              style={{
                width: 84,
                height: 84,
                alignSelf: 'center',
                marginTop: 50,
                marginBottom: 20
              }}
              resizeMode={FastImage.resizeMode.contain}
              source={logoWhite}
            />
          </TouchableOpacity>
        </LinearGradient>
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
            interested.length > 0 && (
              <Text
                style={{
                  marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 20, marginLeft: 10
                }}
              >
                Interested Events
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
                  marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 20, marginLeft: 10
                }}
              >
                Registered Events
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
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'Roboto-Light',
                textAlign: 'center'
              }}
            >
              This page shows all your registered events
            </Text>
            <InformationCard icon={<Icon name="lock1" size={45} color="#111" style={{ margin: 10, alignSelf: 'center', }} />} title="Secured Data" content="All of your data shared on this platform will be safe and never shared with anyone without your permission." style_card={{}} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Profile;
