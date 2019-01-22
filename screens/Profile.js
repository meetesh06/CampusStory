import React from 'react';
import { AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
import Constants from '../constants';
import { goInitializing } from './helpers/Navigation';
import FastImage from 'react-native-fast-image';
import Realm from '../realm';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);        
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
            <View >
                <View style={{margin : 10, marginTop : 50, justifyContent : 'center', alignItems : 'center',}}>
                    <View style={{backgroundColor : '#efefef', borderRadius : 45, padding : 2,}}>
                        <FastImage
                            style={{
                                width: 84,
                                height: 84,
                                padding : 5,
                                margin : 2,
                                borderRadius : 45,
                                backgroundColor : '#ff4a3f'
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            source= {require('../media/LogoWhite.png')}
                        />
                    </View>
                </View>

                <TouchableOpacity style={{backgroundColor : '#FF6A15', borderRadius : 10, width : 100, alignSelf : 'center', marginTop : 50}} onPress={this.handleLogout}>
                    <Text style={{fontSize : 18, color : '#fff', margin : 5, textAlign : 'center'}}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

export default Profile;
