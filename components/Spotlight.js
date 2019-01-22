import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

class Spotlight extends React.Component {
    state = {
        pressed: false
    }

    formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

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
        const item = this.props.item;
        return(
                <View>

                    <FastImage
                        style={{ height: 250, flexDirection: 'column' }}
                        source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(item.media)[0] }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <LinearGradient style={{flex: 1, position: 'absolute', top : 0, width : '100%', height : 250}} colors={['#rgba(0, 0, 0, 0.3)', '#rgba(0,0,0,0.9)']}/>
                    <View style={{position : 'absolute', width : '100%', height : 250}}>
                    <Text style={{ marginTop: 10, fontFamily: 'Roboto', color: 'white', fontSize: 22, textAlign : 'center', fontWeight : '300'}}>
                            In the Spotlight
                        </Text>
                        <TouchableOpacity activeOpacity={0.6} style={{alignSelf : 'center'}} onPress={()=>this.props.onPress(item)}>
                            <FastImage
                                style={{ width: 150, height: 100, borderRadius: 10, margin: 10 }}
                                source={{ uri: "https://www.mycampusdock.com/" + JSON.parse(item.media)[0] }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1, paddingTop: 5}}>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 20, color: '#fff' }}>
                                {item.title}
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 15, color: '#fff', fontWeight : '200' }}>
                                {item.channel_name}
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 15, color: '#fff', marginTop : 5, fontWeight : '300' }}>
                                {item.date.getDate() + '-' + this.getMonthName(item.date.getMonth() + 1) + '-' + (1900 + item.date.getYear() )  + ', ' + this.formatAMPM(item.date)}
                            </Text>
                        </View>
                    </View>
                </View>
        );
    }
}

export default Spotlight;