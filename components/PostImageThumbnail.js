import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

class PostImageThumbnail extends React.Component {
    render() {
        return(
            <View style={{ width : (WIDTH) / 3, height : WIDTH / 3, alignItems: 'center', justifyContent: 'center', margin : 1, backgroundColor : '#efefef' }} >
                <FastImage
                    style={{
                        width: '100%',
                        height: '100%',
                        margin : 5,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.image }}
                />
            </View>
        );
    }
}

export default PostImageThumbnail;