import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import urls from '../URLS';

const AdvertCard = (props) => {
  const { width, height, item } = props;
  return (
    <View>
      <TouchableOpacity
        onPress={() => props.onPress(item)}
        elevation={5}
        style={{
          shadowColor: '#000',
          margin: 10,
          marginBottom: 5,
          marginLeft: 8,
          marginRight: 8,
          borderRadius: 10,
          shadowOpacity: 0.3,
          shadowRadius: 3,
          shadowOffset: {
            height: 2,
            width: 2
          }
        }}
      >


        <View style={{ backgroundColor: '#a5a5a5', borderRadius: 10 }}>
          {
            item.media !== '' && (
            <FastImage
              style={{
                width,
                height,
                borderRadius: 10,
                backgroundColor: '#000'
              }}
              source={{
                uri: encodeURI( urls.PREFIX + '/' +  `${JSON.parse(item.media)[0]}`),
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            )}
        </View>
        {
                item.updates
                && (
                <LinearGradient
                  style={{
                    borderRadius: 10, opacity: 0.6, flex: 1, position: 'absolute', width, height,
                  }}
                  colors={['#505050', '#000']}
                />
                )
            }

        {
                item.updates
                && (
                <Icon
                  size={20}
                  style={{
                    position: 'absolute', right: '40%', top: '40%', color: item.read ? '#909090' : '#fff'
                  }}
                  name="playcircleo"
                />
                )
            }
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        lineBreakMode="tail"
        style={{
          color: '#f0f0f0',
          fontSize: 10,
          flex: 1,
          textAlign: 'center',
          justifyContent: 'center',
          maxWidth: width - 8,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10
        }}
      >
        {item.name}

      </Text>
    </View>
  );
};

export default AdvertCard;
