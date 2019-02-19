/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIon from 'react-native-vector-icons/Ionicons';
import AdvertCard from '../components/AdvertCard';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import { categoriesNoHottest } from './helpers/values';

class InterestsDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selections : []
  }

  componentDidMount(){
    const data = new SessionStore().getValue(Constants.INTERESTS);
    let selections;
    if(data === '' || data === undefined) selections = []
    else selections  = data.split(',');

    const interests = [];
    for (i = 0; i < categoriesNoHottest.length; i++) {
      interests.push(categoriesNoHottest[i]);
    }
    this.setState({selections, interests});
  }

  handleInterestSelection = (value) => {
    const selections = this.state.selections;
    if(selections.includes(value)){
      selections.splice(selections.indexOf(value), 1);
    } else {
      selections.push(value);
    }
  }

  handleSubmit = () =>{
    if(this.state.selections.length > 2){
      const val = this.state.selections.join();
      new SessionStore().putValue(Constants.INTERESTS, val);
      Navigation.dismissModal(this.props.componentId)
    } else {
      Alert.alert('Select at least 2 interests.');
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
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
            {'My Interests  '}
          </Text>
          <IconIon name = 'md-pricetags' size = {25} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
            }}
            onPress={() => {
              Navigation.dismissModal(this.props.componentId)
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
        <FlatList
            style={{
              alignSelf : 'center',
              paddingTop: 10,
            }}
            numColumns = {2}
            keyExtractor={(item, index) => `${index}`}
            data={this.state.interests}
            extraData = {this.state.selections}
            renderItem={({ item }) => (
              <AdvertCard
                width={150}
                checked = {this.state.selections.includes(item.value)}
                height={150}
                onChecked={() => this.handleInterestSelection(item.value)}
                image={item.image}
                text={item.title}
              />
            )}
          />

<View
            style={{
              alignSelf: 'center',
              elevation: 10,
              backgroundColor: '#444',
              padding: 5,
              marginTop : 15,
              borderRadius: 30,
              marginBottom: 30
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6A15',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                flexDirection : 'row'
              }}
              onPress={this.handleSubmit}
            >
              <Text style={{color : '#fff', marginLeft : 10, marginRight :10, margin : 5, fontSize : 20, textAlignVertical : 'center', textAlign : 'center'}}>{' Update Interests '}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default InterestsDetailsScreen;
