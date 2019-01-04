import React from 'react';
import { AsyncStorage, Image, Alert, View, Text, RefreshControl, StyleSheet, FlatList, ScrollView, TouchableOpacity, Platform} from 'react-native';
import AdvertCard from '../components/AdvertCard';
import AdvertCardText from '../components/AdvertCardText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { goHome } from './helpers/Navigation';
import Constants from '../constants';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChannelCard from '../components/ChannelCard';

const SET_UP_STATUS = Constants.SET_UP_STATUS;
const COLLEGE = Constants.COLLEGE;
const INTERESTS = Constants.INTERESTS;
const TOKEN = Constants.TOKEN;

class Interests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: true,
			college: '',
			channelList: [
				{ creator: 'Mr Sangwan', title: 'Wild Cats', image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/WILD-CATS-new.jpg", read: false },
				{ creator: 'Mr Ranjpoot', title: 'Air Falcons', image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/air-falcons-new.jpg", read: true },
				{ creator: 'Mr Mehta', title: 'Water Sharks', image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/WATER-SHARKS-new.jpg", read: false },
				{ creator: 'Mr Bhalla', title: 'Forest Rhinos', image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/FOREST-RHINOS-new.jpg", read: false },
		],
			collegeSelection: { media: "general/college.webp", name: '', location: '' },
			interests: {},
			categories: [ { image: '', value: '', text: '' }, { image: '', value: '', text: '' }, { image: '', value: '', text: '' } ],
			colleges: [ { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' } ]
		}
		this.handleInterestSelection = this.handleInterestSelection.bind(this);
		this.handleNextScreen = this.handleNextScreen.bind(this);
	}

	updateLocalState = async (college, interestsProcessed, token) => {
		await AsyncStorage.setItem(COLLEGE, college);
		await AsyncStorage.setItem(INTERESTS, interestsProcessed);
		await AsyncStorage.setItem(TOKEN, token);
		await AsyncStorage.setItem(SET_UP_STATUS, "true");
		goHome();
	}

	handleNextScreen = async () => {
		const { college, interests } = this.state;
		const updateLocalState = this.updateLocalState;
		let interestsProcessed = Object.keys(interests).map(function(key) {
			return key;
		});
		console.log(interestsProcessed, college === "");
		
		if( interestsProcessed.length < 2 ) {
			Alert.alert(
				'Please select atleast 2 interests',
			  )
			return;
		}
		if( college === "" ) {
			Alert.alert(
				'Please select a college',
			)
			return;
		}
		interestsProcessed = interestsProcessed.join();
		let formData = new FormData();

		

		formData.append(COLLEGE, college);
		formData.append(INTERESTS, interestsProcessed);
		formData.append("others", {});

		axios.post("http://127.0.0.1:65534/auth/get-general-token", formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			//   'x-access-token': this.props.auth.user_token
			}
		  })
		  .then( (result) => {
				result = result.data;
			  if(!result.error) {
					try {
						console.log(result);
						updateLocalState(college, interestsProcessed, result.data);
					} catch (error) {
						Alert.alert(
							"An unknown error occured"
						)
					}
			  } else {
					Alert.alert(
						"'An unknown error occured',"
					);
			  }
			
		  })
		  .catch( (err) => Alert.alert(
			"'An unknown error occured',"
			));

		
	}

	handleInterestSelection = (value) => {
		let current = {...this.state.interests};
		if(current.hasOwnProperty(value)) {
			delete current[value];
		} else {
			current[value] = 1;
		}
		this.setState({ interests: current })
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
			// drawBehind: true,
			visible: true,
		  }
		};
	}
	
	_onRefresh = () => {
		this.setState({refreshing: true});
		formData = new FormData();
		formData.append("dummy", "");
		// axios.post("https://www.mycampusdock.com/users/get-category-list", formData, {
		axios.post("https://www.mycampusdock.com/users/get-category-list", formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			//   'x-access-token': this.props.auth.user_token
			}
		  })
		  .then( (result) => {
			result = result.data;
			console.log(result);
			if(!result.error) {
				this.setState({ categories: result.data });
			}
		  })
		  .catch( (err) => console.log(err) )
		  .finally( () => {
			// if(this.mounted)
				this.setState({ refreshing: false });
		  } )

		// axios.post("https://www.mycampusdock.com/users/get-college-list", formData, {
		axios.post("https://www.mycampusdock.com/users/get-college-list", formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			//   'x-access-token': this.props.auth.user_token
			}
		  })
		  .then( (result) => {
			result = result.data;
			console.log(result);
			if(!result.error) {
				console.log("college", result.data[0]);
				this.setState({ collegeSelection: result.data[0], colleges: result.data });
			}
		  })
		  .catch( (err) => console.log(err) )
		  .finally( () => {
			// if(this.mounted)
				this.setState({ refreshing: false });
		  } )
	}

	render() {
		
		return(
			<View style={{ flex: 1 }}>
				{/* <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 25, marginTop: Platform.OS === 'ios' ? 70 : 10, marginBottom: 10 }}> Select your Interests </Text> */}
				<ScrollView 
					style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, marginBottom: 5 }}
					refreshControl={
						<RefreshControl
						  refreshing={this.state.refreshing}
						  onRefresh={this._onRefresh}
						/>
					}
				>

					<Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						Select your interests 
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={this.state.categories} 
						renderItem={({item}) => <AdvertCard width={200} height={150} onChecked={() => this.handleInterestSelection(item.value)} image={"https://www.mycampusdock.com/"+item.media} /> } 
					/>

					<Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10, marginTop: 20 }}> 
						Select your college
					</Text>
					<View
						style={{
							backgroundColor: '#e0e0e0', 
							borderRadius: 10, 
							overflow: 'hidden', 
							paddingTop: 5,
							paddingBottom: 5,
							paddingLeft: 5,
							paddingRight: 5,
							margin: 5,
							flexDirection: 'row'
						}}
					>
						<FastImage
							style={{  width: 100, height: 80, borderRadius: 15 }}
							source={{ uri: "https://www.mycampusdock.com/" + this.state.collegeSelection.media }}
							resizeMode={ FastImage.resizeMode.contain }
						/>
						<View style={{ flex: 1, marginLeft: 10, marginTop: 5}}>
							<Text
								style={{ fontFamily: 'Roboto' }}
							>
								{this.state.collegeSelection.name}
							</Text>
							<Text
								style={{ fontFamily: 'Roboto-Light', marginTop: 5, fontSize: 15 }}
							>
								{this.state.collegeSelection.location}
							</Text>

						</View>
						<TouchableOpacity style={{ alignSelf: 'center', marginRight: 5 }}>
							<Icon style={{ color: '#505050'}} size={30} name="circle-edit-outline" />

						</TouchableOpacity>
					</View>
					<Text
						style={{  marginLeft: 15, fontFamily: 'Roboto-Light', marginTop: 15, fontSize: 15 }}
					>
						Official Channels
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={this.state.channelList} 
						renderItem={({item}) => 
								<ChannelCard pressed={this.handleEventClick} width={250} height={150} item={item} />
						} 
					/>
					{/* <FastImage source={{ uri: this.state.collegeSelection.media }} /> */}

					{/* <FlatList 
						horizontal={false}
						// legacyImplementation={true}
						extraData={this.state.college}
						showsHorizontalScrollIndicator={false}
						data={this.state.colleges} 
						renderItem={({item}) => <AdvertCardText id={item._id} clicked={ (value) => { this.setState({ college: value }); } } sub={item.location} title={item.name} width={200} height={150} image={"https://www.mycampusdock.com/"+item.media} pressed={ this.state.college } /> } 
					/> */}
					
					<LinearGradient style={{ flex: 1, height: 330, margin: 5, borderRadius: 10}} colors={['#FF4A3F', '#FF6A15']}>
						<Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 15, padding: 15, color: 'white' }}>
							Thank you for installing Campus Story
						</Text>
						<Image source={require('../media/LogoWhite.png')} style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }} />
						<Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 20, padding: 15, color: 'white' }}>
							We hope to be your companion and bring you useful information.
						</Text>
						<TouchableOpacity onPress={this.handleNextScreen} style={{  alignSelf: 'center', backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
							<Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Roboto' }}> continue </Text>
						</TouchableOpacity>
					</LinearGradient>
					
				</ScrollView>

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