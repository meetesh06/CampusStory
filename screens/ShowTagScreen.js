/* eslint-disable global-require */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  BackHandler,
  Platform,
  RefreshControl
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import IconFeather from 'react-native-vector-icons/Feather';
import urls from '../URLS';
import SessionStore from '../SessionStore';
import Constants from '../constants';
import PostThumbnail from '../components/PostThumbnail';
import PostImageThumbnail from '../components/PostImageThumbnail';
import PostVideoThumbnail from '../components/PostVideoThumbnail';

class ShowTagScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    activites : [],
    loading : false
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  componentWillUnmount() {
    this.mounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount(){
    this.mounted = true;
    new SessionStore().pushTrack({type : 'OPEN_TAG', hashtag : this.props.hashtag});
    this.fetch_data();
  }

  fetch_data = () =>{
    const hashtag = this.props.hashtag;
    if(hashtag.length < 3 && this.mounted){
      return this.setState({error : 'Not a possible hashtag, try again'});
    }
    if(this.mounted) this.setState({loading : true, error : ''});
    axios.post(urls.GET_TAG, {hashtag}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(Constants.TOKEN)
      }
    }).then((response) => {
      if(!response.data.error){
        if(this.mounted) this.setState({activites : response.data.data, loading : false});
      } else {
        if(this.mounted) this.setState({error : 'Something went wrong', loading : false});
      }
    }).catch((e)=>{
      console.log(e);
      new SessionStore().pushLogs({type : 'error', line : 57, file : 'ShowTagScreen.js', err : e});
      if(this.mounted) this.setState({error : 'Try Again! Something gone wrong :(', loading : false});
    });
  }

  handleClose = () => {
    Navigation.dismissOverlay(this.props.componentId);
  }

  handleChannelClickStory = (item, image) => {
    if(this.mounted) this.setState({ peek: false }, () => {
      Navigation.showOverlay({
        component: {
          id: 'preview_overlay',
          passProps: {
            item,
            image,
            hide_image : true,
            peek: false
          },
          name: 'Discover Preview',
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      }).catch(err => console.log(err));
    });
  }

  handlePreview = (item, image) => {
    if(this.mounted) this.setState({ peek: true }, () => {
      Navigation.showOverlay({
        component: {
          id: 'preview_overlay1',
          passProps: {
            item,
            image,
            hide_image : true,
            peek: true
          },
          name: 'Discover Preview',
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      }).catch(err => console.log(e));
    });
  }

  handleBackButtonClick() {
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop : Platform.OS === 'ios' ? 45 : 8,
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
              fontSize: 20,
              textAlignVertical : 'center',
              fontFamily : 'Roboto-light',
              marginLeft: 5
            }}
          >
            {'HashTag '}
          </Text>
          <IconFeather name = 'hash' size = {20} color = '#ddd' />
          <TouchableOpacity
            style={{
              flex: 1,
              padding : 10,
            }}
            onPress={() => {
              Navigation.dismissOverlay(this.props.componentId)
            }}
          >
            <Icon size={22} style={{ position: 'absolute', right: 5, color: '#FF6A16', }} name="closecircle" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor : '#444'
          }}
        >
          <View style={{padding : 10, backgroundColor : '#333', flexDirection : 'row', justifyContent : 'center', alignItems : 'center', paddingBottom : 15}}>
            <View style={{ borderRadius : 100, width : 70, height : 70, justifyContent : 'center', alignItems : 'center', backgroundColor : '#fff',}}>
              <IconFeather name ='hash' size={50} color = '#000' style={{alignSelf : 'center',}}/>
            </View>

            <View style={{ flex: 2 }}>
              <Text style={{color : '#fff', fontSize : 20, margin : 10, marginLeft : 15, marginBottom : 5, marginTop : 15}}>{'#'}{this.props.hashtag}</Text>
              <Text style={{color : '#bbb', fontSize : 14, margin : 10, marginLeft : 15, marginTop : 0,}}>{this.state.activites.length}{' Posts'}</Text>
            </View>
          </View>
            <FlatList
              refreshControl = {(
                <RefreshControl 
                  onRefresh = {this.fetch_data}
                  refreshing = {this.state.loading}
                />
              )}
              numColumns = {3}
              keyExtractor={(item, index) => `${index}`}
              data={this.state.activites}
              renderItem={({ item }) => {
                  if (item.type === 'post') {
                    return (
                      <TouchableOpacity
                        onPress={() => this.handleChannelClickStory(item, 'xxx')}
                        activeOpacity={0.9}
                      >
                        <PostThumbnail data={item}/>
                      </TouchableOpacity>
                    );
                  }
                  if (item.type === 'post-image') {
                    return (
                      <TouchableOpacity
                        style={{
                          overflow: 'hidden'
                        }}
                        onPress={() => {this.handleChannelClickStory(item, 'xxx')}}
                        activeOpacity={0.9}
                      >
                        <PostImageThumbnail image={item.media[0]} />
                      </TouchableOpacity>
                    );
                  }

                  if (item.type === 'post-video') {
                    return (
                      <TouchableOpacity
                        style={{
                          overflow: 'hidden'
                        }}
                        onPress={() => {this.handleChannelClickStory(item, 'xxx')}}
                        activeOpacity={0.9}
                      >
                        <PostVideoThumbnail video={item.media} />
                      </TouchableOpacity>
                    );
                  }
                  return null;
              }}
            />
        </View>
      </View>
    );
  }
}

export default ShowTagScreen;
