import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Post = (props) => {
  const { message, thumb, type } = props;

  getColors = (type) =>{
    switch(type){
      case 1 : return ['#0056e5', '#85f5ff'];
      case 2 : return ['#FF6A15', '#FF4A3F'];
      default : return ['#0056e5', '#85f5ff'];
    }
  }
  return (
    <LinearGradient
      style={{
        flex: 1,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      colors={this.getColors(type)}
    >
      <Text
        style={{
          fontSize: 20,
          marginLeft : 10,
          marginRight : 10,
          margin : 5,
          fontFamily: 'Roboto',
          color: '#fff',
          textAlign : 'center'
        }}
      >
        {message} 
      </Text>
    </LinearGradient>
  );
};
export default Post;
