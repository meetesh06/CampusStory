import React from 'react';
import { Alert, View, Text, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedImageButton from '../components/Button';
// import { Navigation } from 'react-native-navigation'
import { goToInterestsSelector, goHome } from './helpers/Navigation';

import Constants from '../constants';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

const SET_UP_STATUS = Constants.SET_UP_STATUS;

class App extends React.Component {
    async componentDidMount() {
        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            console.log(JSON.parse(notification._data.content));
        }
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            
            console.log(action, notification, notificationOpen);
        });
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            console.log(notification);
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log(notification);
        });
        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            console.log(message);
        });

        try {
          const status = await AsyncStorage.getItem(SET_UP_STATUS);
          if (status === "true") {
            goHome();
          } else {
            this.setState({ loading: false });
          }
        // this.setState({ loading: false });
        } catch (err) {
          console.log('error: ', err)
          this.setState({ loading: false });
        }
    }

    // componentWillUnmount() {
    //     this.notificationDisplayedListener();
    //     this.notificationListener();
    // }
    
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