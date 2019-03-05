import React from 'react';
import { Dimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;


class PostImageThumbnail extends React.PureComponent {
  render(){
  const { image } = this.props;
    return (
      <View
        style={{
          width: (WIDTH / 3),
          height: WIDTH / 3 + 20,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0.5,
          backgroundColor: '#555'
        }}
      >
        <FastImage
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: encodeURI( urls.PREFIX + '/' +  `${image}`) }}
        />
        <View
          style={{
            top: 5,
            position: 'absolute',
            right: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 5,
            borderRadius: 25
          }}
        >
          <Icon name="image" size={10} style={{ color: '#eee' }} />
        </View>
      </View>
    );
  }
};
export default PostImageThumbnail;