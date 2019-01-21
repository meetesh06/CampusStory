import React from 'react';
import { AsyncStorage, View, Text, Button } from 'react-native';
import Constants from '../constants';
import { goInitializing } from './helpers/Navigation';
const SET_UP_STATUS = Constants.SET_UP_STATUS;
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
            <View style={{ flex: 1, paddingTop: 150 }}>
                <Text>Discover Screen</Text>
                <Button onPress={this.handleLogout} title="logout" />
            </View>
        );
    }

}

export default Profile;
