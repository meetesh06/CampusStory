import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.Component {
    render() {
        return(
            <View style={{ width : (WIDTH / 3) - 6, height : (1 * WIDTH) / 3, alignItems: 'center', justifyContent: 'center', margin : 3 }} >
                <Video 
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.video }}
                    style={{
                        backgroundColor: '#efefef',
                        width: '100%',
                        height: '100%',
                        margin: 5,
                        borderRadius : 10 
                    }}
                    resizeMode = 'cover'
                    repeat
                    muted
                />
                <View style={{top : 5, position : 'absolute', right : 5, backgroundColor : 'rgba(255, 255, 255, 0.3)', padding : 5, borderRadius : 25}}>
                    <Icon name = 'video-camera' size={12} style={{color : '#fff',}} />
                </View>
            </View>
        );
    }
}

export default PostImage;