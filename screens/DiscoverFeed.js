/* eslint-disable no-param-reassign */
import React from 'react';
import {
  RefreshControl,
  ScrollView, View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import StoryFeed from '../components/StoryFeed';
import SessionStore from '../SessionStore';
import RealmManager from '../RealmManager';

const { TOKEN } = Constants;

class DiscoverFeed extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    channels : []
  }

  componentDidMount(){
    const { category } = this.props;
    axios.post('https://www.mycampusdock.com/channels/get-category-channels', {category}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        this.setState({channels : response.data.data});
      } else {
        this.setState({error : true, mssg : response.data.mssg});
      }
    }).catch((e)=>console.log(e));
  }

  render(){
    return(
      <View style={{flex : 1}}>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={this.state.channels}
          renderItem={({ item }) => (
          <StoryFeed item = {item} />
          )}
        />
      </View>
    );
  }
}

export default DiscoverFeed;
