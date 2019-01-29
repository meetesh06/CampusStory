import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

class EventCardBig extends React.Component {
    getMonthName = (num) => {
        switch(num) {
            case 1:
                return "JAN"
            case 2:
                return "FEB"    
            case 3:
                return "MAR"
            case 4:
                return "APR"
            case 5:
                return "MAY"
            case 6:
                return "JUN"
            case 7:
                return "JUL"
            case 8:
                return "AUG"
            case 9:
                return "SEP"
            case 10:
                return "OCT"
            case 11:
                return "NOV"
            case 12:
                return "DEC"
            default: 
                return "FUCK"

        }
    }
    render() {
        console.log(this.props.item);
        return(
            <TouchableOpacity 
                activeOpacity={0.6}
                onPress={ () => {
                    this.props.onPress(this.props.item);
                }}
                elevation={5} 
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
                        <FastImage
                            style={{ width: this.props.width, height: this.props.height, borderRadius: 10, position: 'absolute' }}
                            source={{ uri: "https://mycampusdock.com/" + JSON.parse(this.props.item.media)[0] }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <LinearGradient style={{ position: 'absolute', width: this.props.width, height: this.props.height, opacity: 0.6, flex: 1 }} colors={['#000', '#00000055', '#0b0b0b']}>
                        </LinearGradient>
                        
                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 10, color: '#fff' }}>
                            {this.props.item.college}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 25, left: 10, right: 0, textAlign: 'left', position: 'absolute', top: 30, color: '#fff' }}>
                            {this.props.item.title}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 15, left: 10, right: 0, textAlign: 'left', position: 'absolute', bottom: 20, color: '#fff' }}>
                            {this.props.item.location}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 15, left: 10, right: 10, textAlign: 'left', position: 'absolute', bottom: 45, color: '#fff' }}>
                            { this.getMonthName(this.props.item.date.getMonth() + 1) } { JSON.stringify( this.props.item.date.getDate() ) }
                        </Text>

            </TouchableOpacity>
        );
    }
}

export default EventCardBig;