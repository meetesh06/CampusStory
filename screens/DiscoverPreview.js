/* eslint-disable consistent-return */
import React from 'react';
import {
  Animated,
  View,
  Text,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import Constants from '../constants';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';

const WIDTH = Dimensions.get('window').width;
const { TOKEN } = Constants;

class DiscoverPreview extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    // this.handleClose = this.handleClose.bind(this);
  }

  state = {
    loading : false
  }

  componentDidMount() {
    Animated.spring(
      this.position,
      {
        toValue: 400,
        friction: 5
      }
    ).start();
  }

  // handleClose = () => {
  //   const { componentId } = this.props;
  //   Animated.timing(
  //     this.position,
  //     {
  //       duration: 400,
  //       toValue: 0,
  //     }
  //   ).start(() => Navigation.dismissOverlay(componentId));
  // }

  getItemView = (item) => {
    switch (item.type) {
      case 'post': return (
        <Post message={item.message} />
      );
      case 'post-image': return (
        <PostImage image={item.media[0]} message={item.message}/>
      );
      case 'post-video': return (
        <PostVideo video={item.media} message={item.message}/>
      );
    }
  }

  render() {
    const {item} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: '#fff'
          }}
        >
          {item.channel_name}
        </Text>
        <Animated.View style={{
          width: WIDTH - 20,
          marginLeft: 10,
          borderRadius: 10,
          overflow: 'hidden',
          height: this.position,
          backgroundColor: '#fff'
        }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
          >
          {
            this.getItemView(item)
          }
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default DiscoverPreview;
