import React from 'react';
import { AsyncStorage, ActivityIndicator, Alert, TextInput, TouchableOpacity, Animated, View, Text, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Constants from '../constants';
import Realm from '../realm';

const WIDTH = Dimensions.get('window').width;
const TOKEN = Constants.TOKEN;

class GoingDetails extends React.Component {
    constructor(props) {
        super(props);
        this.position = new Animated.Value(0);
        this.handleClose = this.handleClose.bind(this);
    }

    state = {
        name: '',
        email: '',
        phone: '',
        loading: false
    }

    componentDidMount() {
        Animated.spring(
            this.position,
            {
                toValue: 300,
                friction: 5
            }
        ).start();
    }

    handleClose = () => {

        
        Animated.timing(
            this.position,
            {
                duration: 300,
                toValue: 0,
                // friction: 0
            }
        ).start( () => Navigation.dismissOverlay(this.props.componentId) );
        
    }

    handleSubmit = async () => {
        if(this.state.loading) return;
        
        let handleClose = this.handleClose;

        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var re1 = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
        
        if(this.state.name.length < 3) return Alert.alert(" invalid name ");
        if(!re.test( this.state.email.toLowerCase() )) return Alert.alert(" invalid email ");
        if(!re1.test( this.state.phone.toLowerCase() )) return Alert.alert(" invalid phone ");
        this.setState({ loading: true });
        axios.post('http://127.0.0.1:65534/events/user/enroll', { _id: this.props._id, name: this.state.name, email: this.state.email, phone: this.state.phone }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            console.log(response);
            if(!response.data.error) {
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        realm.create('Events', { _id: this.props._id, going: "true" }, true);
                    });
                    handleClose();
                });
            }
            else
                this.setState({ loading: false })
        }).catch( err => this.setState({ loading: false }) )
    }

    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#000000ee',
                    justifyContent: 'center'
                }}
            >
                
                {/* <TouchableOpacity
                    style={{
                        flex: 1
                    }}
                    disabled={this.loading}
                    onPress={this.handleClose}
                >
                </TouchableOpacity> */}
                <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: 'Roboto',
                        fontSize: 25,
                        margin: 5,
                        color: '#fff'
                    }}
                >
                    Enter Details
                </Text>
                <Animated.View style={{
                    width: WIDTH - 40,
                    marginLeft: 20,
                    // flex: 2,
                    borderRadius: 10,
                    overflow: 'hidden',
                    height: this.position,
                    backgroundColor: '#fff'
                }}>
                    {/* <Text> { this.props._id } </Text> */}
                    <View
                        style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            justifyContent: 'center'
                        }}
                    >
                        <TextInput
                            autoCapitalize={"none"}
                            style={{
                                textAlign: 'center',
                                fontSize: 15,
                                padding: 15,
                                margin: 10,
                                borderRadius: 10,
                                backgroundColor: '#f0f0f0'
                            }}
                            placeholder="name"
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        <TextInput
                            autoCapitalize={"none"}
                            style={{
                                textAlign: 'center',
                                fontSize: 15,
                                padding: 15,
                                margin: 10,
                                borderRadius: 10,
                                backgroundColor: '#f0f0f0'
                            }}
                            placeholder="email"
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                        <TextInput
                            autoCapitalize={"none"}
                            style={{
                                textAlign: 'center',
                                fontSize: 15,
                                padding: 15,
                                margin: 10,
                                borderRadius: 10,
                                backgroundColor: '#f0f0f0'
                            }}
                            placeholder="phone"
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}
                        />
                        

                    </View>
                    <TouchableOpacity
                        style={{
                            // flex: 1,
                            height: 50,
                            backgroundColor: this.props.going === "true" ? '#c0c0c0' : 'blue',
                            justifyContent: 'center'
                        }}
                        disabled={this.state.loading || this.props.going === "true"}
                        onPress={this.handleSubmit}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                color: 'white'
                            }}
                        >
                            SUBMIT
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={{
                        // flex: 1,
                        height: 100,
                        justifyContent: 'center',
                        // backgroundColor: 'red'
                    }}
                    disabled={this.loading}
                    onPress={this.handleClose}
                >
                    {
                        this.state.loading &&
                        <ActivityIndicator size="small" color="#fff" />
                    }

                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#fff'
                        }}
                    >
                        {
                            !this.state.loading &&
                            "Cancel"
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default GoingDetails;