import React from 'react';
import { View, Text } from 'react-native';

class Poll extends React.Component {
    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff'
                }}
            >
                <Text>This is the Poll Component</Text>
            </View>
        );
    }
}

export default Poll;