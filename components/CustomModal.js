import React from 'react';
import { TouchableOpacity, Button, View, Text, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/'
import FastImage from 'react-native-fast-image';
import urls from '../URLS';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
class CustomModal extends React.Component {
    state = {
				colleges: this.props.data,
				college: ''
    }
    render() {
        return(
            <View style={{ bottom: this.props.visible ? 0 : -HEIGHT, width: WIDTH, height: HEIGHT, flex: 1, backgroundColor: '#333', position: 'absolute', justifyContent: 'center' }}>
				<View style={{ marginTop: 180 }}>
					<FlatList 
						horizontal={false}
						style={{ height: HEIGHT }}
						keyExtractor={(item, index) => index+""}
						data={this.props.data} 
						renderItem={({item}) => 
						<TouchableOpacity
							onPress={() => this.props.newSelection(item)}
							style={{
								backgroundColor: '#e0e0e0', 
								borderRadius: 10, 
								overflow: 'hidden', 
								paddingTop: 5,
								paddingBottom: 5,
								paddingLeft: 5,
								paddingRight: 5,
								margin: 5,
								flexDirection: 'row'
							}}
						>
							<FastImage
								style={{  width: 100, height: 80, borderRadius: 15 }}
								source={{ uri: encodeURI(urls.PREFIX + '/' + item.media) }}
								resizeMode={ FastImage.resizeMode.contain }
							/>
							<View style={{ flex: 1, marginLeft: 10, marginTop: 5}}>
								<Text
									style={{ fontFamily: 'Roboto' }}
								>
									{item.name}
								</Text>
								<Text
									style={{ fontFamily: 'Roboto-Light', marginTop: 5, fontSize: 15 }}
								>
									{item.location}
								</Text>
	
							</View>
						</TouchableOpacity>
						}
					/>

				</View>			
            </View>
        );

    }
}

export default CustomModal;