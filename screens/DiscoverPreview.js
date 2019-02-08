/* eslint-disable consistent-return */
import React from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';

import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';

const WIDTH = Dimensions.get('window').width;
// const { TOKEN } = Constants;

class DiscoverPreview extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    // this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    try {
      Animated.spring(
        this.position,
        {
          toValue: 400,
          friction: 5
        }
      ).start();
    } catch(e) {
      console.log(e);
    }
  }

  getItemView = (item) => {
    // eslint-disable-next-line default-case
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
            <TouchableOpacity
              style={{
                position: 'absolute',
                justifyContent: 'center',
                textAlign: 'right',
                width: 35,
                right: 10,
                top: 10,
                height: 35,
                padding: 5,
                backgroundColor: '#ffffff99',
                borderRadius: 30
              }}
              onPress={() => Navigation.dismissOverlay(this.props.componentId)}
            >
              <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={25} name="close" />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 10,
            margin: 10,
            backgroundColor: 'blue'
          }}
          onPress={() => {
            Navigation.showModal({
              component: {
                id: 'channeldetailscreen',
                name: 'Channel Detail Screen',
                passProps: {
                  id: item.channel
                },
                options: {
                  bottomTabs: {
                    animate: true,
                    drawBehind: true,
                    visible: false
                  },
                  topBar: {
                    title: {
                      text: item.channel_name
                    },
                    visible: true
                  }
                }
              }
            });
            Navigation.dismissOverlay(this.props.componentId);
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: '#fff'
            }}
          >
            Visit Channel
          </Text>
          
        </TouchableOpacity>
      </View>
    );
  }
}

export default DiscoverPreview;
