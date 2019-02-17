/* eslint-disable no-param-reassign */
import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import StoryFeed from '../components/StoryFeed';
import SessionStore from '../SessionStore';
import urls from '../URLS';

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
    const private_channels = false;
    axios.post(urls.GET_CATEGORY_CHANNEL_URL, {category, private : private_channels}, {
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
      <View style={{flex : 1, backgroundColor: '#333'}}>
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
