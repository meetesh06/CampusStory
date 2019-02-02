import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const getMonthName = (num) => {
  switch (num) {
    case 1:
      return 'JAN';
    case 2:
      return 'FEB';
    case 3:
      return 'MAR';
    case 4:
      return 'APR';
    case 5:
      return 'MAY';
    case 6:
      return 'JUN';
    case 7:
      return 'JUL';
    case 8:
      return 'AUG';
    case 9:
      return 'SEP';
    case 10:
      return 'OCT';
    case 11:
      return 'NOV';
    case 12:
      return 'DEC';
    default:
      return 'FUCK';
  }
};

const EventCardBig = (props) => {
  const {
    onPress,
    width,
    item,
    height
  } = props;
  const {
    media,
    college,
    title,
    location,
    date
  } = item;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        onPress(item);
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
          width,
          height,
          borderRadius: 10,
          position: 'absolute'
        }}
        source={{ uri: `https://mycampusdock.com/${JSON.parse(media)[0]}` }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <LinearGradient
        style={{
          position: 'absolute',
          width,
          height,
          opacity: 0.6,
          flex: 1
        }}
        colors={['#000', '#00000055', '#0b0b0b']}
      />
      <Text
        style={{
          fontFamily: 'Roboto',
          fontSize: 12,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 15,
          color: '#dfdfdf'
        }}
      >
        {college}
      </Text>
      <Text
        style={{
          fontFamily: 'Roboto',
          fontSize: 22,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 40,
          color: '#efefef'
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: 'Roboto',
          fontSize: 15,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          bottom: 20,
          color: '#dfdfdf'
        }}
      >
        {location}
        {' '}
        {' • '}
        {' '}
        {getMonthName(date.getMonth() + 1) }
        {' '}
        {JSON.stringify(date.getDate())}
      </Text>
    </TouchableOpacity>
  );
};
export default EventCardBig;
