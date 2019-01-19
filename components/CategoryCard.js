import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
// import AnimatedImageButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'


class CategoryCard extends React.Component {
    render() {
        return(
                <TouchableOpacity onPress={ () => {
                        if(!this.props.selected)
                            this.props.onPress();
                    }}>
                    <View style={{ overflow: 'hidden', width: this.props.width, height: this.props.height, marginLeft : 10, marginRight : 10, borderRadius: 10, justifyContent : 'center', alignItems : 'center'}}>
                        <FastImage
                            style={{ width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                            source={{ uri: this.props.image }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <Text style={{textAlign : 'center', textTransform: 'capitalize', fontFamily : 'Roboto', color : '#fff', fontSize : 12,}}>{this.props.name}</Text>
                    {this.props.selected && <View style ={{width : this.props.name.length * 5, height : 2, backgroundColor : '#fff', borderRadius : 10, justifyContent : 'center', alignSelf : 'center', margin : 2}} />}
                </TouchableOpacity>
        );
    }
}

export default CategoryCard;