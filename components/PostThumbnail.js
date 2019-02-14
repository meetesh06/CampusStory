import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const PostThumbnail = (props) => {
  const { message, channel_name, channel_image} = props;
  return (
    <LinearGradient
      style={{
        width: WIDTH,
        height: HEIGHT * 0.73,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      colors={['#FF6A15', '#FF4A3F']}
    >
      <Text
        style={{
          fontSize: 25,
          textAlign: 'center',
          margin: 5,
          fontFamily: 'Roboto',
          color: '#fff',
        }}
        numberOfLines={4}
        lineBreakMode="tail"
      >
        {message}
      </Text>
      <View
        style={{
          top: 5,
          position: 'absolute',
          right: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          padding: 5,
          borderRadius: 25
        }}
      >
        <Icon name="text" size={18} style={{ color: '#fff' }} />
      </View>
      <View
      style={{
        top : 5,
        position : 'absolute',
        left : 5,
      }}>

      {/* <FastImage
        style={{
          width: 36,
          height: 36,
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: `https://www.mycampusdock.com/${channel_image}` }}
        /> */}
        <Text>{'' + channel_image}</Text>
      </View>
    </LinearGradient>
  );
};
export default PostThumbnail;
