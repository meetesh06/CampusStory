import React from 'react';
import { Dimensions, View } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Entypo';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;

class PostVideoThumbnail extends React.PureComponent {
  
  render(){
    const { video } = this.props;
    return (
      <View
        style={{
          width: (WIDTH / 3),
          height: (1 * WIDTH) / 3 + 20,
          alignItems: 'center',
          justifyContent: 'center',
          margin : 0.5,
          backgroundColor: '#555'
        }}
      >
        <Video
          muted={true}
          source={{ uri: encodeURI(urls.PREFIX + '/' +  `${video}`) }}
          style={{
            backgroundColor: '#555',
            width: '100%',
            height: '100%',
            margin : 5
          }}
          resizeMode="cover"
          repeat
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
          <Icon
            name="video-camera"
            size={12}
            style={{
              color: '#eee'
            }}
          />
        </View>
      </View>
    );
  }
};

export default PostVideoThumbnail;