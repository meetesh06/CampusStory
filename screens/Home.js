import React from 'react';
import { Dimensions, RefreshControl, TouchableOpacity, ScrollView, Image, Platform, FlatList, AsyncStorage, View, Text } from 'react-native';
import Constants from '../constants';
import EventCard from '../components/EventCard';
import EventCardBig from '../components/EventCardBig';
import StoryIcon from '../components/StoryIcon';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Realm from '../realm';
import Swiper from 'react-native-swiper';
import firebase from 'react-native-firebase';
import Spotlight from '../components/Spotlight';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

const TOKEN = Constants.TOKEN;
const INTERESTS = Constants.INTERESTS;
const WIDTH = Dimensions.get('window').width;

import FastImage from 'react-native-fast-image'
class Home extends React.Component {
    constructor(props) {
        super(props);
        // this.handleLogout = this.handleLogout.bind(this);
        this.handleEventPress = this.handleEventPress.bind(this);
        this.handleStoryPress = this.handleStoryPress.bind(this);
        this._updateContent = this._updateContent.bind(this);
        this.process_realm_obj = this.process_realm_obj.bind(this);
        this._updateLists = this._updateLists.bind(this);
    }

    state = {
        event_list: [],
        refreshing: true,
        interests: [],
        channels: [

        ],
        eventsToday: [
        ],
        eventsChannels: []
    }

    async componentDidMount() {
        const interests = await AsyncStorage.getItem(INTERESTS);
        this._updateContent();
        this.setState({ interests: interests.split(',') })
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            console.log(notification);
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log(notification);
        });
        if(!firebase.messaging().hasPermission()){
            await firebase.messaging().requestPermission();
        }
        
    }
    
    _updateLists = async (last_updated, channels_list) => {
        const process_realm_obj = this.process_realm_obj;
        axios.post('https://www.mycampusdock.com/events/user/get-event-list', { last_updated }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            if(!response.data.error) {
                response.data.data.forEach((el)=>{
                    el.reach = JSON.stringify(el.reach);
                    el.views = JSON.stringify(el.views);
                    el.enrollees = JSON.stringify(el.enrollees);
                    el.name = JSON.stringify(el.name);
                    el.audience = JSON.stringify(el.audience);
                    el.media = JSON.stringify(el.media);
                    el.timestamp = new Date(el.timestamp);
                    el.time = new Date(el.time);
                    let ts = Date.parse(''+el.date);
                    el.date = new Date(el.date);
                    el.ms = ts;
                    el.reg_end = new Date(el.reg_end);
                    el.reg_start = new Date(el.reg_start);
                    el.interested = "false";
                    el.going = "false";
                });
                let data = response.data.data;
                if(data.length === 0) return;
                
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
                    // let Events = realm.objects('Events').sorted('date', true);
                    // process_realm_obj(Events, (result) => {
                    //     this.setState({ event_list: result });
                    // });
                });
            }
        }).catch( err => console.log(err) 
        )

        let formData = new FormData();
        formData.append("channels_list", JSON.stringify(channels_list));

        axios.post('https://www.mycampusdock.com/channels/fetch-activity-list', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
                Realm.getRealm((realm) => {
                    for (var key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            // key -> data
                            let data = response.data[key].data;
                            if(data.length > 0) {
                                data.forEach( (el) => {
                                    el.reach = JSON.stringify(el.reach);
                                    el.views = JSON.stringify(el.views);
                                    el.audience = JSON.stringify(el.audience);
                                    el.timestamp = new Date(el.timestamp);

                                    el.poll_type = el.poll_type === undefined ? "" : el.poll_type;
                                    el.options = JSON.stringify(el.options === undefined ? "" : el.options);
                                    
                                    el.answered = el.answered === undefined ? "" : el.answered;
                                    
                                    if(el.type === "post-video")
                                        el.media = el.media;
                                    else
                                        el.media = JSON.stringify(el.media === undefined ? "" : el.media);
                                    
                                    el.name = JSON.stringify(el.name);

                                    el.read = "false";
                                });
                                realm.write(() => {
                                    let i;
                                    
                                    for(i=0;i<data.length;i++) {
                                        try {
                                            realm.create('Activity', data[i], true);
                                        } catch(e) {
                                            console.log(e);
                                        }
                                    }
                                
                                    // let current = realm.objects('Channels').filtered(`_id="${key}"`);
                                    realm.create('Channels', { _id: key, updates: 'true' }, true);
                                    
                                });
                                
                            }
                            // console.log(key + " -> " + response.data[key]);
                        }
                        let Subs = realm.objects('Firebase').filtered('channel="true"');
                        process_realm_obj(Subs, (result) => {
                            let final = [];
                            
                            result.forEach( (value) => {
                                let current = realm.objects('Channels').filtered(`_id="${value._id}"`);
                                final.push(current[0]);
                            })
                            process_realm_obj(final, (channels) => {
                                this.setState({ channels })
                            });
                        });
                    }
                });
            }
        }).catch( err => console.log(err) )
    }

    _updateContent = async () => {
        const process_realm_obj = this.process_realm_obj;
        let interests = await AsyncStorage.getItem(INTERESTS);
        interests = interests.split(',');
        const _updateLists = this._updateLists;
        this.setState({ refreshing: true });
        let last_updated;
        Realm.getRealm((realm) => {
            let ts = Date.parse(new Date()) + (7 * 24 * 60 * 60 * 1000);
            let cs = Date.parse(new Date());
            let Events = realm.objects('Events').sorted('timestamp', true);

            interests.forEach( (value) => {
                let current = Events.filtered('ms > ' + cs).filtered('going="false"').filtered('category="' + value +'"').sorted('date', true);
                process_realm_obj(current, (result)=>{
                    console.log(value, result);
                    this.setState({ [value]: result});
                })
            })

            
            let latest_events = realm.objects('Events').filtered('going = "false"').filtered('ms > ' + cs).sorted('date', true);
            let week_events = realm.objects('Events').filtered('going = "false"').filtered('ms < ' + ts + ' AND ms > ' + cs).sorted('date', true);
            try {
                last_updated = Events[0].timestamp;
            } catch(e) {
                last_updated = 'NONE';
            }
            process_realm_obj(latest_events, (result)=>{
                this.setState({ event_list: result });
            })

            process_realm_obj(week_events, (result)=>{
                this.setState({ week_event_list: result});
            })

            let Subs = realm.objects('Firebase').filtered('channel="true"');
            let subList = {};

            process_realm_obj(Subs, (result) => {
                console.log(result);
                let final = [];
                
                result.forEach( (value) => {
                    let current = realm.objects('Channels').filtered(`_id="${value._id}"`);
                    let activity = realm.objects('Activity').filtered(`channel="${value._id}"`).sorted('timestamp', true);
                    let timestamp = 'NIL';

                    if(activity.length > 0) {
                        timestamp = activity[0].timestamp;
                    }
                    
                    subList[value._id] = timestamp;
                    
                    final.push(current[0]);
                })
                process_realm_obj(final, (channels) => {
                    this.setState({ channels })
                });
            });

            _updateLists(last_updated, subList);
            this.setState({ refreshing: false })
        });

        
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }

    handleEventPress = (item) => {
        Realm.getRealm((realm) => {
            let current = realm.objects('Events').filtered(`_id="${item._id}"`);
            this.process_realm_obj(current, (result)=>{
                Navigation.push(this.props.componentId, {
                    component: {
                      name: 'Event Detail Screen',
                      passProps: {
                        item: result[0],
                        id: result[0].title
                      },
                      options: {
                        topBar: {
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
            })
        });
        
        
    }
    
    handleStoryPress = (item, index) => {
        let old = [ ...this.state.channels ];
        
        
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
        if(old[index].updates === "true"){
            old[index].updates = "false";
            this.setState({ channels: old })
        }
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
                            renderItem={({item, index}) => 
                                <StoryIcon onPress={(item) => this.handleStoryPress(item, index)} width={96} height={64} item={item} />
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
                                marginTop: 10,
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
                                        fontFamily: 'Roboto'
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
                    <Swiper 
                    showsButtons={false}
                    autoplay
                    loop
                    showsPagination = {false}
                    loadMinimal
                    style={{height : 250}}
                    autoplayTimeout = {5}>
                        {
                            this.state.week_event_list !== undefined && 
                            this.state.week_event_list.map((item, index) =>{
                                return <Spotlight item = {item} key = {item._id} onPress = {this.handleEventPress} />
                            })
                        }
                    </Swiper>
                    {
                        this.state.interests.map( (value, index) =>
                            <View key={index}>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
                                    {value}
                                </Text>
                                <FlatList 
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index+""}
                                    data={this.state[value]} 
                                    renderItem={({item}) => 
                                        <EventCard onPress={this.handleEventPress} width={200} height={150} item={item} />
                                    } 
                                />
                            </View>
                        )
                    }
                    <FlatList 
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
                        data={this.state.event_list} 
                        renderItem={({item}) => 
                            <EventCardBig onPress={this.handleEventPress} width={WIDTH - 20} height={(WIDTH - 20) * 0.75} item={item} />
                        } 
                    />
                    {/* <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						{'From Art & Craft'}
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
                        data={this.state.event_list} 
						renderItem={({item}) => 
                            <EventCard pressed={this.handleEventPress} width={200} height={150} item={item} />
                        } 
					/> */}
                    
                </ScrollView>
                
            </View>
        );
    }

}

export default Home;