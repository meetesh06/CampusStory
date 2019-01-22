import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';


class ChannelCard extends React.Component {
    render() {
        return(
            <TouchableOpacity
                onPress={() => this.props.onPress(this.props.item._id, this.props.item.name)}
                activeOpacity={0.8}
                elevation={5} 
                style = {{ 
                    overflow: 'hidden',
                    width: this.props.width, 
                    height: this.props.height, 
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
                        <FastImage
                            style={{ width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute', backgroundColor : '#000' }}
                            source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(this.props.item.media)[0] }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <LinearGradient style={{ position: 'absolute', width: this.props.width, height: this.props.height, opacity: 0.7, flex: 1 }} colors={['#rgb(20, 20, 20)', '#rgb(40, 40, 40)' ]}>
                        </LinearGradient>
                        
                        <Text style={{ fontFamily: 'Roboto-Light', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 10, color: '#fff' }}>
                            {this.props.item.college}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 16, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 30, color: '#fff' }}>
                            {this.props.item.name}
                        </Text>
                        {/* <Icon name='playcircleo' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/> */}
                        
            </TouchableOpacity>
        );
    }
}

export default ChannelCard;