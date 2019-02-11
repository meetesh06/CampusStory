import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

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

const Spotlight = (props) => {
  const { item, onPress } = props;
  const { media, title, date } = item;
  return (
    <View
      style={{
        // borderRadius: 10,
        // margin: 10,
        overflow: 'hidden'
      }}
    >
      <FastImage
        style={{ height: 250, flexDirection: 'column' }}
        source={{
          uri: `https://www.mycampusdock.com/${JSON.parse(media)[0]}`,
          priority: FastImage.priority.high
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {/* <LinearGradient
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 250
        }}
        colors={['#rgba(0, 0, 0, 0.5)', '#rgba(0,0,0,0.7)']}
      /> */}
      <LinearGradient
        style={{
          position: 'absolute',
          width: '100%',
          height: 250,
          flex: 1
        }}
        colors={['#00000066', '#000000dd']}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 250
        }}
      >
        <View
          style={{
            height: 45
          }}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            alignSelf: 'center'
          }}
          onPress={() => onPress(item)}
        >
          <FastImage
            style={{
              width: 150,
              height: 100,
              borderRadius: 10,
              margin: 10
            }}
            source={{ uri: `https://www.mycampusdock.com/${JSON.parse(media)[0]}` }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingTop: 5 }}>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'center',
              fontFamily: 'Roboto-Light',
              fontSize: 20,
              marginLeft: 5,
              marginRight: 5,
              color: '#fff'
            }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'center',
              fontSize: 15,
              color: '#fff',
              fontWeight: '200'
            }}
          >
            {item.channel_name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'center',
              fontFamily: 'Roboto',
              fontSize: 15,
              color: '#fff',
              marginTop: 5,
              fontWeight: '300'
            }}
          >
            { `${date.getDate()}-${getMonthName(item.date.getMonth() + 1)}-${1900 + item.date.getYear()}, ${formatAMPM(item.date)}` }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Spotlight;
