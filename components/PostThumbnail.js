import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

class PostThumbnail extends React.PureComponent {
  render(){
  const { message } = this.props;
    return (
      <LinearGradient
        style={{
          width: (WIDTH / 3) - 2,
          height: WIDTH / 3 + 20,
          justifyContent: 'center',
          alignItems: 'center',
          margin : 1
        }}
        colors={['#0056e5', '#85f5ff']}
      >
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            margin: 5,
            fontFamily: 'Roboto',
            color: '#fff',
          }}
          numberOfLines={4}
          lineBreakMode="tail"
        >
          {message}
        </Text>
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
          <Icon name="text" size={10} style={{ color: '#fff' }} />
        </View>
      </LinearGradient>
    );
  }
};
export default PostThumbnail;