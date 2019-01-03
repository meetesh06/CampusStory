import React from 'react';
import { View, Text, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedImageButton from '../components/Button';
// import { Navigation } from 'react-native-navigation'
import { goToInterestsSelector } from './helpers/Navigation';

import Constants from '../constants';
const SET_UP_STATUS = Constants.SET_UP_STATUS;

class App extends React.Component {
    async componentDidMount() {
        try {
          const status = await AsyncStorage.getItem(SET_UP_STATUS);
          if (status) {
            // console.log('set_up_status: ', status);
          } else {
            this.setState({ loading: false });
          }
        } catch (err) {
          console.log('error: ', err)
          this.setState({ loading: false });
        }
    }
    constructor(props) {
        super(props);
        this.continueNext = this.continueNext.bind(this);
        this.state = {
            login: false,
            loading: true
        }
    }
    continueNext = () => {
        goToInterestsSelector();
    };
    render() {
        return(
            <View style={{ flex: 1 }}>
                <LinearGradient style={{ flex: 1 }} colors={['#FF4A3F', '#FF6A15']}>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Image source={require('../media/LogoWhite.png')} style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }} />
                        {/* <Image source={{ uri: "" }} style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }} /> */}
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 35, fontFamily: 'Roboto-Regular' }}> Campus Story </Text>
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 20, fontFamily: 'Roboto-Light' }}> Think. Learn. Inspire.</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {
                            this.state.loading &&
                            <ActivityIndicator size="small" color="#fff" />
                        }
                        {
                            !this.state.loading &&
                            <AnimatedImageButton 
                                onchange={this.continueNext}
                                state1={ () => 
                                    <View style={{ backgroundColor: '#fff', alignItems: 'center', marginLeft: 20, marginRight: 20, padding: 15, borderRadius: 10 }}> 
                                        <Text style={{ fontFamily: 'Roboto-Regular' }}>Let's get started</Text>
                                    </View>
                                }
                                state2={ () => 
                                    <View style={{ backgroundColor: '#fff', alignItems: 'center', marginLeft: 20, marginRight: 20, padding: 15, borderRadius: 10 }}> 
                                        <Text style={{ fontFamily: 'Roboto-Regular' }}>Welcome to Dock</Text>
                                    </View>
                                }
                            />
                        }

                    </View>
                </LinearGradient>
            </View>
        );
    }

    
}

export default App;