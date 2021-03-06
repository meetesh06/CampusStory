import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

class AdvertCard extends React.Component {
  state = {
    pressed: false
  }

  componentDidMount(){
    if(this.props.checked){
      this.setState({pressed : true});
    }
  }

  render() {
    const {
      onChecked,
      width,
      height,
      text,
      image
    } = this.props;
    const {
      pressed
    } = this.state;
    return (
      <TouchableOpacity
        style={{
          margin: 7,
          width,
          minHeight: height
        }}
        onPress={() => {
          onChecked();
          this.setState({ pressed: !pressed });
        }}
      >
        <View style={{
          overflow: 'hidden', width, height, borderRadius: 10
        }}
        >
          <FastImage
            style={{
              opacity: pressed ? 0.6 : 1, width, height, borderRadius: 10, position: 'absolute'
            }}
            source={image}
            resizeMode={FastImage.resizeMode.contain}
          />
          {
            pressed
            && (
            <Icon
              name="checkcircle"
              style={{
                fontSize: 20,
                color: 'orange',
                position: 'absolute',
                bottom: 0,
                right : 0,
              }}
            />
            )
          }
        </View>
        <Text style={{
          color: '#f0f0f0', textAlign: 'center', alignSelf: 'center', fontSize: 12
        }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default AdvertCard;
