/* eslint-disable no-param-reassign */
import React from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import StoryFeed from '../components/StoryFeed';
import SessionStore from '../SessionStore';
import IconAnt from 'react-native-vector-icons/AntDesign';
import urls from '../URLS';

const { TOKEN } = Constants;

class DiscoverFeed extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    channels : [],
    update: false,
    error : false,
    refreshing : true,
    mssg : '',
    empty : false,
  }

  componentDidMount(){
    const { category } = this.props;
    const value = new SessionStore().getValueTemp(category);
    if(value === null || value === undefined) {
      this.fetch_data(category);
    }
    else {
      console.log('CACHE HIT');
      this.setState({channels : value, error : false, refreshing : false});
    }
  }

  refresh = () =>{
    const { category } = this.props;
    this.setState({refreshing : true, error : false});
    this.fetch_data(category);
  }

  fetch_data = (category) =>{
    const private_channels = false;
    axios.post(urls.GET_CATEGORY_CHANNEL_URL, {category, private : private_channels}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        this.setState({ channels: response.data.data, error : false, refreshing : false, update: !this.state.update });
        new SessionStore().putValueTemp(category, response.data.data);
      } else {
        console.log(response.data.mssg);
        this.setState({error : true, mssg : 'No Internet Connection', refreshing : false});
      }
    }).catch((e)=>{
      this.setState({error : true, mssg : 'No Internet Connection', refreshing : false});
      new SessionStore().pushLogs({type : 'error', line : 67, file : 'DicoverFeed.js', err : e});
    });
  }

  render(){
    return(
      <View style={{flex : 1, backgroundColor: '#333'}}>
        { this.state.error && 
          <Text style={{ 
              fontSize: 14,
              color: '#FF6A15', 
              textAlign: 'center',
              textAlignVertical : 'center', 
              margin : 5,
              marginTop : 15,
            }}>
            <IconAnt name = 'infocirlceo' size = {15} /> 
            {'  ' + this.state.mssg}
          </Text> 
        }
        <FlatList
          refreshControl = {(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
          data={this.state.channels}
          extraData = {this.state.update}
          renderItem={({ item, index }) => (
          <StoryFeed update = { this.update } item = {item} index = {index} />
          )}
        />
      </View>
    );
  }
}

export default DiscoverFeed;
