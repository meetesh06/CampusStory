import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import SessionStore from '../SessionStore';
import urls from '../URLS';
import constants from '../constants';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.PureComponent {

  componentDidMount(){
    this.setState({launch_time : new Date()});
  }

  componentWillUnmount(){
    const time_elpased = (new Date().getTime() - this.state.launch_time.getTime()) / 1000;
    if(time_elpased >= 3){
      this.viewed();
    }
  }

  viewed = () =>{
    const _id = this.props._id;
    axios.post(urls.UPDATE_STORY_VIEWS, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(constants.TOKEN)
      }
    }).then((response) => {
      console.log(response);
    }).catch((e)=>{
      console.log(e)
    });
  }

  render(){
    const {
      image,
      message
    } = this.props;
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          height: WIDTH + 60,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FastImage
          style={{
            width: WIDTH,
            height: WIDTH + 60
          }}
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: encodeURI( urls.PREFIX + '/' +  `${image}`) }}
        />
        <Text
          style={{
            color: '#fff',
            marginTop: 20,
            marginLeft : 15, marginRight : 15,
            fontFamily: 'Roboto',
            fontSize: 14,
            margin : 5,
            textAlign : 'center',
          }}
        >
          {message}
        </Text>
      </View>
    );
  }
};

export default PostImage;
