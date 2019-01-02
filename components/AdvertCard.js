import React from 'react';
import { View, TouchableOpacity } from 'react-native';
// import AnimatedImageButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import FastImage from 'react-native-fast-image'

class AdvertCard extends React.Component {
    state = {
        pressed: false
    }
    render() {
        return(
                <TouchableOpacity onPress={ () => this.setState({ pressed: !this.state.pressed }) }>
                    <View style={{ overflow: 'hidden', width: 200, height: 150, backgroundColor: '#c0c0c0', margin: 10, borderRadius: 10, padding: 5 }}>
                        {/* <FastImage
                            style={{ opacity: this.state.pressed ? 0.6 : 1, width: 200, height: 150, borderRadius: 10, position: 'absolute' }}
                            source={{
                                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRExW4zgSVFW7BQm8z2CEXLLLNA2sG5ZsfPqw9GixiSEKBnZN9DWA',
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        /> */}
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