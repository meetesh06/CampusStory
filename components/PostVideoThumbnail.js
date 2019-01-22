import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.Component {
    render() {
        return(
            <View style={{ width : (1 * WIDTH) / 3, height : (1 * WIDTH) / 3, alignItems: 'center', justifyContent: 'center', margin : 1 }} >
                <Video 
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.video }}
                    style={{
                        backgroundColor: '#efefef',
                        width: '100%',
                        height: '100%',
                        margin: 5,
                    }}
                    resizeMode = 'cover'
                    repeat
                    muted
                />
            </View>
        );
    }
}

export default PostImage;