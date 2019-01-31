import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

class PostImageThumbnail extends React.Component {
    render() {
        return(
            <View style={{ width : (WIDTH / 3) - 6, height : WIDTH / 3, alignItems: 'center', justifyContent: 'center', margin : 3, backgroundColor : '#efefef',}} >
                <FastImage
                    style={{
                        width: '100%',
                        height: '100%',
                        margin : 5,
                        borderRadius : 10 
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.image }}
                />

                <View style={{top : 5, position : 'absolute', right : 5, backgroundColor : 'rgba(255, 255, 255, 0.3)', padding : 5, borderRadius : 25}}>
                    <Icon name = 'image' size={12} style={{color : '#fff',}} />
                </View>
            </View>
        );
    }
}

export default PostImageThumbnail;