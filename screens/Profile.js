import React from 'react';
import { AsyncStorage, View, Text, Button } from 'react-native';
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
            <View>
                <View style={{margin : 10, marginTop : 20, backgroundColor : '#456', justifyContent : 'center', alignItems : 'center'}}>
                <FastImage
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius : 60,
                        tintColor : '#FF4A3F',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    source= {require('../media/LogoWhite.png')}
                />
                </View>
            </View>
        );
    }

}

export default Profile;
