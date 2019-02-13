import React from 'react';
import { Dimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const PostImageThumbnail = (props) => {
  const { image } = props;
  return (
    <View
      style={{
        width: WIDTH,
        height: HEIGHT * 0.73,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#666'
      }}
    >
      <FastImage
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: `https://www.mycampusdock.com/${image}` }}
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
        <Icon name="image" size={12} style={{ color: '#fff' }} />
      </View>
    </View>
  );
};
export default PostImageThumbnail;
