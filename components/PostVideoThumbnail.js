import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.Component {
    render() {
        return(
            <View style={{ width : (WIDTH - 20) / 3, height : WIDTH / 3, alignItems: 'center', justifyContent: 'center' }} >
                <Video 
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.video }}
                    style={{
                        backgroundColor: '#333',
                        width: '100%',
                        height: '100%',
                        margin: 5,
                    }}
                    repeat
                    muted
                />
            </View>
        );
    }
}

export default PostImage;