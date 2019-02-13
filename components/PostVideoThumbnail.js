import React from 'react';
import { Dimensions, View } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const PostImage = (props) => {
  const { video } = props;
  return (
    <View
      style={{
        width: (WIDTH),
        height: HEIGHT * 0.73,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Video
        source={{ uri: `https://www.mycampusdock.com/${video}` }}
        style={{
          backgroundColor: '#efefef',
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
        repeat
        muted
      />
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
        <Icon
          name="video-camera"
          size={12}
          style={{
            color: '#fff'
          }}
        />
      </View>
    </View>
  );
};

export default PostImage;
