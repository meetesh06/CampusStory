import React from 'react';
import {
  TouchableOpacity, Text
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const EventCard = (props) => {
  const { item, width, height } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        props.onPress(item);
      }}
      elevation={5}
      style={{
        overflow: 'hidden',
        width,
        height,
        backgroundColor: '#5f5f5f',
        shadowColor: '#000',
        margin: 10,
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
          width, height, borderRadius: 10, position: 'absolute'
        }}
        source={{ uri: `https://mycampusdock.com/${JSON.parse(item.media)[0]}` }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <LinearGradient
        style={{
          position: 'absolute', width, height, opacity: 0.6, flex: 1
        }}
        colors={['#000', '#0b0b0b', '#00000000']}
      />

      <Text style={{
        fontFamily: 'Roboto', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 10, color: '#fff'
      }}
      >
        { item.college }
      </Text>
      <Text style={{
        fontFamily: 'Roboto', fontSize: 16, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 30, color: '#fff'
      }}
      >
        { item.title }
      </Text>
      <Text style={{
        fontFamily: 'Roboto', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 50, color: '#fff'
      }}
      >
        { item.location }
      </Text>
    </TouchableOpacity>
  );
};

export default EventCard;
