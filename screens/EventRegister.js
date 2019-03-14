/* eslint-disable consistent-return */
import React from 'react';
import { BackHandler, View, Platform, Text, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation } from 'react-native-navigation';
import { goHome } from './helpers/Navigation';

class GoingRegister extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () =>{
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  componentDidMount(){
    this.mounted = true;
  }
  render() {
    const {
      uri,
      componentId
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          marginTop : Platform.OS === 'ios' ? 45 : 0,
          backgroundColor: '#333'
        }}
      >
      {/* <StatusBar hidden /> */}
        <WebView
          source={{ uri }}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <Text>Loading</Text>}
        />
        <TouchableOpacity style={{position : 'absolute', top : 0, right : 0, margin : 10, backgroundColor : '#c0c0c055', padding : 5, borderRadius : 10}} onPress={()=>Navigation.dismissOverlay(this.props.componentId)}>
          <Text style={{fontSize : 15}}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Navigation.dismissOverlay(parentId);
  // const ActivityIndicatorLoadingView = () =>{
  //   return (
  //     <ActivityIndicator
  //       color="#333"
  //       size="large"
  //       style={{flex : 1, justifyContent : 'center'}}
  //     />
  //   );
  // }

  
};

export default GoingRegister;
