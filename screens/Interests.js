import React from 'react';
import { AsyncStorage, Image, Alert, View, Text, RefreshControl, StyleSheet, FlatList, ScrollView, TouchableOpacity, Platform} from 'react-native';
import AdvertCard from '../components/AdvertCard';
import AdvertCardText from '../components/AdvertCardText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { goHome } from './helpers/Navigation';
import Constants from '../constants';

const SET_UP_STATUS = Constants.SET_UP_STATUS;
const COLLEGE = Constants.COLLEGE;
const INTERESTS = Constants.INTERESTS;

class Interests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            college: '',
            interests: {},
            categories: [ { image: '', value: '', text: '' }, { image: '', value: '', text: '' }, { image: '', value: '', text: '' } ],
            colleges: [ { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' }, { name: '', media: '', _id: '' } ]
        }
        this.handleInterestSelection = this.handleInterestSelection.bind(this);
        this.handleNextScreen = this.handleNextScreen.bind(this);
    }

    handleNextScreen = async () => {
        const { college, interests } = this.state;
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
        console.log(interestsProcessed);
        try {
            await AsyncStorage.setItem(COLLEGE, college);
            await AsyncStorage.setItem(INTERESTS, interestsProcessed);
            await AsyncStorage.setItem(SET_UP_STATUS, "true");
            goHome();
        } catch (error) {
            Alert.alert(
                "'An unknown error occured',"
            )
        }
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
                this.setState({ colleges: result.data });
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

                    <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10, marginTop: 50 }}> 
                        Select your college
                    </Text>
                    <FlatList 
                        horizontal={false}
                        // legacyImplementation={true}
                        extraData={this.state.college}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.colleges} 
                        renderItem={({item}) => <AdvertCardText id={item._id} clicked={ (value) => { this.setState({ college: value }); } } sub={item.location} title={item.name} width={200} height={150} image={"https://www.mycampusdock.com/"+item.media} pressed={ this.state.college } /> } 
                    />
                    
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