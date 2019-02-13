import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

class AdvertCardText extends React.Component {

    render() {
        console.log(this.props);
        return(
                <TouchableOpacity onPress={ () => this.props.clicked(this.props.id) }>
                    <View style={{ overflow: 'hidden', flex: 1 , height: this.props.height, backgroundColor: '#505050', margin: 10, borderRadius: 10 }}>
                        <FastImage
                            style={{ opacity: this.props.pressed ? 0.6 : 1, width: "100%", height: this.props.height, position: 'absolute' }}
                            source={{ uri: this.props.image }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <LinearGradient style={{ opacity: 0.8, flex: 1 }} colors={['#505050', '#000']}>
                        </LinearGradient>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 15, left: 0, right: 0, textAlign: 'center', position: 'absolute', bottom: 40, color: '#fff' }}>
                            {this.props.title}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 15, left: 0, right: 0, textAlign: 'center', position: 'absolute', bottom: 20, color: '#fff' }}>
                            {this.props.sub}
                        </Text>
                        

                        {
                            this.props.pressed === this.props.id &&
                            <Icon name='radio-button-checked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                        {
                            !(this.props.pressed === this.props.id) &&
                            <Icon name='radio-button-unchecked' style={{ fontSize: 20, color: 'white', position: 'absolute', bottom: 5, right: 5 }}/>
                        }
                    </View>
                </TouchableOpacity>
        );
    }
}

export default AdvertCardText;