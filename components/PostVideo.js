import React from 'react';
import {
  ActivityIndicator, Dimensions, View, Text
} from 'react-native';
import Video from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

class PostVideo extends React.Component {
    state = {
      loading: true,
      buffering: false
    }

    render() {
      const {
        loading,
        buffering
      } = this.state;
      const {
        message,
        video,
        thumb
      } = this.props;
      return (
        <View style={{
          // backgroundColor: '#000',
          backgroundColor: thumb ? undefined : '#000',
          flex: 1,
          // height: 400,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          <Text />
          <Video
            source={{ uri: `https://www.mycampusdock.com/${video}` }}
            onLoad={() => this.setState({ loading: false })}
            repeat
            // eslint-disable-next-line react/no-unused-state
            onBuffer={val => this.setState({ buffering: val.isBuffering })}
            style={{
              backgroundColor: thumb ? undefined : '#222',
              width: WIDTH,
              height: 300,
              margin: 5,
            }}
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
          {
            (loading || buffering)
              && (
                <ActivityIndicator size="small" color="#fff" />
              )
          }
        </View>
      );
    }
}

export default PostVideo;
