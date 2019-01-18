import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
// import AnimatedImageButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'


class CategoryCard extends React.Component {
    render() {
        return(
                <TouchableOpacity onPress={ () => {
                        this.props.onPress();
                    }}>
                    <View style={{ overflow: 'hidden', width: this.props.width, height: this.props.height, margin: 10, borderRadius: 10, padding: 5 }}>
                        <FastImage
                            style={{ width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                            source={{ uri: this.props.image }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        
                    </View>
                </TouchableOpacity>
        );
    }
}

export default CategoryCard;