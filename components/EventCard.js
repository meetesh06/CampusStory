import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
// import AnimatedImageButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

class EventCard extends React.Component {
    render() {
        return(
            <View elevation={5} 
                style = {{ 
                    overflow: 'hidden',
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
                            <FastImage
                                style={{ width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                                source={{ uri: this.props.item.image }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        <LinearGradient style={{ position: 'absolute', width: this.props.width, height: this.props.height, opacity: 0.6, flex: 1 }} colors={['#000', '#0b0b0b', '#00000000']}>
                        </LinearGradient>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 10, color: '#fff' }}>
                            {this.props.item.creator}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 16, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 30, color: '#fff' }}>
                            {this.props.item.title}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 50, color: '#fff' }}>
                            {this.props.item.location}
                        </Text>
                        {/* {
                            this.state.pressed &&
                            <Icon name='radio-button-checked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                        {
                            !this.state.pressed &&
                            <Icon name='radio-button-unchecked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        } */}
            </View>
        );
    }
}

export default EventCard;