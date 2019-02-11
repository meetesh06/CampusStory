import React from 'react';
import {
  View,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';

const CategoryCard = (props) => {
  const {
    selected,
    onPress,
    width,
    height,
    name,
    image
  } = props;
  return (
    <TouchableOpacity
      style={{
        marginTop: Platform.OS === 'ios' ? 15 : 0,
      }}
      onPress={() => {
        if (!selected) onPress();
      }}
    >
      <View
        style={{
          overflow: 'hidden',
          width: 150,
          // height: height+40,
          // marginLeft: 10,
          // marginRight: 10,
          // borderRadius: 10,
          // marginTop: 15,
          // marginLeft: 10,
          // marginRight: 10,
          // padding: 5,
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FastImage
          style={{
            width,
            height,
            // position: 'absolute'
          }}
          source={image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text
        numberOfLines={1}
          style={{
            // position: 'absolute',
            fontFamily: 'Roboto',
            marginTop: 5,
            marginLeft: 4,
            marginRight: 4,
            fontSize: 10,
            textAlign: 'center',
            // width,
            // bottom: 0,
            color: '#c0c0c0'
          }}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default CategoryCard;
