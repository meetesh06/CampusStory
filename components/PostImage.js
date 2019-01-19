import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.Component {
    render() {
        return(
            <View style={{ backgroundColor: '#000', flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <FastImage
                    style={{
                        width: WIDTH,
                        height: 500
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.image }}
                />
                <Text
                    style={{
                        color: '#fff',
                        marginTop: 10,
                        fontFamily: 'Roboto',
                        fontSize: 14
                    }}
                >
                    {this.props.message}
                </Text>
            </View>
        );
    }
}

export default PostImage;