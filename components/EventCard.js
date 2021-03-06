import React from 'react';
import {
  TouchableOpacity, Text
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {getMonthName, formatAMPM} from '../screens/helpers/functions'
import urls from '../URLS';

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
        marginBottom : 10,
        backgroundColor: '#5f5f5f',
        shadowColor: '#000',
        marginLeft: 10,
        marginRight: 10,
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
        source={{ uri: encodeURI( urls.PREFIX + '/' +  `${JSON.parse(item.media)[0]}`) }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {/* <LinearGradient
        style={{
          position: 'absolute', width, height, flex: 1
        }}
        colors={['#000000aa', '#000000ee']}
      /> */}

      <LinearGradient
        style={{
          position: 'absolute',
          width,
          height,
          opacity: 1,
          flex: 1
        }}
        colors={['#000000bb', '#000000dd']}
      />

      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light',
          fontSize: 12,
          left: 10,
          right: 0,
          textAlign: 'left',
          position: 'absolute',
          top: 10,
          color: '#fff',
        }}
      >
        { item.channel_name }
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto', fontSize: 16, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 30, color: '#fff'
        }}
      >
        { item.title }
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Roboto-Light', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 50, color: '#fff'
        }}
      >
        { `${new Date(item.date).getDate()}-${getMonthName(new Date(item.date).getMonth() + 1)}, ${formatAMPM(new Date(item.date))}` }
      </Text>
    </TouchableOpacity>
  );
};

export default EventCard;
