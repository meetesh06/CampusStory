import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Navigation } from 'react-native-navigation';
import { timelapse} from '../screens/helpers/functions';

class NormalNotification extends React.Component {
  handlePress = () => {
    const {
      _id,
      title
    } = this.props;
    Navigation.showModal({
      component: {
        name: 'Notifications All Screen',
        passProps: {
          _id,
          title
        },
        options: {
          modalPresentationStyle: 'overCurrentContext',
          bottomTabs: {
            visible: false,
            drawBehind: true,
            animate: true
          },
        }
      }
    });
  }
  render() {
    const {
      title,
      updates,
      timestamp
    } = this.props;
    return (
      <View>
        <View
          style={{
            borderRadius: 10,
            padding: 5
          }}
        >
          <TouchableOpacity
            onPress={this.handlePress}
          >
            <Text style={{
              fontSize: 18, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold'
            }}
            >
              {' '}
              {title}
              {' '}
            </Text>
          </TouchableOpacity>
          <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={updates}
            renderItem={(value) => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                  margin : 8,
                  marginBottom : 3, 
                  marginTop : 3,
                }}
                onPress = {()=>this.props.onPressNotification()}
              >
                <Text
                numberOfLines={5}
                style={{
                  flex: 1,
                  fontFamily: 'Roboto',
                  color: '#000',
                  margin: 10,
                  fontSize : 14
                }}
                >
                  {value.item.message}
                </Text>
                <Text style={{
                  textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#555', marginRight: 10, marginBottom: 10
                }}
                >
                  {timelapse(new Date(value.item.timestamp))}
                  {' ago'}
                </Text>
              </TouchableOpacity>
            )}
          />
          
        </View>

      </View>
    );
  }
}

export default NormalNotification;
