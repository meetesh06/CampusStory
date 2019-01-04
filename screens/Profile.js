import React from 'react';
import { AsyncStorage, View, Text, Button } from 'react-native';
import Constants from '../constants';
import { goInitializing } from './helpers/Navigation';
const SET_UP_STATUS = Constants.SET_UP_STATUS;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);        
    }

    handleLogout = async () => {
        try {
            await AsyncStorage.removeItem(SET_UP_STATUS);
            goInitializing();
            console.log('go initializing');
        } catch(e) {
            console.log(e);
        }
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
