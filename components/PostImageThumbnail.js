import React from 'react';
import { Dimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

const PostImageThumbnail = (props) => {
  const { image } = props;
  return (
    <View
      style={{
        width: (WIDTH / 3) - 2,
        height: WIDTH / 3 + 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#efefef'
      }}
    >
      <FastImage
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: encodeURI(`https://www.mycampusdock.com/${image}`) }}
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
        <Icon name="image" size={10} style={{ color: '#fff' }} />
      </View>
    </View>
  );
};
export default PostImageThumbnail;