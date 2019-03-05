/* eslint-disable consistent-return */
import React from 'react';
import { View, Platform, Text, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation } from 'react-native-navigation';

const GoingRegister = (props) => {
  const {
    uri,
    componentId
  } = props;


  const ActivityIndicatorLoadingView = () =>{
    return (
      <ActivityIndicator
        color="#333"
        size="large"
        style={{flex : 1, justifyContent : 'center'}}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop : Platform.OS === 'ios' ? 45 : 8
      }}
    >
    <StatusBar hidden />
    <View style={{flexDirection : 'row', height : 1, backgroundColor : '#efefef'}}/>
      <View style={{flex : 1}}>
      <WebView
        source={{ uri }}
        style={{marginTop : 15}}
        domStorageEnabled={true}
        javaScriptEnabled={true}
      />
      <TouchableOpacity style={{position : 'absolute', top : 0, right : 0, margin : 10, marginTop :0, backgroundColor : '#ffffff55', padding : 5, borderRadius : 10}} onPress={()=>Navigation.dismissModal(componentId)}>
        <Text style={{fontSize : 15}}>Close</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoingRegister;
