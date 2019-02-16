import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Realm from '../realm';
import { processRealmObj } from '../screens/helpers/functions';
// import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';

class EventNotification extends React.Component {
  state = {
    item: null,
    all: false
  }

  componentDidMount() {
    const {
      _id
    } = this.props;
    Realm.getRealm((realm) => {
      const itemRaw = realm.objects('Events').filtered(`_id="${_id}"`);
      processRealmObj(itemRaw, (item) => {
        console.log(item[0]);
        this.setState({ item: item[0] });
      });
    });
  }

  handleEventPress = () => {
    const {
      _id
    } = this.props;
    Navigation.showModal({
      component: {
        name: 'Notifications All Screen',
        passProps: {
          _id,
          title: this.state.item.title
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
      item,
      all
    } = this.state;
    const {
      updates
    } = this.props;
    // console.log(updates);
    return (
      <View>
        {
          item !== null && (
            <View
              style={{
                // backgroundColor: '#555',
                // margin: 10,
                borderRadius: 10,
                padding: 5
              }}
            >
              <TouchableOpacity
                onPress={this.handleEventPress}
              >
                <Text style={{
                  fontSize: 18, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold'
                }}
                >
                  {' '}
                  {item !== undefined && item.title && item.title !== undefined && item.title}
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
              {
                // updates.slice(0, all ? updates.length : 2).map((value, index) => (
                  
                // ))
              }
            </View>
          )
        }
      </View>
    );
  }
}

export default EventNotification;
