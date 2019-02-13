import React from 'react';
import {
  View,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';
import { Navigation } from 'react-native-navigation';

class CameraScreen extends React.Component {
  state = {

  }

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Campus Story',
          message: 'Campus Story needs permission to save images from camera.'
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Navigation.dismissModal(this.props.componentId);
      }
    } catch (err) {
      console.log(err);
    }
    const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
    if (!isCameraAuthorized || isCameraAuthorized === -1) {
      const isUserAuthorizedCamera = await CameraKitCamera.requestDeviceCameraAuthorization();
      if (!isUserAuthorizedCamera) return Navigation.dismissModal(this.props.componentId);
    }
  }

  onBottomButtonPressed = (event) => {
    const captureImages = JSON.stringify(event.captureImages);
    switch (event.type) {
      case 'left': {
        return Navigation.dismissModal(this.props.componentId);
      }
    }
    Alert.alert(
      `${event.type} button pressed`,
      `${captureImages}`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      >
        <CameraKitCameraScreen
          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
          flashImages={{
            on: require('../media/flashOn.png'),
            off: require('../media/flashOff.png'),
            auto: require('../media/flashAuto.png')
          }}
          cameraFlipImage={require('../media/cameraFlipIcon.png')}
          captureButtonImage={
            require('../media/cameraButton.png')
          }
        />
      </View>
    );
  }
}

export default CameraScreen;
