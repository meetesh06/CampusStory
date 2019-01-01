import React from 'react';
import { View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-ionicons'
import AnimatedImageButton from './components/Button';
// import Icon from 'react-native-vector-icons/FontAwesome';

class App extends React.Component {
    constructor(props) {
        super(props);
        // let logout = props.navigation.getParam('logout', false);
    }
    render() {
        return(
            <View style={{ flex: 1 }}>
                <LinearGradient style={{ flex: 1 }} colors={['#FF4A3F', '#FF6A15']}>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Image source={require('./media/LogoWhite.png')} style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }} />
                        {/* <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 35, fontFamily: 'Roboto-Regular' }}> Campus Story </Text> */}
                        {/* <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 20, fontFamily: 'Roboto-Light' }}> Think. Learn. Inspire.</Text> */}
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 35 }}> Campus Story </Text>
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'white', fontSize: 20 }}> Think. Learn. Inspire.</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* <Icon style={{ alignSelf: 'center', marginBottom: 10, color: '#fff' }} name="google" size={30} color="#fff" /> */}
                        <AnimatedImageButton 
                            onchange={this.signIn}
                            state1={ () => 
                                <View style={{ backgroundColor: '#fff', alignItems: 'center', marginLeft: 20, marginRight: 20, padding: 15, borderRadius: 10 }}> 
                                    {/* <Text style={{ fontFamily: 'Roboto-Regular' }}>Continue With Google</Text> */}
                                    <Text>Continue With Google</Text>
                                </View>
                            }
                            state2={ () => 
                                <View style={{ backgroundColor: '#fff', alignItems: 'center', marginLeft: 20, marginRight: 20, padding: 15, borderRadius: 10 }}> 
                                    {/* <Text style={{ fontFamily: 'Roboto-Regular' }}>Continue With Google</Text> */}
                                    <Text>Continue With Google</Text>
                                </View>
                            }
                        />

                    </View>
                </LinearGradient>
            </View>
        );
    }

    signIn = () => {
        
    };
      
    
}

export default App;