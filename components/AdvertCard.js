import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
// import AnimatedImageButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'


class AdvertCard extends React.Component {
    state = {
        pressed: false
    }
    render() {
        return(
                <TouchableOpacity onPress={ () => this.setState({ pressed: !this.state.pressed }) }>
                    <View style={{ overflow: 'hidden', width: this.props.width, height: this.props.height, backgroundColor: '#c0c0c0', margin: 10, borderRadius: 10, padding: 5 }}>
                        <FastImage
                            style={{ opacity: this.state.pressed ? 0.6 : 1, width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                            source={{ uri: this.props.image }}
                            resizeMode={FastImage.resizeMode.cover}
                            // resizeMode='cover'
                        />
                        {
                            this.state.pressed &&
                            <Icon name='radio-button-checked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                        {
                            !this.state.pressed &&
                            <Icon name='radio-button-unchecked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                    </View>
                </TouchableOpacity>
        );
    }
}

export default AdvertCard;