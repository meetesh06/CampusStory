import React from 'react';
import {
  View, Platform, TouchableNativeFeedback, TouchableOpacity, Text
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
// let BaseComponent;
// if (Platform.OS === 'android') {
//   BaseComponent = TouchableOpacity;
// } else {
//   BaseComponent = TouchableOpacity;
// }

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
    channel_name,
    title,
    location,
    views,
    interested,
    date
  } = item;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onPress(item);
      }}
      elevation={5}
      style={{
        overflow: 'hidden',
        width,
        height,
        backgroundColor: '#111',
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
          opacity: 1,
          flex: 1
        }}
        colors={['#11111166', '#000000cc']}
      />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light',
          fontSize: 12,
          left: 15,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 15,
          color: '#dfdfdf'
        }}
      >
        {channel_name}
      </Text>
      <Text
        numberOfLines={1}
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
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light',
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
      <View
        style={{
          padding: 5,
          borderRadius: 10,
          position: 'absolute',
          right: 15,
          flexDirection: 'row',
          justifyContent: 'center',
          top: 10
        }}
      >
        <Icon size={15} name="eye" style={{ color: '#fff', alignSelf: 'center' }} />
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Roboto-Light',
            fontSize: 18,
            marginLeft: 5,
            textAlign: 'left',
            color: '#dfdfdf',
          }}
        >
          {views}
        </Text>
      </View>
      <Icon
        size={20}
        name={interested === 'true' ? 'heart' : 'hearto'}
        style={{
          color: interested === 'true' ? '#fa3e3e' : '#fff',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 15,
          right: 20
        }}
      />
    </TouchableOpacity>
  );
};
export default EventCardBig;
