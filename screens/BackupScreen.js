/* eslint-disable global-require */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';

import IconMaterial from 'react-native-vector-icons/MaterialIcons';

class BackupScreen extends React.Component {
  constructor(props){
    super(props);
  }

  state ={
    notifications: []
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#333'
        }}
      > 
      <View
          style={{
            justifyContent: 'center',
            alignItems : 'center',
            height: 50,
            marginTop: 10,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              alignSelf : 'center',
              color: '#fff',
              fontSize: 18,
              textAlign : 'center',
            }}
          >
            {'Backup Details'}
            </Text>

            <View style={{
            backgroundColor: '#c5c5c5', 
            borderRadius: 10, 
            height: 2, 
            width: 150, 
            marginTop: 5, 
            alignSelf: 'center',
          }}
          />
      </View>
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <View style={{justifyContent : 'center', alignItems : 'center', backgroundColor : '#555', padding : 15, borderRadius : 10}}>
          <Text style={{fontSize : 16, color : '#fff', margin : 3}}>Active backup found for this device.</Text>
          <Text style={{fontSize : 12, color : '#fff', margin : 3}}>Would you like to restore your backup?</Text>
          <View style={{flexDirection : 'row', margin : 5}}>
          <TouchableOpacity style={{borderRadius : 10, backgroundColor : '#777', margin : 5, padding : 5}} onPress={()=>this.props.reset()}>
            <View style={{flexDirection : 'row', padding: 5}}>
              <IconMaterial name='delete-forever' size={18} style={{color : "#fff", margin : 3}}/>
              <Text style={{color : '#fff', fontSize : 15, textAlign : 'center', marginLeft : 6, margin : 3}}>Remove</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{borderRadius : 10, backgroundColor : '#FF6A15', margin : 5, padding : 5,}} onPress={()=>this.props.proceed()}>
            <View style={{flexDirection : 'row', padding : 5, alignItems : 'center', justifyContent : 'center'}}>
              <IconMaterial name='backup' size={18} style={{color : "#fff",}}/>
              <Text style={{color : '#fff', fontSize : 15, textAlign : 'center', marginLeft : 6, margin : 3}}>Restore</Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      </SafeAreaView>
    );
  }
}

export default BackupScreen;
