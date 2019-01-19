import React from 'react';
import { RefreshControl, TouchableOpacity, ScrollView, Image, Platform, FlatList, AsyncStorage, View, Text } from 'react-native';
import { goInitializing } from './helpers/Navigation';
import Constants from '../constants';
import EventCard from '../components/EventCard';
import StoryIcon from '../components/StoryIcon';
import ImageGradient from 'react-native-image-gradient';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Realm from '../realm';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

const TOKEN = Constants.TOKEN;

import FastImage from 'react-native-fast-image'
class Home extends React.Component {
    constructor(props) {
        super(props);
        // this.handleLogout = this.handleLogout.bind(this);
        this.handleEventPress = this.handleEventPress.bind(this);
        this.handleStoryPress = this.handleStoryPress.bind(this);
        this._updateContent = this._updateContent.bind(this);
        this.process_realm_obj = this.process_realm_obj.bind(this);
        this._updateEventList = this._updateEventList.bind(this);
    }

    componentDidMount() {
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            console.log(notification);
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log(notification);
        });

        const process_realm_obj = this.process_realm_obj;
        Realm.getRealm((realm) => {
            let Events = realm.objects('Events').sorted('timestamp');
            let Subs = realm.objects('Firebase').filtered('channel="true"');

            process_realm_obj(Subs, (result) => {
                console.log(result);
                let final = [];
                result.forEach( (value) => {
                    let current = realm.objects('Channels').filtered(`_id="${value._id}"`);
                    final.push(current[0]);
                })
                process_realm_obj(final, (channels) => {
                    this.setState({ channels })
                });
                // this.setState({ event_list: result.reverse() });
            });
            
            process_realm_obj(Events, (result) => {
                console.log(result);
                this.setState({ event_list: result.reverse() });
            });
        });
        this._updateContent();
    }
    
    _updateEventList = async (last_updated) => {
        const process_realm_obj = this.process_realm_obj;
        // axios.post('http://127.0.0.1:65534/events/user/get-event-list', { last_updated }, {
        axios.post('https://www.mycampusdock.com/events/user/get-event-list', { last_updated }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            console.log(response);
            if(!response.data.error) {
                response.data.data.forEach((el)=>{
                    el.reach = JSON.stringify(el.reach);
                    el.views = JSON.stringify(el.views);
                    el.enrollees = JSON.stringify(el.enrollees);
                    el.name = JSON.stringify(el.name);
                    el.audience = JSON.stringify(el.audience);
                    el.media = JSON.stringify(el.media);
                    el.timestamp = new Date(el.timestamp);
                    el.date = new Date(el.date);
                    el.reg_end = new Date(el.reg_end);
                    el.reg_start = new Date(el.reg_start);
                });
                let data = response.data.data;
                if(data.length === 0) return this.setState({ refreshing: false });
                
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        let i;
                        for(i=0;i<data.length;i++) {
                            try {
                                realm.create('Events', data[i], true);
                            } catch(e) {
                                console.log(e);
                            }
                        }
                    });
                    let Events = realm.objects('Events').sorted('timestamp');
                    process_realm_obj(Events, (result) => {
                        console.log(result);
                        this.setState({ event_list: result.reverse() });
                    });
                });
            }
        }).catch( err => console.log(err) 
        ).finally(() => {
            this.setState({ refreshing: false })
        })
        // axios.post('http://127.0.0.1:65534/events/channels/get-activity-list', { last_updated }, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-access-token': await AsyncStorage.getItem(TOKEN)
        //     }
        // }).then( response => {
        //     console.log(response);
        //     if(!response.data.error) {
        //         response.data.data.forEach((el)=>{
        //             el.reach = JSON.stringify(el.reach);
        //             el.views = JSON.stringify(el.views);
        //             el.enrollees = JSON.stringify(el.enrollees);
        //             el.name = JSON.stringify(el.name);
        //             el.audience = JSON.stringify(el.audience);
        //             el.media = JSON.stringify(el.media);
        //             el.timestamp = new Date(el.timestamp);
        //             el.date = new Date(el.date);
        //             el.reg_end = new Date(el.reg_end);
        //             el.reg_start = new Date(el.reg_start);
        //         });
        //         let data = response.data.data;
        //         if(data.length === 0) return this.setState({ refreshing: false });
                
        //         Realm.getRealm((realm) => {
        //             realm.write(() => {
        //                 let i;
        //                 for(i=0;i<data.length;i++) {
        //                     try {
        //                         realm.create('Events', data[i], true);
        //                     } catch(e) {
        //                         console.log(e);
        //                     }
        //                 }
        //             });
        //             let Events = realm.objects('Events').sorted('timestamp');
        //             process_realm_obj(Events, (result) => {
        //                 console.log(result);
        //                 this.setState({ event_list: result.reverse() });
        //             });
        //         });
        //     }
        // }).catch( err => console.log(err) 
        // ).finally(() => {
        //     this.setState({ refreshing: false })
        // })
    }

    _updateContent = async () => {
        const process_realm_obj = this.process_realm_obj;
        const _updateEventList = this._updateEventList;
        this.setState({ refreshing: true });
        let last_updated;
        Realm.getRealm((realm) => {
            let EventsOld = realm.objects('Events').sorted('timestamp');
            try {
                last_updated = EventsOld[EventsOld.length - 1].timestamp;
            } catch(e) {
                last_updated = 'NONE';
            }
            _updateEventList(last_updated);

            let Subs = realm.objects('Firebase').filtered('channel="true"');

            process_realm_obj(Subs, (result) => {
                console.log(result);
                let final = [];
                result.forEach( (value) => {
                    let current = realm.objects('Channels').filtered(`_id="${value._id}"`);
                    final.push(current[0]);
                })
                process_realm_obj(final, (channels) => {
                    console.log(channels);
                    this.setState({ channels })
                });
                // this.setState({ event_list: result.reverse() });
            });
        });

        
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }

    state = {
        event_list: [],
        refreshing: true,
        channels: [

        ],
        eventsToday: [
            { creator: 'Wild Cats', location: 'Manav Rachna', title: 'Music Festival 2018', image: "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25" },
            { creator: 'Water Sharks', location: 'Manav Rachna', title: 'Aritificial Intelligence', image: "https://www.burniegroup.com/wp-content/uploads/2018/03/960x0-1-300x200.jpg" },
            { creator: 'Slim Shady', location: 'Manav Rachna', title: 'TED Talk - Sanjay Bhandalkar', image: "http://www.personalbrandingblog.com/wp-content/uploads/2016/05/3256398629_019f3444aa-300x200.jpg" },
            { creator: 'Tupac Shakur', location: 'Manav Rachna', title: 'CSGO Lan Party', image: "https://hdwallpaperim.com/wp-content/uploads/2017/09/16/54422-Counter-Strike-Counter-Strike_Global_Offensive-300x200.jpg" },
        ],
        eventsChannels: [],
    }

    handleEventPress = (item) => {
        Navigation.push(this.props.componentId, {
            component: {
              name: 'Event Detail Screen',
              passProps: {
                id: item.title
              },
              options: {
                topBar: {
                    visible: true,
                    drawBehind: false
                },
                bottomTabs: {
                    visible: false,
                    drawBehind: true,
                    animate: true
                }
              }
            }
          });
        
    }
    
    handleStoryPress = (item) => {
        Navigation.showOverlay({
            component: {
              name: 'Story Screen',
              passProps: {
                  _id: item._id
              },
              options: {
                overlay: {
                  interceptTouchOutside: true
                }
              }
            }
        });
    }
    render() {
        return(
            <View style={{ flex: 1 }}>
                <View elevation={5} 
                    style = {{ 
                        backgroundColor : '#fff', 
                        minHeight : Platform.OS === 'android' ? 70 : 90, 
                        paddingTop : Platform.OS === 'android'? 8 : 30, 
                        shadowColor: "#000000",
                        shadowOpacity: 0.1,
                        shadowRadius: 0.5,
                        shadowOffset: {
                            height: 2,
                            width: 2
                        }
                }}>
                    <Image style={{ margin: 5, alignSelf: 'center', width: 50, height: 50 }} source={require('../media/app-bar/logo.png')}></Image>
                </View>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._updateContent}
                        />
                    }
                    // style={{ paddingTop: 10 }}
                >
					{
                        this.state.channels.length !== 0 &&
                        <FlatList 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index+""}
                            data={this.state.channels} 
                            extraData={this.state.channels}
                            renderItem={({item}) => 
                                <StoryIcon onPress={this.handleStoryPress} width={100} height={80} item={item} />
                            } 
                        />
                    }

                    {
                        this.state.channels.length === 0 &&

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#e0e0e0',
                                padding: 10,
                                margin: 5,
                                borderRadius: 10,
                                flexDirection: 'row'
                                // marginBottom: 10,
                                // textAlign: 'left'
                            }}
                        >
                            <FastImage 
                                style={{
                                    width: 150,
                                    // backgroundColor: 'red',
                                    // borderRadius: 10,
                                    // alignItems: 'stretch',
                                    height: 80,
                                }}
                                
                                source={require('../media/app-bar/logo.png')}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    padding: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: 'Roboto-Thin'
                                    }}
                                >
                                    Stories from your subscribed channels will appear here.
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: 'Roboto-Light',
                                        marginTop: 10,
                                        fontSize: 12,
                                        color: '#55f'
                                    }}
                                >
                                    Discover new channels
                                </Text>
                            </View>
                            
                        </TouchableOpacity>
                    }
                    {/* <LinearGradient style={{ flex: 1 }} colors={['#FF4A3F', '#FF6A15']}>
                        <EventCard pressed={this.handleEventClick} width={250} height={200} item={this.state.eventsToday[0]} />
                    </LinearGradient> */}
                    <ImageGradient
                        mainStyle={{ height: 250, flexDirection: 'column' }}
                        // gradientStyle={['#FF4A3F', '#FF6A15']}
                        localImage={false}
                        imageUrl={this.state.eventsToday[0].image}
                        startPosition ={{x:0,y:0}}
                        rgbcsvStart={'0,0,0'}
                        rgbcsvEnd={'10,10,10'}
                        opacityStart={0.9}
                        opacityEnd={0.5}
                    >
                        <Text style={{ marginTop: 10, fontFamily: 'Roboto', color: 'white', fontSize: 25 }}>
                            In the spotlight
                        </Text>
                        <TouchableOpacity activeOpacity={0.6}>
                            <FastImage
                                style={{ width: 150, height: 100, borderRadius: 10, margin: 10 }}
                                source={{ uri: "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25" }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            {/* <EventCard pressed={this.handleEventClick} width={150} height={100} item={{ image: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25' }} /> */}
                        </TouchableOpacity>
                        <View style={{ flex: 1, paddingTop: 5}}>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 20, color: '#fff' }}>
                                {this.state.eventsToday[0].title}
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Thin', fontSize: 20, color: '#fff' }}>
                                Manav Rachna
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Thin', fontSize: 15, color: '#fff' }}>
                                20-10-2018 9:30
                            </Text>
                        </View>
                    </ImageGradient>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						All about today 
					</Text>
					<FlatList 
						horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
						data={this.state.event_list} 
						renderItem={({item}) => 
                            <EventCard pressed={this.handleEventPress} width={200} height={150} item={item} />
                        } 
					/>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						Some other things 
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
                        data={this.state.event_list} 
						renderItem={({item}) => 
                            <EventCard pressed={this.handleEventPress} width={200} height={150} item={item} />
                        } 
					/>
                    
                </ScrollView>
                
            </View>
        );
    }

}

export default Home;