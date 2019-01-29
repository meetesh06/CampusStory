import React from 'react';
import { Dimensions, ScrollView, RefreshControl, FlatList, AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
import Constants from '../constants';
import { goInitializing } from './helpers/Navigation';
import FastImage from 'react-native-fast-image';
import Realm from '../realm';
import EventCard from '../components/EventCard';
import EventCardBig from '../components/EventCardBig';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

const WIDTH = Dimensions.get('window').width;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this._updateContent = this._updateContent.bind(this);
        this.handleEventPress = this.handleEventPress.bind(this);
    }

    state = {
        interested: [],
        going: [],
        refreshing: false
    }

    componentDidMount() {
        this._updateContent();
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }
    _updateContent = () => {
        this.setState({ loading: true });
        const process_realm_obj = this.process_realm_obj;
        Realm.getRealm((realm) => {
            let interested = realm.objects('Events').filtered('interested = "true"').filtered('going = "false"').sorted('date');
            let going = realm.objects('Events').filtered('going = "true"').sorted('date');
            process_realm_obj( interested, (result) => {
                this.setState({ interested: result });
            });
            process_realm_obj( going, (result) => {
                this.setState({ going: result, loading: false });
            });
        });
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

    handleLogout = async () => {
        Realm.getRealm((realm)=>{
            realm.write(async () => {
              realm.deleteAll();
              await AsyncStorage.clear();
              goInitializing();
            });
        });
    }

    render() {
        return(
            <View 
                style={{
                    flex: 1
                }}
            >
                
                    <LinearGradient style={{ overflow: 'hidden', justifyContent: 'center', alignItems: 'center', padding : 2 }} colors={['#FF4A3F', '#FF6A15']}>
                        <FastImage
                            style={{
                                width: 84,
                                height: 84,
                                alignSelf: 'center',
                                marginTop : 20,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            source= {require('../media/LogoWhite.png')}
                        />
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                margin: 10,
                                color: '#fff',
                                fontSize: 20
                            }}
                        >
                            Hey There, How is your day going?
                        </Text>
                    </LinearGradient>
                

                {/* <TouchableOpacity style={{backgroundColor : '#FF6A15', borderRadius : 10, width : 100, alignSelf : 'center', marginTop : 50}} onPress={this.handleLogout}>
                    <Text style={{fontSize : 18, color : '#fff', margin : 5, textAlign : 'center'}}>Logout</Text>
                </TouchableOpacity> */}
                <ScrollView 
                    style={{
                        flex: 1
                    }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._updateContent}
                        />
                    }
                >
                    {
                        this.state.interested.length > 0 &&
                        <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
                            Interested Events
                        </Text>
                    }
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
                        data={this.state.interested} 
                        renderItem={({item}) => 
                            <EventCard onPress={this.handleEventPress} width={200} height={150} item={item} />
                        } 
                    />
                    {
                        this.state.going.length > 0 &&
                        <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
                            Registered Events
                        </Text>
                    }
                    {
                        this.state.going.length === 0 &&
                        <View>
                            <Text
                                style={{
                                    marginTop: 10,
                                    fontFamily: 'Roboto-Light',
                                    textAlign: 'center'
                                }}
                            >
                                This page shows all your registered events
                            </Text>
                            <View
                                style={{
                                    backgroundColor: '#333',
                                    flex: 1,
                                    margin: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    height: 300,
                                    justifyContent: 'center'
                                }}
                            >
                                <Icon style={{ textAlign: 'center', padding: 10, color: '#c0c0c0' }} size={50} name="lock1" />
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontFamily: 'Roboto',
                                        textAlign: 'center',
                                        color: '#c0c0c0',
                                    }}
                                >
                                    SECURITY DETAILS
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontFamily: 'Roboto-Thin',
                                        textAlign: 'center',
                                        color: '#c0c0c0'
                                    }}
                                >
                                    All Data is stored locally
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontFamily: 'Roboto-Thin',
                                        textAlign: 'center',
                                        color: '#c0c0c0'
                                    }}
                                >
                                    No personal details are shared with any third party without your permission
                                </Text>
                            </View>
                        </View>
                    }
                    <FlatList 
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index+""}
                        data={this.state.going} 
                        renderItem={({item}) => 
                            <EventCardBig onPress={this.handleEventPress} width={WIDTH - 20} height={(WIDTH - 20) * 0.75} item={item} />
                        } 
                    />
                </ScrollView>
            </View>
        );
    }

}

export default Profile;
