import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

const getMonthName = (num) => {
  switch (num) {
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return 'Mar';
    case 4:
      return 'Apr';
    case 5:
      return 'May';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Aug';
    case 9:
      return 'Sep';
    case 10:
      return 'Oct';
    case 11:
      return 'Nov';
    case 12:
      return 'Dec';
    default:
      return 'FUCK';
  }
};

class Spotlight extends React.PureComponent {
  render(){
    const { item, onPress } = this.props;
    const { media, title, date } = item;
    return (
      <View
        style={{
          overflow: 'hidden'
        }}
      >
        <FastImage
          style={{ height: 250, flexDirection: 'column' }}
          source={{
            uri: `https://www.mycampusdock.com/${media[0]}`,
            priority: FastImage.priority.high
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
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
              source={{ uri: `https://www.mycampusdock.com/${media[0]}` }}
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
                fontSize: 14,
                margin : 2,
                color: '#a5a5a5',
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
              { `${new Date(date).getDate()}-${getMonthName(new Date(date).getMonth() + 1)}-${1900 + new Date(date).getYear()}, ${formatAMPM(new Date(date))}` }
            </Text>
          </View>
        </View>
      </View>
    );
  }
};

export default Spotlight;
