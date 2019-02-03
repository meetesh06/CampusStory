import React from 'react';
import {
  AsyncStorage, Image, Alert, View, Text, RefreshControl, StyleSheet, FlatList, ScrollView, TouchableOpacity, Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import firebase from 'react-native-firebase';
import Constants from '../constants';
import { goHome } from './helpers/Navigation';
import AdvertCardText from '../components/AdvertCardText';
import AdvertCard from '../components/AdvertCard';
import CustomModal from '../components/CustomModal';
import Realm from '../realm';
import InformationCard from '../components/InformationCard';
import { categories } from './helpers/values';

const SET_UP_STATUS = Constants.SET_UP_STATUS;
const COLLEGE = Constants.COLLEGE;
const INTERESTS = Constants.INTERESTS;
const TOKEN = Constants.TOKEN;

class Interests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      // college: '',
      showModal: false,
      // channelList: [
      //   {
      //     creator: 'Mr Sangwan', title: 'Wild Cats', media: 'https://manavrachna.edu.in/wp-content/uploads/2017/07/WILD-CATS-new.jpg', read: false
      //   },
      //   {
      //     creator: 'Mr Ranjpoot', title: 'Air Falcons', media: 'https://manavrachna.edu.in/wp-content/uploads/2017/07/air-falcons-new.jpg', read: true
      //   },
      //   {
      //     creator: 'Mr Mehta', title: 'Water Sharks', media: 'https://manavrachna.edu.in/wp-content/uploads/2017/07/WATER-SHARKS-new.jpg', read: false
      //   },
      //   {
      //     creator: 'Mr Bhalla', title: 'Forest Rhinos', media: 'https://manavrachna.edu.in/wp-content/uploads/2017/07/FOREST-RHINOS-new.jpg', read: false
      //   },
      // ],
      collegeSelection: {
        _id: '', media: 'general/college.webp', name: '', location: ''
      },
      interests: {},
      categories: [],
      colleges: [{ name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }]
    };
    this.handleInterestSelection = this.handleInterestSelection.bind(this);
    this.handleNextScreen = this.handleNextScreen.bind(this);
  }

	updateLocalState = async (college, interestsProcessed, token) => {
	  await AsyncStorage.setItem(COLLEGE, college);
	  await AsyncStorage.setItem(INTERESTS, interestsProcessed);
	  await AsyncStorage.setItem(TOKEN, token);
	  await AsyncStorage.setItem(SET_UP_STATUS, 'true');
	  goHome();
	}

	handleNextScreen = async () => {
	  if (this.state.refreshing || this.state.loading) return;
	  this.setState({ loading: true });
	  const { interests } = this.state;
	  const college = this.state.collegeSelection._id;
	  const updateLocalState = this.updateLocalState;
	  let interestsProcessed = Object.keys(interests).map(key => key);
	  const temp = [...interestsProcessed];

	  if (interestsProcessed.length < 2) {
	    Alert.alert(
	      'Please select atleast 2 interests',
			  );
	    return;
	  }
	  if (college === '') {
	    Alert.alert(
	      'Please select a college',
	    );
	    return;
	  }
	  interestsProcessed = interestsProcessed.join();
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
	      result = result.data;
	      if (!result.error) {
	        try {
	          this.subsribeFB(temp, college, () => {
	            updateLocalState(college, interestsProcessed, result.data);
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
	  Realm.getRealm((realm) => {
	    realm.write(() => {
	      if (!this.state.notify) {
	        try {
	          realm.create('Firebase', { _id: 'global', notify: 'true', channel: 'false' }, true);
	          firebase.messaging().subscribeToTopic('global');
	          for (let i = 0; i < array.length; i++) {
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
	  if (this.state.refreshing) return;
	  const current = { ...this.state.interests };
	  if (current.hasOwnProperty(value)) {
	    delete current[value];
	  } else {
	    current[value] = 1;
	  }
	  this.setState({ interests: current });
	}

	componentDidMount() {
	  this._onRefresh();
	}

	static options(passProps) {
	  return {
		  topBar: {
	      title: {
			  text: 'Select your Interests'
	      },
	      drawBehind: true,
	      visible: false,
		  }
	  };
	}

	_onRefresh = () => {
	  this.setState({
	    refreshing: true,
	    collegeSelection: {
	      _id: '', media: 'general/college.webp', name: '', location: ''
	    }
	  });
	  const formData = new FormData();
	  formData.append('dummy', ''); /* DO NOT DELETE */
	  axios.post('https://www.mycampusdock.com/users/get-college-list', formData, {
	    headers: {
			  'Content-Type': 'multipart/form-data',
	      //   'x-access-token': this.props.auth.user_token
	    }
		  })
		  .then((result) => {
	      result = result.data;
	      if (!result.error) {
	        this.setState({ collegeSelection: result.data[0], colleges: result.data });
	      }
		  })
		  .catch(err => console.log(err))
		  .finally(() => {
	      // if(this.mounted)
	      this.setState({ refreshing: false });
		  });
	}

	render() {
	  // console.log(this.state.showModal);
	  return (
  <View style={{ flex: 1 }}>

    {/* <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 25, marginTop: Platform.OS === 'ios' ? 70 : 10, marginBottom: 10 }}> Select your Interests </Text> */}
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10 }}
      refreshControl={(
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
)}
    >

      <Text style={{
        textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 22, marginLeft: 10, marginTop: 30,
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
          source={{ uri: `https://www.mycampusdock.com/${this.state.collegeSelection.media}` }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
          <Text
          style={{ fontFamily: 'Roboto' }}
        >
          {this.state.collegeSelection.name}
        </Text>
          <Text
          style={{ fontFamily: 'Roboto-Light', marginTop: 5, fontSize: 14 }}
        >
          {this.state.collegeSelection.location}
        </Text>

        </View>
        <TouchableOpacity
          onPress={
								() => this.setState({ showModal: !this.state.showModal })
							}
          style={{ alignSelf: 'center', marginRight: 5 }}
        >
          <Icon style={{ color: '#505050' }} size={30} name="circle-edit-outline" />

        </TouchableOpacity>
      </View>
      {/* <Text
						style={{  marginLeft: 15, fontFamily: 'Roboto-Light', marginTop: 20, fontSize: 20, textAlign : 'center', marginBottom : 10}}>
						Official Content Creators
					</Text>
					<FlatList
						horizontal={true}
						style={{ marginBottom: 10 }}
						showsHorizontalScrollIndicator={false}
						keyExtractor={ (value, index) => index + "" }
						data={this.state.channelList}
						renderItem={({item}) => {
							console.log(item);
							return <FastImage
								style={{ width: 120, height: 100, margin: 10, borderRadius: 10}}
								resizeMode={FastImage.resizeMode.cover}
								source={{ uri: item.media }}
							/>;
						}
						}
					/> */}
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
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        extraData={categories}
        data={categories}
        renderItem={({ item }) => <AdvertCard width={100} height={75} onChecked={() => this.handleInterestSelection(item.value)} image={item.image} text={item.title} />}
      />
      <InformationCard title="Thank You" content="Thank you for installing Campus Story! This app collects app usage data to improve your user experience. We hope to be your companion and bring you useful information." icon={<IconSimple name="emotsmile" size={40} color="#111" style={{ margin: 10, alignSelf: 'center' }} />} />
    </ScrollView>

    <View style={{
      position: 'absolute', bottom: 30, alignSelf: 'center', elevation: 10, backgroundColor: '#dfdfef', padding: 5, borderRadius: 30
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

    <CustomModal
      newSelection={(data) => {
				  this.setState({ showModal: false, collegeSelection: data });
      }}
      data={this.state.colleges}
      visible={this.state.showModal}
    />
  </View>
	  );
	}
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginTop: 10,
    fontSize: 16,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f5ed',
    color: '#666666',
  },
});

export default Interests;
