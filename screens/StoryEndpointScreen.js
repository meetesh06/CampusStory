import React from 'react';
import { Animated, PanResponder, Platform, View, Text, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

class StoryEndpointScreen extends React.Component {
    constructor(props) {
        super(props);
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    
            onPanResponderGrant: (evt, gestureState) => {
              // The gesture has started. Show visual feedback so the user knows
              // what is happening!
    
              // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: Animated.event([null,{
                dx : this.state.pan.x,
                dy : this.state.pan.y
            }]),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
              // The user has released all touches while this view is the
              // responder. This typically means a gesture has succeeded
            },
            onPanResponderTerminate: (evt, gestureState) => {
              // Another component has become the responder, so this gesture
              // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              // Returns whether this component should block native components from becoming the JS
              // responder. Returns true by default. Is currently only supported on android.
              return true;
            },
          });
    }

    state = {
        pan: new Animated.ValueXY()
    }

    render() {
        return(
            <View style={{ 
                    backgroundColor: '#000000dd', 
                    flex: 1,
                    paddingTop: Platform.OS === 'android'? 8 : 30, 
                    justifyContent: 'center'
                }}
            >
                {/* close button indicator */}
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: Platform.OS === 'android'? 8 : 35,
                        right: 10
                    }}
                    onPress={() => Navigation.dismissOverlay(this.props.componentId)}
                >
                    <Icon 
                        style={{
                            color: '#fff'
                        }} 
                        size={30} 
                        name="close" 
                    />
                </TouchableOpacity>
                {/* This is the main content holder */}
                <Animated.View
                    style={{
                        backgroundColor: '#fff',
                        width: '100%',
                        height: 300,
                    }}
                    {...this._panResponder.panHandlers}
                >
                    <FastImage 
                        style={{

                            flex: 1
                        }}
                        source={{ uri: "https://images.pexels.com/photos/259803/pexels-photo-259803.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                </Animated.View>
            </View>
        );
    }
}

export default StoryEndpointScreen;