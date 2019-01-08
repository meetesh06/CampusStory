import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
// import AnimatedImageButton from './Button';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

class AdvertCard extends React.Component {
    render() {
        return(
            <TouchableOpacity elevation={5} 
                style = {{ 
                    width: this.props.width, 
                    height: this.props.height, 
                    backgroundColor: '#5f5f5f', 
                    shadowColor: "#000",
                    margin: 10,
                    borderRadius: 10,
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    shadowOffset: {
                        height: 2,
                        width: 2
                    }
            }}>
                
            {/* <View style={{ 
                    overflow: 'hidden', 
                    width: this.props.width, 
                    height: this.props.height, 
                    backgroundColor: '#c0c0c0', 
                    margin: 10, 
                    borderRadius: 10,
                    shadowColor: "#000000",
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    shadowOffset: {
                        height: 10,
                        width: 10
                    },
                }}
            > */}
                        <TouchableOpacity 
                            activeOpacity={0.6}
                            onPress={ () => {
                                this.props.pressed(this.props.item);
                            }}
                        >
                            <View style={{ justifyContent: 'center', width: this.props.width, height: this.props.height, borderRadius: 100, position: 'absolute' }}>
                                <FastImage
                                    style={{ width: this.props.width, height: this.props.height, borderRadius: 10 }}
                                    source={{ uri: this.props.item.image }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>

                            <LinearGradient style={{ borderRadius: 10, opacity: 0.6, flex: 1, position: 'absolute', width: this.props.width, height: this.props.height }} colors={['#505050', '#000']}>
                            </LinearGradient>
                            
                            <Icon size={20} style={{ position: 'absolute', right: 5, top: 5, color: this.props.item.read ? "#909090" : '#fff' }} name="playcircleo" />
                            
                        </TouchableOpacity>
                        {/* {
                            this.state.pressed &&
                            <Icon name='radio-button-checked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                        {
                            !this.state.pressed &&
                            <Icon name='radio-button-unchecked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        } */}
            </TouchableOpacity>
        );
    }
}

export default AdvertCard;