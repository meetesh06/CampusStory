import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

const PostImage = (props) => {
  const {
    image,
    message
  } = props;
  return (
    <View
      style={{
        backgroundColor: '#000',
        flex: 1,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FastImage
        style={{
          width: WIDTH,
          height: 500
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: `https://www.mycampusdock.com/${image}` }}
      />
      <Text
        style={{
          color: '#fff',
          marginTop: 15,
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
};

export default PostImage;
