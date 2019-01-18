import React from 'react';
import { AsyncStorage, View } from 'react-native';
import axios from 'axios';
import Constants from '../constants';

const TOKEN = Constants.TOKEN;

class StoryScreen extends React.Component {

    async componentDidMount() {
        axios.post('https://www.mycampusdock.com/channels/get-activity-list', { channel_id: this.props._id ,last_updated: 'NIL' }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
                response.data;
            }
            
        }).catch( err => console.log(err) );

    }

    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#00000088'
                }}
            >

            </View>
        );
    }
}
export default StoryScreen;