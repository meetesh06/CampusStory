import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

class AdvertCard extends React.Component {
    render() {
        console.log(this.props.item);
        return(
            <View>
            <TouchableOpacity 
                onPress={() => this.props.onPress(this.props.item)}
                elevation={5} 
                style = {{ 
                    shadowColor: "#000",
                    margin: 10,
                    marginBottom : 5,
                    marginLeft : 8, 
                    marginRight : 8,
                    borderRadius: 10,
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    shadowOffset: {
                        height: 2,
                        width: 2
                    }
            }}>

            
            <View style={{padding : 1, backgroundColor : '#a5a5a5', borderRadius : 10}}>
                <FastImage
                    style={{ width : this.props.width, height : this.props.height, borderRadius: 10, backgroundColor : '#000',}}
                    source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(this.props.item.media)[0] }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            {
                this.props.item.read &&
                <LinearGradient style={{ borderRadius: 10, opacity: 0.6, flex: 1, position: 'absolute', width: this.props.width, height: this.props.height,}} colors={['#505050', '#000']}/>
            }

            {
                this.props.item.read &&
                <Icon size={20} style={{ position: 'absolute', right: '40%', top: '40%', color: this.props.item.read ? "#909090" : '#fff' }} name="playcircleo" />
            }
            </TouchableOpacity>
            
            <Text numberOfLines = {1} lineBreakMode = 'tail' style={{fontSize : 10, flex : 1, textAlign : 'center', justifyContent : 'center', maxWidth : this.props.width - 8, marginLeft : 10, marginRight : 10, marginBottom : 10}}>{this.props.item.name}</Text>
            </View>
        );
    }
}

export default AdvertCard;