/* eslint-disable max-len */
import React from 'react';
import {
  Alert,
  View,
  Text,
  RefreshControl,
  FlatList,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import firebase from 'react-native-firebase';
import Constants from '../constants';
import Urls from '../URLS';
import { goHome } from './helpers/Navigation';
import AdvertCard from '../components/AdvertCard';
import CustomModal from '../components/CustomModal';
import Realm from '../realm';
import InformationCard from '../components/InformationCard';
import { categoriesNoHottest } from './helpers/values';
import SessionStore from '../SessionStore';
import DeviceInfo from 'react-native-device-info';
import { Navigation } from 'react-native-navigation';

const uniqueId = DeviceInfo.getUniqueID();
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
      colleges: [{ name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }],
      error : null
    };
    this.handleInterestSelection = this.handleInterestSelection.bind(this);
    this.handleNextScreen = this.handleNextScreen.bind(this);
    this.firebaseConfig = this.firebaseConfig.bind(this);
  }

  componentDidMount() {
    this.firebaseConfig();
    const { _onRefresh } = this;
    _onRefresh();
  }

  firebaseConfig = async () => {
    const store = new SessionStore();
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      try {
        await firebase.messaging().requestPermission();
        let config = store.getValue(CONFIG);
        config = config === null ? [] : config;
        config.firebase_enabled = true;
        const fcmToken = await firebase.messaging().getToken();
        config.firebase_token = fcmToken;
        config.platform = Platform.OS === 'android' ? 'android' : 'ios';
        store.putValue(CONFIG, config);
      } catch (error) {
        console.log('PERMISSION DENIED');
        new SessionStore().pushLogs({type : 'error_firebase', line : new Error().stack, file : 'Interest.js', err : error});
        const config = store.getValue(CONFIG);
        config.firebase_enabled = false;
        config.platform = Platform.OS === 'android' ? 'android' : 'ios';
        store.putValue(CONFIG, config);
      }
    } else {
      let config = store.getValue(CONFIG);
      config = config === null ? [] : config;
      config.firebase_enabled = true;
      const fcmToken = await firebase.messaging().getToken();
      config.firebase_token = fcmToken;
      config.platform = Platform.OS === 'android' ? 'android' : 'ios';
      store.putValue(CONFIG, config);
    }
  }

  updateLocalState = async (college, interestsProcessed, token, data) => {
    const store = new SessionStore();
    store.putValue(COLLEGE, college);
    store.putValue(INTERESTS, interestsProcessed);
    store.putValue(TOKEN, token);
    store.putValue(SET_UP_STATUS, true);
    store.putValue(MUTED, true);
    store.putValue(CONFIG, data);
    await store.setSessionId();
    await store.setValueBulk();
    Navigation.dismissModal('backup_screen');
    goHome(true);
  }

  showBackupPrompt = (data) =>{
    Navigation.showModal({
      component: {
        name: 'Backup Screen',
        id: 'backup_screen',
        passProps: {
          reset : this.reset,
          proceed : this.proceed,
          data
        },
        options: {
          modalPresentationStyle: 'overCurrentContext',
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true
          },
        }
      }
    });
  }

  reset = () =>{
    const config = this.state.config;
    axios.post(Urls.RESET_USER_URL, config.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token' : config.token
      }
    })
      .then((result) => {
        const resultObj = result.data;
        if (!resultObj.error) {
          console.log('RESPONSE RESET', resultObj);
          try {
            this.subsribeFB(config.temp, config.college, () => {
              this.updateLocalState(config.college, config.interestsProcessed, resultObj.data, {_id : config.id, token : resultObj.data});
            });
          } catch (error) {
            console.log(error);
            this.setState({ loading: false, error : 'Ohh Ohh! Try again!'});
          }
        }
        else {
          this.setState({ loading: false, error : 'Something went wrong on server :('});
        }
      }).catch((err) => {
        console.log(err);
        new SessionStore().pushLogs({type : 'error', line : new Error().stack, file : 'Interest.js', err});
        this.setState({ loading: false, error : 'Something went wrong! Try Again:(' });
      });
  }

  proceed = () => {
    try {
      this.subsribeFB(this.state.config.temp, this.state.config.college, () => {
        this.updateLocalState(this.state.config.college, this.state.config.interestsProcessed, this.state.config.data.token, this.state.config.data);
      });
    } catch (error) {
      this.setState({ loading: false, error : 'Ohh Ohh! Try again!'});
    }
  }

  UUID = (length) =>{
    var text = "";
    var possible = "0123456789ABCD7EFGHIJ6KLMNO8PQRSTUVW8XYZabcd8efghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

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
    this.setState({ loading: true, error : null});
    interestsProcessed = interestsProcessed.join();
    // eslint-disable-next-line no-undef
    const id = uniqueId === undefined || uniqueId === null || uniqueId === '' || uniqueId.length < 2 ? this.UUID(24) : uniqueId;
    const formData = new FormData();
    const other_details = {
      brand : DeviceInfo.getBrand(),
      manufacturer : DeviceInfo.getManufacturer(),
      os : DeviceInfo.getSystemName(),
      os_version : DeviceInfo.getSystemVersion(),
      notch : DeviceInfo.hasNotch(),
      carrier : DeviceInfo.getCarrier()
    }
    formData.append('id', id);
    formData.append(COLLEGE, college);
    formData.append(INTERESTS, interestsProcessed);
    formData.append('others', JSON.stringify(other_details));

    axios.post(Urls.GENERAL_TOKEN_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((result) => {
        const resultObj = result.data;
        if (!resultObj.error) {
          if(resultObj.exists){
            this.setState({ config : {formData, token : resultObj.data.token, temp, college, interestsProcessed, data : resultObj.data, id}}, ()=>{
              this.showBackupPrompt(result.data.data);
            });
          }
          else {
            try {
              this.subsribeFB(temp, college, () => {
                updateLocalState(college, interestsProcessed, resultObj.data, {_id : id, [COLLEGE] : college, [INTERESTS] : interestsProcessed});
              });
            } catch (error) {
              this.setState({ loading: false, error : 'Ohh Ohh! Try again!'});
            }
          }
        }
        else {
          this.setState({ loading: false, error : 'Something went wrong on server :('});
        }
      }).catch((err) => {
        new SessionStore().pushLogs({type : 'error', line : new Error().stack, file : 'Interest.js', err});
        this.setState({ loading: false, error : 'Something went wrong! Try Again:(' });
      });
  }

  subsribeFB = (array, clg, callback) => {
    const { notify } = this.state;
    Realm.getRealm((realm) => {
      realm.write(() => {
        if (!notify) {
          try {
            realm.create('Firebase', { _id: 'ogil7190', notify: 'true', type: 'universe' }, true);
            firebase.messaging().subscribeToTopic('ogil7190');
            
            realm.create('Firebase', { _id: 'admin$' + clg, notify: 'true', type: 'admin' }, true);
            firebase.messaging().subscribeToTopic('admin$' + clg);
            
            for (i = 0; i < array.length; i += 1) {
              realm.create('Firebase', { _id: array[i], notify: 'true', type: 'category' }, true);
              firebase.messaging().subscribeToTopic(array[i]);
            }
            
            realm.create('Firebase', { _id: clg, notify: 'true', type: 'college' }, true);
            firebase.messaging().subscribeToTopic(clg);
          } catch (e) {
            console.log(e);
            new SessionStore().pushLogs({type : 'error', line : new Error().stack, file : 'Interest.js', err : e});
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
    axios.post(Urls.COLLEGE_LIST_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((result) => {
        const resultObj = result.data;
        if (!resultObj.error) {
          this.setState({ collegeSelection: resultObj.data[0], colleges: resultObj.data });
        }
      })
      .catch(err => {
        console.log(err)
        new SessionStore().pushLogs({type : 'error', line : new Error().stack, file : 'Interest.js', err});
      })
      .finally(() => {
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
      <View style={{ flex: 1, backgroundColor: '#222' }}>
        {
          Platform.OS === 'ios'
          && (<StatusBar barStyle="light-content" translucent />)
        }
        <ScrollView
          style={{ flex: 1, backgroundColor: '#333' }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
            />
          )}
        >
          <Text
            style={{
              color: '#f0f0f0',
              textAlign: 'center',
              fontFamily: 'Roboto-Light',
              fontSize: 22,
              marginTop: 10
            }}
          >
            Select your college
          </Text>
          <View style={{
            backgroundColor: '#c5c5c5', borderRadius: 10, height: 2, width: 120, marginTop: 4, marginBottom: 10, alignSelf: 'center'
          }}
          />
          <View
            style={{
              backgroundColor: '#444',
              borderRadius: 10,
              overflow: 'hidden',
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 5,
              paddingRight: 5,
              marginLeft: 10,
              marginRight: 10,
              flexDirection: 'row'
            }}
          >
            <FastImage
              style={{ width: 90, height: 75, borderRadius: 10 }}
              source={{ uri: `https://www.mycampusdock.com/${media}` }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
              <Text
                style={{ fontFamily: 'Roboto', fontSize: 13, color: '#fff' }}
              >
                {name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  color: '#c5c5c5',
                  marginTop: 5,
                  fontSize: 12
                }}
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
              <Icon style={{ color: '#f0f0f0' }} size={30} name="circle-edit-outline" />

            </TouchableOpacity>
          </View>
          <Text style={{
            color: '#f0f0f0',
            textAlign: 'center',
            fontFamily: 'Roboto-Light',
            fontSize: 22,
            marginTop: 20,
          }}
          >
            Select your interests
          </Text>
          <View style={{
            backgroundColor: '#c5c5c5', 
            borderRadius: 10, 
            height: 2, 
            width: 120, 
            marginTop: 4, 
            alignSelf: 'center',
          }}
          />
          <FlatList
            style={{
              alignSelf : 'center',
              paddingTop: 10,
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
            style = {{alignSelf : 'center',}}
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
          <Text style={{
            color: '#f0f0f0',
            textAlign: 'center',
            fontFamily: 'Roboto-Light',
            fontSize: 22,
            marginTop: 20,
          }}
          >
            {'Terms & Conditions'}
          </Text>
          <View style={{
            backgroundColor: '#c5c5c5', 
            borderRadius: 10, 
            height: 2, 
            width: 120, 
            marginTop: 4, 
            alignSelf: 'center',
          }}
          />
          <InformationCard
            touchable = {false}
            title="Thank You"
            content="Thank you for installing Campus Story. This app collects app usage data to improve user experience. All of your data shared on this platform will be safe and never shared with anyone."
            icon={<IconSimple name="emotsmile" size={40} color="#f0f0f0" style={{ margin: 10, alignSelf: 'center' }} />}
            style_card={{ backgroundColor: '#555', marginTop : 15 }}
            style_title={{ color: '#d0d0d0' }}
            style_content={{ color: '#c0c0c0', }}
          />

          {this.state.error && <Text style={{ fontSize: 14, color: '#FF6A15', textAlign: 'center', textAlignVertical : 'center', margin : 5}}><IconAnt name = 'infocirlceo' size = {15} /> {this.state.error}</Text> }
          {
                this.state.loading
                && <ActivityIndicator size="small" color="#fff" style={{margin : 5}} />
          }
          <View
            style={{
              alignSelf: 'center',
              elevation: 10,
              backgroundColor: '#444',
              padding: 5,
              marginTop : 10,
              borderRadius: 30,
              marginBottom: 30
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6A15',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                flexDirection : 'row'
              }}
              onPress={this.handleNextScreen}
            >
              <Text style={{color : '#fff', marginLeft : 10, marginRight : 0, margin : 5, fontSize : 22, textAlignVertical : 'center', textAlign : 'center'}}>{' Next'}</Text>
              <IconMaterial name="navigate-next" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
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
