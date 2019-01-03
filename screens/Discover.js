import React from 'react';
import { View, Text } from 'react-native';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <View style={{ flex: 1 }}>
                <Text>Discover Screen</Text>
            </View>
        );
    }

}

export default Home;