/* eslint-disable consistent-return */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';

const GoingRegister = (props) => {
  const {
    uri,
    componentId
  } = props;
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <WebView
        source={{ uri }}
        style={{ marginTop: 20 }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          justifyContent: 'center',
          textAlign: 'right',
          width: 35,
          top: 10,
          right: 10,
          height: 35,
          padding: 5,
          backgroundColor: '#ffffff99',
          borderRadius: 30
        }}
        onPress={() => Navigation.dismissModal(componentId)}
      >
        <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={25} name="close" />
      </TouchableOpacity>
    </View>
  );
};

export default GoingRegister;
