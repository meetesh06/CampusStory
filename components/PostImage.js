import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

const PostImage = (props) => {
  const {
    image,
    message,
    thumb
  } = props;
  return (
    <View
      style={{
        backgroundColor: '#000',
        flex: thumb ? undefined : 1,
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
          marginTop: 10,
          fontFamily: 'Roboto',
          fontSize: 14
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default PostImage;
