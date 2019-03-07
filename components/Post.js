import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import SessionStore from '../SessionStore';
import urls from '../URLS';
import constants from '../constants';

class Post extends React.PureComponent {
  constructor(props){
    super(props);
  }

  state = {
    launch_time : new Date(),
  }

  getColors = (type) =>{
    let arr = [];
    switch(type){
        case 1 : arr =  ['#0056e5', '#85f5ff']; break;
        case 2 : arr = ['#232526', '#414345'];break;
        case 3 : arr = ['#f12711', '#f5af19'];break;
        default : arr = ['#0056e5', '#85f5ff'];break;
    }
    return arr;
  }

  componentDidMount(){
    this.setState({launch_time : new Date()});
    console.log('MOUNTED')
  }

  componentWillUnmount(){
    const time_elpased = (new Date().getTime() - this.state.launch_time.getTime()) / 1000;
    console.log('UNMOUNTED', time_elpased);
    if(time_elpased >= 3){
      this.viewed();
    }
  }

  viewed = () =>{
    console.log('VIEWED');
    const _id = this.props.data._id;
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
  const { data } = this.props;
  const config = JSON.parse(data.config);
  
  return (
    <LinearGradient
      style={{
        flex: 1,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      colors={this.getColors(config.type_color)}
    >
      <Text
        style={{
          fontSize: 20,
          marginLeft : 10,
          marginRight : 10,
          margin : 5,
          fontFamily: 'Roboto-' + config.type_font,
          color: '#fff',
          textAlign : 'center'
        }}
      >
        {data.message} 
      </Text>
    </LinearGradient>
  );
  }
};
export default Post;
