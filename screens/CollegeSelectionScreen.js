/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Platform
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import urls from '../URLS';

class CollegeSelectionScreen extends React.Component {
  
  select = (item) =>{
    this.props.onSelection(item)
    Navigation.dismissOverlay(this.props.componentId);
  }
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop : Platform.OS === 'ios' ? 45 : 8,
          backgroundColor: '#222'
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            marginTop: 10,
            padding : 10,
            flexDirection: 'row'
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: '#ddd',
              fontSize: 22,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'Select Your College'}
          </Text>
          <View style={{flex : 1}} />
          <TouchableOpacity
            style={{
              padding : 10,
              paddingLeft : 30
            }}
            onPress={() => {
              Navigation.dismissOverlay(this.props.componentId)
            }}
          >
            <Icon size={22} style={{ position: 'absolute', right: 5, color: '#FF6A16', }} name="closecircle" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            flex: 1,
            backgroundColor : '#333'
          }}
        >
				<View>
					<FlatList 
						horizontal={false}
						style={{flex : 1}}
						keyExtractor={(item, index) => index+""}
						data={this.props.data} 
						renderItem={({item}) => 
						<TouchableOpacity
							onPress={() => this.select(item)}
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
        </ScrollView>
      </View>
    );
  }
}

export default CollegeSelectionScreen;
