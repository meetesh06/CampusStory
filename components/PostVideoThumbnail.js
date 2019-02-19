import React from 'react';
import { Dimensions, View } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

class PostVideoThumbnail extends React.PureComponent {
  
  render(){
    const { video } = this.props;
    return (
      <View
        style={{
          width: (WIDTH / 3) - 2,
          height: (1 * WIDTH) / 3 + 20,
          alignItems: 'center',
          justifyContent: 'center',
          margin : 1
        }}
      >
        <Video
          muted
          volume = {0}
          source={{ uri: encodeURI(`https://www.mycampusdock.com/${video}`) }}
          style={{
            backgroundColor: '#efefef',
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
  }
};

export default PostVideoThumbnail;