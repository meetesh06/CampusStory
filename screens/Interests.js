/* eslint-disable max-len */
import React from 'react';
import {
  Alert,
  View,
  Text,
  RefreshControl,
  FlatList,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import firebase from 'react-native-firebase';
import Constants from '../constants';
import { goHome } from './helpers/Navigation';
import AdvertCard from '../components/AdvertCard';
import CustomModal from '../components/CustomModal';
import Realm from '../realm';
import InformationCard from '../components/InformationCard';
import { categoriesNoHottest } from './helpers/values';
import SessionStore from '../SessionStore';

const one = []; const two = []; let i;
for (i = 0; i < categoriesNoHottest.length; i += 1) {
  if (i < categoriesNoHottest.length / 2) {
    one.push(categoriesNoHottest[i]);
  } else {
    two.push(categoriesNoHottest[i]);
  }
}

const {
  SET_UP_STATUS,
  COLLEGE,
  INTERESTS,
  TOKEN,
  MUTED,
  CONFIG
} = Constants;

class Interests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      showModal: false,
      collegeSelection: {
        _id: '', media: 'general/college.webp', name: '', location: ''
      },
      interests: {},
      colleges: [{ name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }]
    };
    this.handleInterestSelection = this.handleInterestSelection.bind(this);
    this.handleNextScreen = this.handleNextScreen.bind(this);
  }

  componentDidMount() {
    const { _onRefresh } = this;
    _onRefresh();
  }

  updateLocalState = async (college, interestsProcessed, token) => {
    const store = new SessionStore();
    store.putValue(COLLEGE, college);
    store.putValue(INTERESTS, interestsProcessed);
    store.putValue(TOKEN, token);
    store.putValue(SET_UP_STATUS, true);
    store.putValue(MUTED, true);
    store.putValue(CONFIG, {});
    await store.setValueBulk();
    goHome(true);
  }

  handleNextScreen = async () => {
    const {
      refreshing,
      loading,
      interests,
      collegeSelection
    } = this.state;
    if (refreshing || loading) return;
    // eslint-disable-next-line no-underscore-dangle
    const college = collegeSelection._id;
    const {
      updateLocalState
    } = this;

    let interestsProcessed = Object.keys(interests).map(key => key);
    const temp = [...interestsProcessed];

    if (interestsProcessed.length < 2) {
      Alert.alert(
        'Please select atleast 2 interests!',
      );
      return;
    }
    if (college === '') {
      Alert.alert(
        'Please select a college',
      );
      return;
    }
    this.setState({ loading: true });
    interestsProcessed = interestsProcessed.join();
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append(COLLEGE, college);
    formData.append(INTERESTS, interestsProcessed);
    formData.append('others', JSON.stringify({}));

    axios.post('https://www.mycampusdock.com/auth/get-general-token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((result) => {
        const resultObj = result.data;
        if (!resultObj.error) {
          try {
            this.subsribeFB(temp, college, () => {
              updateLocalState(college, interestsProcessed, resultObj.data);
            });
          } catch (error) {
            console.log(error);
            Alert.alert(
              'An unknown error occured'
            );
          }
        } else {
          console.log('SERVER REPLY ERROR');
          Alert.alert(
            "'An unknown error occured',"
          );
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        console.log('DOPE ', err);
        Alert.alert(
          err.toString()
        );
        this.setState({ loading: false });
      });
  }

  subsribeFB = (array, clg, callback) => {
    const { notify } = this.state;
    Realm.getRealm((realm) => {
      realm.write(() => {
        if (!notify) {
          try {
            realm.create('Firebase', { _id: 'ogil7190', notify: 'true', channel: 'false' }, true);
            firebase.messaging().subscribeToTopic('ogil7190');
            for (i = 0; i < array.length; i += 1) {
              realm.create('Firebase', { _id: array[i], notify: 'true', channel: 'false' }, true);
              firebase.messaging().subscribeToTopic(array[i]);
            }
            realm.create('Firebase', { _id: clg, notify: 'true', channel: 'false' }, true);
            firebase.messaging().subscribeToTopic(clg);
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
    callback();
  }

  handleInterestSelection = (value) => {
    const {
      interests
    } = this.state;
    const current = { ...interests };
    // if (current.hasOwnProperty(value)) {
    if (Object.prototype.hasOwnProperty.call(current, value)) {
      delete current[value];
    } else {
      current[value] = 1;
    }
    this.setState({ interests: current });
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      collegeSelection: {
        _id: '', media: 'general/college.webp', name: '', location: ''
      }
    });
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('dummy', ''); /* DO NOT DELETE */
    axios.post('https://www.mycampusdock.com/users/get-college-list', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        //   'x-access-token': this.props.auth.user_token
      }
    })
      .then((result) => {
        const resultObj = result.data;
        if (!resultObj.error) {
          this.setState({ collegeSelection: resultObj.data[0], colleges: resultObj.data });
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        // if(this.mounted)
        this.setState({ refreshing: false });
      });
  }

  render() {
    const {
      refreshing,
      showModal,
      colleges,
      collegeSelection
    } = this.state;
    const {
      name,
      location,
      media
    } = collegeSelection;
    const {
      _onRefresh,
      handleInterestSelection
    } = this;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10 }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
            />
          )}
        >
          <Text style={{
            textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 22, marginLeft: 10, marginTop : 10
          }}
          >
            Select your college
          </Text>
          <View style={{
            backgroundColor: '#c5c5c5', borderRadius: 10, height: 2, width: 100, marginTop: 4, marginBottom: 10, alignSelf: 'center'
          }}
          />
          <View
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: 10,
              overflow: 'hidden',
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 5,
              paddingRight: 5,
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              marginBottom: 5,
              flexDirection: 'row'
            }}
          >
            <FastImage
              style={{ width: 90, height: 75, borderRadius: 15 }}
              source={{ uri: `https://www.mycampusdock.com/${media}` }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
              <Text
                style={{ fontFamily: 'Roboto', fontSize : 13 }}
              >
                {name}
              </Text>
              <Text
                style={{ fontFamily: 'Roboto-Light', marginTop: 5, fontSize: 12 }}
              >
                {location}
              </Text>

            </View>
            <TouchableOpacity
              onPress={
                    () => this.setState({ showModal: !showModal })
                  }
              style={{ alignSelf: 'center', marginRight: 5 }}
            >
              <Icon style={{ color: '#505050' }} size={30} name="circle-edit-outline" />

            </TouchableOpacity>
          </View>
          <Text style={{
            textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 22, marginLeft: 10, marginTop: 20,
          }}
          >
            Select your interests
          </Text>
          <View style={{
            backgroundColor: '#c5c5c5', borderRadius: 10, height: 2, width: 120, marginTop: 4, marginBottom: 10, alignSelf: 'center'
          }}
          />
          <FlatList
            style={{
              backgroundColor: '#fff',
              paddingTop: 15,
              paddingBottom: 15,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={one}
            renderItem={({ item }) => (
              <AdvertCard
                width={100}
                height={100}
                onChecked={() => handleInterestSelection(item.value)}
                image={item.image}
                text={item.title}
              />
            )}
          />
          <FlatList
            style={{
              backgroundColor: '#fff',
              paddingTop: 15,
              paddingBottom: 15,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            data={two}
            renderItem={({ item }) => (
              <AdvertCard
                width={100}
                height={100}
                onChecked={() => handleInterestSelection(item.value)}
                image={item.image}
                text={item.title}
              />
            )}
          />
          <InformationCard
            title="Thank You"
            content="Thank you for installing Campus Story! This app collects app usage data to improve your user experience. We hope to be your companion and bring you useful information."
            icon={<IconSimple name="emotsmile" size={40} color="#888" style={{ margin: 10, alignSelf: 'center',}} />}
          />
          <View style={{
          alignSelf: 'center', elevation: 10, backgroundColor: '#dfefef', padding: 5, borderRadius: 30
        }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#FF6A15', borderRadius: 40, justifyContent: 'center', alignItems: 'center', padding: 5
            }}
            onPress={this.handleNextScreen}
          >
            <IconMaterial name="navigate-next" size={45} color="#fff" />
          </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              height: 90
            }}
          />
        </ScrollView>


        <CustomModal
          newSelection={(data) => {
            this.setState({ showModal: false, collegeSelection: data });
          }}
          data={colleges}
          visible={showModal}
        />
      </View>
    );
  }
}
export default Interests;
