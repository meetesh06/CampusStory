import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.PureComponent {
  render(){
    const {
      image,
      message
    } = this.props;
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          height: 300,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FastImage
          style={{
            width: WIDTH,
            height: 300
          }}
          resizeMode={FastImage.resizeMode.contain}
          source={{ uri: encodeURI(`https://www.mycampusdock.com/${image}`) }}
        />
        <Text
          style={{
            color: '#fff',
            marginTop: 20,
            marginLeft : 15, marginRight : 15,
            fontFamily: 'Roboto',
            fontSize: 14,
            margin : 5,
            textAlign : 'center',
          }}
        >
          {message}
        </Text>
      </View>
    );
  }
};

export default PostImage;
