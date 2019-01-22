import React from 'react';
import { ActivityIndicator, AsyncStorage, TouchableOpacity, Dimensions, View, Text, ScrollView } from 'react-native';
import Realm from '../realm';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
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
        const process_realm_obj = this.process_realm_obj;
        axios.post('http://127.0.0.1:65534/events/user/fetch-event-data', { _id: this.props.item._id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        realm.create('Events', { _id: this.props.item._id, views: response.data[0].views + "" }, true);
                        realm.create('Events', { _id: this.props.item._id, enrollees: response.data[0].enrollees + "" }, true);
                    });
                    this.setState({ item: { ...this.props.item, views: response.data[0].views, enrollees: response.data[0].enrollees } })
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
        axios.post('http://127.0.0.1:65534/events/user/interested', { _id: this.props.item._id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            console.log(response);
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
        console.log("success");
        this.setState({ item: { ...item, going: 'true' } })
    }

    render() {
        const { item } = this.state;
        console.log(item);
        return(
            <View
                style={{
                    flex: 1
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
                        style={{ width: WIDTH - 20, marginLeft: 10, marginTop: 5, height: 200, borderRadius: 10 }}
                        source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(item.media)[0] }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
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
                                padding: 10,
                                marginRight: 10,
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
                                    fontSize: 25,
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
                                    
                                    {"Hosted By " }
                                    <Text
                                        style={{
                                            color: 'blue',
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
                                { this.formatAMPM(item.date) }
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    color: '#222',
                                }}
                            >
                                { item.location }
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
                            paddingTop: 10,
                            marginTop: 10,
                            paddingBottom: 20,
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: '#f0f0f0',
                            margin: 10,
                            borderRadius: 10,
                            minHeight: 100,
                            
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                paddingBottom: 10,
                                fontSize: 15,
                                fontFamily: 'Roboto'
                            }}
                        >
                            DESCIRPTION
                        </Text>
                        <Text
                            textBreakStrategy="highQuality"
                            style={{
                                fontFamily: 'Roboto-Light',
                                fontSize: 15,
                                overflow: 'hidden',
                                textAlign: 'left',
                                color: '#222'
                            }}
                        >   
                            {item.description}
                        </Text>

                    </View>
                    <View
                        style={{
                            paddingTop: 10,
                            marginTop: 10,
                            paddingBottom: 20,
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: '#f0f0f0',
                            margin: 10,
                            borderRadius: 10,
                            minHeight: 100,
                            
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                paddingBottom: 10,
                                fontSize: 15,
                                fontFamily: 'Roboto'
                            }}
                        >
                            CONTACT DETAILS
                        </Text>
                        <Text
                            textBreakStrategy="highQuality"
                            style={{
                                fontFamily: 'Roboto-Light',
                                fontSize: 15,
                                overflow: 'hidden',
                                textAlign: 'left',
                                color: '#222'
                            }}
                        >   
                            {item.contact_details}
                        </Text>

                    </View>
                    <View
                        style={{
                            paddingTop: 10,
                            marginTop: 10,
                            paddingBottom: 20,
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: '#f0f0f0',
                            margin: 10,
                            borderRadius: 10,
                            minHeight: 100,
                            
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                paddingBottom: 10,
                                fontSize: 15,
                                fontFamily: 'Roboto'
                            }}
                        >
                            FAQ
                        </Text>
                        <Text
                            textBreakStrategy="highQuality"
                            style={{
                                fontFamily: 'Roboto-Light',
                                fontSize: 15,
                                overflow: 'hidden',
                                textAlign: 'left',
                                color: '#222'
                            }}
                        >   
                            {item.faq}
                        </Text>
                    </View>
                    <View
                        style={{
                            marginBottom: 20,
                            marginLeft: 10
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Light',
                                
                                // marginLeft: 10
                            }}
                        >
                            Category : <Text
                                style={{
                                    fontWeight: '800',
                                    color: '#222',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {item.category}
                            </Text>
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Light',
                                marginTop: 10
                                // marginLeft: 10
                            }}
                        >
                            Tags : <Text
                                style={{
                                    fontWeight: '800',
                                    color: '#222',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {item.tags}
                            </Text>
                        </Text>
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
                                    "I'M INTERESTED"
                                }
                            </Text>
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
                                    "SEND REGISTRATION ?"
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