import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Realm from '../realm';
import { processRealmObj } from '../screens/helpers/functions';

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
        this.setState({ item: item[0] });
      });
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
    return (
      <View>
        {
          item !== null && (
            <View
              style={{
                backgroundColor: '#222',
                margin: 10,
                borderRadius: 10,
                padding: 5
              }}
            >
              <View
                style={{
                  backgroundColor: '#FF6A15',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 10,
                  top: -5
                }}
              >
                <Icon style={{ textAlign: 'center', color: '#fff' }} size={20} name="event-note" />
              </View>
              <Text style={{
                fontSize: 18, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold'
              }}
              >
                {' '}
                {item.title}
                {' '}
              </Text>
              {
                updates.slice(0, all ? updates.length : 2).map((value, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#444',
                      margin: 5,
                      borderRadius: 10
                    }}
                  >
                    <Text style={{
                      paddingTop: 10, paddingBottom: 10, fontFamily: 'Roboto', fontSize: 15, color: '#FF6A15', margin: 10
                    }}
                    >
                      {value.title}
                    </Text>
                    <Text style={{
                      textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#f0f0f0', marginRight: 10, marginBottom: 10
                    }}
                    >
                      {' '}
                      {value.timestamp}
                      {' '}
                    </Text>
                  </View>
                ))
              }
              <TouchableOpacity
                onPress={() => this.setState({ all: !all })}
              >
                <Text
                  style={{
                    marginTop: 3,
                    textAlign: 'center',
                    color: '#fff'
                  }}
                >
                  {
                    all ? 'Show Less' : 'Show More'
                  }
                </Text>

              </TouchableOpacity>
            </View>
          )
        }
      </View>
    );
  }
}

export default EventNotification;
