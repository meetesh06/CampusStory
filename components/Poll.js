import React from 'react';
import { View, Text } from 'react-native';

const Poll = (props) => {
  const {
    thumb
  } = props;
  return (
    <View
      style={{
        flex: thumb ? undefined : 1,
        height: 250,
        backgroundColor: '#fff'
      }}
    >
      <Text>This is the Poll Component</Text>
    </View>
  );
};
export default Poll;
