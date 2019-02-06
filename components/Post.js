import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Post = (props) => {
  const { message, thumb } = props;
  return (
    <LinearGradient
      style={{
        flex: thumb ? undefined : 1,
        height: 250,
        // borderRadius: thumb ? 10 : undefined,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      colors={['#0056e5', '#85f5ff']}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Roboto',
          color: '#fff'
        }}
      >
        {message} 
      </Text>
    </LinearGradient>
  );
};
export default Post;
