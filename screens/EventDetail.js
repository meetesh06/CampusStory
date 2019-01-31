import React from 'react';
import { ActivityIndicator, AsyncStorage, TouchableOpacity, Dimensions, View, Text, ScrollView } from 'react-native';
import Realm from '../realm';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Constants from '../constants';
import { Navigation } from 'react-native-navigation';

const WIDTH = Dimensions.get('window').width;
const TOKEN = Constants.TOKEN;

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        // this.item = props.item;
        this.process_realm_obj = this.process_realm_obj.bind(this);
        this.getMonthName = this.getMonthName.bind(this);
        this.formatAMPM = this.formatAMPM.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.success = this.success.bind(this);
        this.handleGoing = this.handleGoing.bind(this);
    }
    state = {
        item: this.props.item,
        going: false,
        loading: false,
        notify: false
    }

    async componentDidMount() {
        axios.post('https://www.mycampusdock.com/events/user/fetch-event-data', { _id: this.props.item._id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
                Realm.getRealm((realm) => {
                    let el = response.data[0];
                    realm.write(() => {
                        let current = realm.objects('Events').filtered(`_id="${this.props.item._id}"`);
                        realm.delete(current);
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
                        realm.create('Events', el, true);
                    });
                    this.setState({ item: el })
                });
            }
        }).catch( err => console.log(err) );

        
        
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }

    getMonthName = (num) => {
        switch(num) {
            case 1:
                return "JAN"
            case 2:
                return "FEB"    
            case 3:
                return "MAR"
            case 4:
                return "APR"
            case 5:
                return "MAY"
            case 6:
                return "JUN"
            case 7:
                return "JUL"
            case 8:
                return "AUG"
            case 9:
                return "SEP"
            case 10:
                return "OCT"
            case 11:
                return "NOV"
            case 12:
                return "DEC"
            default: 
                return "FUCK"
            
        }
    }

    formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    handleClick = async () => {
        if(this.state.loading) return;
        this.setState({ loading: true });
        axios.post('https://www.mycampusdock.com/events/user/interested', { _id: this.props.item._id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        realm.create('Events', { _id: this.props.item._id, interested: "true" }, true);
                        this.setState({ item: { ...this.state.item, interested: "true" } });
                    });
                });
            }
        }).catch( err => console.log(err) )
        .finally(() => this.setState({ loading: false }));
        
    }
    handleGoing = () => {
        if(this.state.loading) return;
        let going = "false";
        Realm.getRealm((realm) => {
            realm.write(() => {
                let Final = realm.objects('Events').filtered(`_id="${this.props.item._id}"`);
                going = Final[0].going;
            });
        });

        Navigation.showOverlay({
            component: {
                name: 'Going Details',
                passProps: {
                    _id: this.props.item._id,
                    going
                },
                options: {
                    overlay: {
                        interceptTouchOutside: true
                    }
                }
            }
        });
    }

    success = () => {
        this.setState({ item: { ...item, going: 'true' } })
    }

    render() {
        const { item } = this.state;
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff'
                }}
            >

                <ScrollView 
                    style={{
                        flex: 1,
                        // backgroundColor: '#333'
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            // flex: 1,
                            // height: 350
                        }}
                    >
                    </View>
                    <View>
                    <FastImage
                        style={{ width: WIDTH - 20, marginLeft: 10, marginTop: 10, height: 200, borderRadius: 10 }}
                        source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(item.media)[0] }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{backgroundColor : '#rgba(0, 0, 0, 0.5)', position : 'absolute', top : 15, right : 15, borderRadius : 5}}>
                        <Text style={{ fontSize : 15, color : '#efefef', marginLeft : 10, marginRight : 10, margin: 5 }}>{item.category.toUpperCase()}</Text>
                    </View>
                    </View>
                    <View
                        style={{
                            // margin: 5,
                            flex: 1,
                            marginTop: 5,
                            marginLeft: 5,
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                marginRight: 10,
                                paddingRight : 10,
                                paddingLeft : 10,
                                padding : 5,
                                borderRadius: 10
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 15,
                                    color: '#fa3e3e',
                                    textAlign: 'center',
                                    fontWeight: '900'
                                }}
                            >
                            { this.getMonthName(item.date.getMonth() + 1) }
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 22,
                                    color: '#333',
                                }}
                            >
                                {/* { JSON.stringify( item.date ) } */}
                                { JSON.stringify( item.date.getDate() ) }
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 20,
                                    color: '#222',
                                }}
                            >
                                { item.title }
                            </Text>
                            <TouchableOpacity
                                style={{
                                    marginTop: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Thin'
                                    }}
                                >
                                    
                                    {"Hosted by " }
                                    <Text
                                        style={{
                                            color: '#1111aa',
                                            fontFamily: 'Roboto'
                                        }}
                                    >
                                        { item.channel_name }
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            marginLeft: 5,
                            flex: 1,
                            
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 10
                            }}
                        >
                            <Icon1 style={{ color: '#fa3e3e', }} size={30} name="location-pin" />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    // color: '#222',
                                }}
                            >
                                { item.location }
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    color: '#222',
                                }}
                            >
                                { this.formatAMPM(item.date) }
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 10
                            }}
                        >
                            <Icon style={{ color: '#444', }} size={30} name="smileo" />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    // color: '#222',
                                }}
                            >
                                { item.enrollees } People Going
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    color: '#222',
                                }}
                            >
                                { item.views } Views
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 10
                            }}
                        >
                            <Icon1 style={{ color: '#444', }} size={30} name="text" />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    // color: '#222',
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 10
                            }}
                        >
                            <IconIonicons style={{ color: '#444', }} size={30} name="md-contact" />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    // color: '#222',
                                }}
                            >
                                {item.contact_details}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            padding: 5,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 10
                            }}
                        >
                            <Icon style={{ color: '#444', }} size={30} name="questioncircleo" />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    // color: '#222',
                                }}
                            >
                                {item.faq}
                            </Text>
                        </View>
                    </View>
                    
                </ScrollView>
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    { item.interested === "false" &&
                        <TouchableOpacity
                            onPress={this.handleClick}
                            style={{
                                padding: 20,
                                backgroundColor: 'blue',
                                flex: 1
                            }}
                        >
                            {
                                this.state.loading &&
                                <ActivityIndicator size="small" color="#fff" />
                            }
                            {
                                !this.state.loading &&
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 20,
                                        fontFamily: 'Roboto',
                                        textAlign: 'center'
                                    }}
                                >    
                                    I'M INTERESTED
                                </Text>
                            }
                        </TouchableOpacity> }
                    { item.interested === "true" && item.going === "false" &&
                        <TouchableOpacity
                            onPress={this.handleGoing}
                            style={{
                                padding: 20,
                                backgroundColor: '#fa3e3e',
                                flex: 1
                            }}
                        >
                            {
                                this.state.loading &&
                                <ActivityIndicator size="small" color="#fff" />
                            }
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    fontFamily: 'Roboto',
                                    textAlign: 'center'
                                }}
                            >
                                {
                                    !this.state.loading &&
                                    "Want to Register Now?"
                                }
                            </Text>
                        </TouchableOpacity> }
                    { item.interested === "true" && item.going === "true" &&
                        <TouchableOpacity
                            style={{
                                padding: 20,
                                backgroundColor: '#c0c0c0',
                                flex: 1
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    fontFamily: 'Roboto',
                                    textAlign: 'center'
                                }}
                            >
                                GOING
                            </Text>
                        </TouchableOpacity> }
                    

                </View>
            </View>
        );
    }
}

export default EventDetail;