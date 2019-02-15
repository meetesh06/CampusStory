import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
// import FastImage from 'react-native-fast-image';

const NormalNotification = (props) => {
  const {
    title,
    description,
    timestamp
  } = props;
  return (
    <View>
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
          <Icon style={{ textAlign: 'center', color: '#fff' }} size={20} name="enviroment" />
        </View>
        <Text style={{
          fontSize: 18, color: '#fff', margin: 5, fontFamily: 'Roboto', fontWeight: 'bold'
        }}
        >
          {' '}
          {title}
          {' '}
        </Text>
        <View
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
            {description}
          </Text>
          <Text style={{
            textAlign: 'right', fontFamily: 'Roboto', fontSize: 10, color: '#f0f0f0', marginRight: 10, marginBottom: 10
          }}
          >
            {' '}
            {timestamp}
            {' '}
          </Text>
        </View>
      </View>

    </View>
  );
};

export default NormalNotification;
