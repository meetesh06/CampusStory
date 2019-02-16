import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
// import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';

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
            // backgroundColor: '#555',
            // margin: 10,
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
            // horizontal
            keyExtractor={(item, index) => `${index}`}
            data={updates}
            renderItem={(value) => (
              <TouchableOpacity
                style={{
                  backgroundColor: '#f0f0f0',
                  margin: 5,
                  // width: 200,
                  // height: 50,
                  borderRadius: 5
                }}
              >
                <Text
                numberOfLines={3}
                style={{
                  flex: 1,
                  fontFamily: 'Roboto',
                  color: '#000',
                  margin: 10
                }}
                >
                  {value.item.message}
                  {/* TEST */}
                </Text>
                <Text style={{
                  textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#333', marginRight: 10, marginBottom: 10
                }}
                >
                  {' '}
                  {JSON.stringify(value.item.timestamp)}
                  {' '}
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
