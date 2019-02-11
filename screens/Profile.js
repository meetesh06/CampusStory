/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  Platform,
  Alert,
  View,
  AsyncStorage,
  Text,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import EventCard from '../components/EventCard';
import Realm from '../realm';
import { goInitializing } from './helpers/Navigation';
import { processRealmObj } from './helpers/functions';
import InformationCard from '../components/InformationCard';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';

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
    const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
    if(!isCameraAuthorized || isCameraAuthorized === -1) {
      const isUserAuthorizedCamera = await CameraKitCamera.requestDeviceCameraAuthorization();
      if(!isUserAuthorizedCamera) Alert.alert('Cannot use the camera');
    }
  }

  onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages);
    Alert.alert(
      `${event.type} button pressed`,
      `${captureImages}`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    )
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
        <CameraKitCameraScreen
          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
          flashImages={{
            on: require('../media/flashOn.png'),
            off: require('../media/flashOff.png'),
            auto: require('../media/flashAuto.png')
          }}
          cameraFlipImage={require('../media/cameraFlipIcon.png')}
          captureButtonImage={require('../media/cameraButton.png')}
        />
        {/* <ScrollView
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
          } */}
          {/* <FlatList
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
                    // opacity: 0.6,
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
        </ScrollView> */}
      </View>
    );
  }
}

export default Profile;
