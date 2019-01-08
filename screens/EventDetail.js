import React from 'react';
import { View, Text } from 'react-native';

class EventDetail extends React.Component {
    render() {
        console.log(this.props);
        return(
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text>{this.props.id}</Text>
            </View>
        );
    }
}

export default EventDetail;