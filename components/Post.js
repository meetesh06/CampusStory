import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Post extends React.Component {
    render() {
        return(
            <LinearGradient style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} colors={['#0056e5', '#85f5ff']} >
                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        color: '#fff'
                    }}
                > {this.props.message} </Text>
            </LinearGradient>
        );
    }
}

export default Post;