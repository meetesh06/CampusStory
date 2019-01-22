import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

class AdvertCard extends React.Component {
    state = {
        pressed: false
    }
    render() {
        return(
                <TouchableOpacity onPress={ () => {
                        this.props.onChecked();
                        this.setState({ pressed: !this.state.pressed }) 
                    }}>
                    <View style={{ overflow: 'hidden', width: this.props.width, height: this.props.height, backgroundColor: this.state.pressed ? '#c0c0c0' : '#fff', margin: 10, borderRadius: 10, padding: 5 }}>
                        <FastImage
                            style={{ opacity: this.state.pressed ? 0.6 : 1, width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                            source={{ uri: this.props.image }}
                            resizeMode={FastImage.resizeMode.contain}
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
                    <Text style={{position : 'absolute', color : '#fff', fontSize : 18 -  (0.4 * this.props.text.length), bottom : 25 + (0.5 * this.props.text.length), textAlign : 'center', alignSelf : 'center', textTransform : 'uppercase'}} >{this.props.text}</Text>
                </TouchableOpacity>
        );
    }
}

export default AdvertCard;