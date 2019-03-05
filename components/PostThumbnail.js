import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';

const WIDTH = Dimensions.get('window').width;

class PostThumbnail extends React.PureComponent {
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

  render(){
    const { data } = this.props;
    console.log('PT', data);
    const config = JSON.parse(data.config);
    return (
      <LinearGradient
        style={{
          width: (WIDTH / 3),
          height: WIDTH / 3 + 20,
          justifyContent: 'center',
          alignItems: 'center',
          margin : 0.5,
          backgroundColor: '#555'
        }}
        colors={this.getColors(config.type_color)}
      >
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            margin: 5,
            fontFamily: 'Roboto-' + config.type_font,
            color: '#fff',
          }}
          numberOfLines={4}
          lineBreakMode="tail"
        >
          {data.message}
        </Text>
        <View
          style={{
            top: 5,
            position: 'absolute',
            right: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: 5,
            paddingLeft : 6,
            paddingRight : 5,
            borderRadius: 25
          }}
        >
          <Icon name="text" size={10} style={{ color: '#eee' }} />
        </View>
      </LinearGradient>
    );
  }
};
export default PostThumbnail;