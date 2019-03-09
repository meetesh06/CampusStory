import React from 'react';
import {
  View,
  Platform,
  Text,
  Alert,
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
    image,
  } = props;

  return (
    <TouchableOpacity
      style={{
        marginTop: Platform.OS === 'ios' ? 15 : 0,
        borderRadius: 10
      }}
      onPress={() => {
        if (!selected) onPress();
      }}
    >
      <View
        style={{
          overflow: 'hidden',
          width: 150,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FastImage
          style={{
            width,
            height,
            borderRadius: 10
          }}
          source={image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text
        numberOfLines={1}
          style={{
            fontFamily: 'Roboto',
            marginTop: 5,
            marginLeft: 4,
            marginRight: 4,
            fontSize: 10,
            textAlign: 'center',
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
