import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {getMonthName, formatAMPM} from '../screens/helpers/functions'
import urls from '../URLS';


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
          style={{ height: 270, flexDirection: 'column' }}
          source={{
            uri: encodeURI(urls.PREFIX + '/' +  `${media[0]}`),
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        <LinearGradient
          style={{
            position: 'absolute',
            width: '100%',
            height: 270,
            flex: 1
          }}
          colors={['#000000bb', '#000000dd']}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 270
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
              source={{ uri: encodeURI( urls.PREFIX + '/' +  `${media[0]}`) }}
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
                fontSize: 13,
                margin : 2,
                color: '#bbb',
              }}
            >
              {item.channel_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Light',
                fontSize: 13,
                paddingBottom : 15,
                color: '#fff',
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
