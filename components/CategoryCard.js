import React from 'react';
import {
  View,
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
        marginBottom: 10
      }}
      onPress={() => {
        if (!selected) onPress();
      }}
    >
      <View
        style={{
          overflow: 'hidden',
          width,
          height,
          // marginLeft: 10,
          // marginRight: 10,
          // borderRadius: 10,
          marginTop: 15,
          marginLeft: 10,
          marginRight: 10,
          padding: 5,
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FastImage
          style={{
            width,
            height,
            borderRadius: 10,
            position: 'absolute'
          }}
          source={image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      {/* <Text
        // ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          marginLeft: 15,
          marginTop: 3,
          textAlign: 'center',
          fontFamily: 'Roboto',
          color: '#fff',
          padding: 5,
          width,
          fontSize: 12
        }}
      >
        {name.toUpperCase()}
      </Text> */}
      {selected && (
      <View
        style={{
          // width: name.length * 8,
          width: width - 50,
          marginTop: 10,
          maxWidth: width,
          height: 2,
          backgroundColor: '#fff',
          borderRadius: 10,
          justifyContent: 'center',
          alignSelf: 'center'
        }}
      />
      )}
    </TouchableOpacity>
  );
};
export default CategoryCard;
