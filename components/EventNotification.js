import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Realm from '../realm';
import { processRealmObj } from '../screens/helpers/functions';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import { timelapse} from '../screens/helpers/functions';

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
      item
    } = this.state;
    const {
      updates,
      touchable
    } = this.props;
    return (
      <View>
        {
          item !== null && (
            <View
              style={{
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
                keyExtractor={(item, index) => `${index}`}
                data={updates}
                renderItem={(value) => (
                  <TouchableOpacity
                    activeOpacity = {touchable ? 0.5 : 0.9}
                    style={{
                      backgroundColor: '#f0f0f0',
                      margin: 5,
                      borderRadius: 5
                    }}
                    onPress = {this.props.onPressNotification}
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
                    </Text>
                    <Text style={{
                      textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#333', marginRight: 10, marginBottom: 10
                    }}
                    >
                      {' '}
                      {timelapse(new Date(value.item.timestamp))}
                      {' ago'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )
        }
      </View>
    );
  }
}

export default EventNotification;
