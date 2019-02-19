import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const ChannelCard = (props) => {
  const {
    width,
    height,
    onPress,
    item
  } = props;
  const {
    _id,
    name,
    media,
    college
  } = item;
  console.log(item);
  return (
    <TouchableOpacity
      onPress={() => onPress(_id, name)}
      activeOpacity={0.8}
      elevation={5}
      style={{
        overflow: 'hidden',
        width,
        height,
        shadowColor: '#000',
        margin: 5,
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
          height: 2,
          width: 2
        }
      }}
    >
      <FastImage
        style={{
          width,
          height,
          borderRadius: 10,
          position: 'absolute',
          backgroundColor: '#000'
        }}
        source={{ uri: `https://www.mycampusdock.com/${JSON.parse(media)[0]}` }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <LinearGradient
        style={{
          position: 'absolute',
          width,
          height,
          opacity: 0.7,
          flex: 1
        }}
        colors={['#rgb(20, 20, 20)', '#rgb(40, 40, 40)']}
      />
      <Text
        style={{
          fontFamily: 'Roboto-Light',
          fontSize: 12,
          left: 10,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 10,
          color: '#fff'
        }}
      >
        {college}
      </Text>
      <Text
        style={{
          fontFamily: 'Roboto',
          fontSize: 16,
          left: 10,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 30,
          color: '#fff'
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default ChannelCard;
