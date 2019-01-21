import React from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView } from 'react-native';
import Realm from '../realm';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';

const WIDTH = Dimensions.get('window').width;

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.process_realm_obj = this.process_realm_obj.bind(this);
    }
    state = {
        item: null,
        subscribed: false,
        notify: false
    }

    componentDidMount() {
        // const process_realm_obj = this.process_realm_obj;
        // Realm.getRealm((realm) => {
        //     let element = realm.objects('Firebase').filtered(`_id="${this.props.id}"`);
        //     let item = realm.objects('Channels').filtered(`_id="${this.props.id}"`);
        //     process_realm_obj(element, (result) => {
        //         console.log(result);
        //         if(result.length > 0) {
        //             this.setState({ subscribed: true, notify: result[0].notify === "false" ? false : true  })
        //         }
        //     })
        //     process_realm_obj(item, (result) => {
        //         console.log(result[0]);
        //         this.setState({ item: result[0] })
        //     })
        // });
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }

    render() {
        const item = this.item;
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
                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: 'Roboto-Light',
                            fontSize: 15,
                            padding: 10,
                            backgroundColor: '#e0e0e0',
                            margin: 10,
                            borderRadius: 10,
                            minHeight: 50,
                            overflow: 'hidden',
                            textAlign: 'center',
                            color: '#333'
                        }}
                    >
                        {item !== null && item.description}
                    </Text>
                    <View
                        style={{
                            marginTop: 20,
                            flexDirection: 'row'
                        }}
                    >
                        <Icon 
                            style={{
                                marginLeft: 10,
                                color: '#333'
                            }}
                            size={30} 
                            name="smileo" 
                        />
                        <Text
                            style={{ 
                                textAlign: 'center',
                                textAlignVertical: 'auto',
                                fontSize: 15,
                                marginLeft: 10,
                                alignSelf: 'center',
                            }}
                        >
                            {item !== null && item.followers} Following
                        </Text>
                    </View>
                </ScrollView>
                <View
                    style={{
                        backgroundColor: this.state.subscribed ? '#c0c0c0' : 'blue' ,
                        flexDirection: 'row'
                    }}
                >
                    <TouchableOpacity
                        onPress={this.handleSubscribe}
                        style={{
                            padding: 20,
                            // backgroundColor: 'red',
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
                            { !this.state.subscribed && "SUBSCRIBE"}
                            { this.state.subscribed && "UNSUBSCRIBE"}
                        </Text>
                    </TouchableOpacity>
                    {
                        this.state.subscribed &&
                        <TouchableOpacity
                            onPress={this.handleNotify}
                            style={{
                                padding: 20,
                                backgroundColor: this.state.notify ? '#c0c0c0' : '#0a9ad3',
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
                                GET NOTIFIED
                            </Text>
                        </TouchableOpacity>
                    }

                </View>
            </View>
        );
    }
}

export default EventDetail;