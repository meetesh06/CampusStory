import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import SessionStore from '../SessionStore';
import PostThumbnail from './PostThumbnail';
import PostImageThumbnail from './PostImageThumbnail';
import PostVideoThumbnail from './PostVideoThumbnail';
import axios from 'axios';
import constants from '../constants';
import Urls from '../URLS';
import { Navigation } from 'react-native-navigation';
import {timelapse} from '../screens/helpers/functions'
import urls from '../URLS';

const {TOKEN} = constants;

class StoryFeed extends React.PureComponent {
    constructor(props){
      super(props);
      this.handleChannelClickStory = this.handleChannelClickStory.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handlePreview = this.handlePreview.bind(this);
    }

    state = {
      feed : [],
      hidden : false
    }

    componentWillReceiveProps(nextProp){
      if(nextProp !== this.props){
        this.fetch_data();
      }
    }

    componentDidMount(){
      this.fetch_data();
    }

    fetch_data = () =>{
      const { item } = this.props;
      axios.post(Urls.GET_STORY_URL, {channel_id : item._id}, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': new SessionStore().getValue(TOKEN)
        }
      }).then((response) => {
        if(!response.data.error){
          const data = response.data.data;
          if(data.length > 0){
            this.setState({feed : data, hidden : true});
          } else {
            this.setState({hidden : false});
          }
        } else {
          this.setState({error : true});
        }
      }).catch((e)=>{
        console.log(e)
        new SessionStore().pushLogs({type : 'error', line : 59, file : 'StoryFeed.js', err : e});
      });
    }

    handleChannelClick = (id, name) => {
      new SessionStore().pushVisits(id, 'OPEN');
      Navigation.showOverlay({
        component: {
          name: 'Channel Detail Screen',
          passProps: {
            id
          },
          options: {
            bottomTabs: {
              animate: true,
              drawBehind: true,
              visible: false
            },
            topBar: {
              title: {
                text: name
              },
              visible: true
            }
          }
        }
      });
    }

    handleChannelClickStory = (item, image) => {
      console.log('Story', item);
      this.setState({ peek: false }, () => {
        Navigation.showOverlay({
          component: {
            id: 'preview_overlay',
            passProps: {
              item,
              image,
              peek: false
            },
            name: 'Discover Preview',
            options: {
              overlay: {
                interceptTouchOutside: false,
              }
            }
          }
        }).catch(err => console.log(err));
      });
    }

    handleClose = () => {
      const {
        peek
      } = this.state;
      if (!peek) return;
      Navigation.dismissOverlay('preview_overlay1');
    }

    handlePreview = (item,image) => {
      console.log('long press');
      this.setState({ peek: true }, () => {
        Navigation.showOverlay({
          component: {
            id: 'preview_overlay1',
            passProps: {
              item,
              image,
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

    openFullStory = () =>{
      const { item } = this.props;
      const image = item.media[0];
      Navigation.showOverlay({
        component: {
          name: 'Story Screen',
          passProps: { 
            online : true,
            data : this.state.feed,
            channel_data : {_id : item._id, name : item.name, media : JSON.stringify(item.media)}
          },
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
    }

    render() {
      const { item } = this.props;
      const image = item.media[0];

      return(
          <View style={{flex : 1}}>
            {
              this.state.hidden &&
              <View style={{marginTop : 10, marginBottom : 5}}>
              <View style={{flexDirection : 'row', alignItems : 'center'}} >
                <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center'}} onPress={()=>this.handleChannelClick(item._id, item.name)}>
                  <FastImage
                    style={{
                      width: 36,
                      height: 36,
                      margin: 5,
                      marginLeft : 10,
                      borderRadius: 20
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: encodeURI( urls.PREFIX + '/' +  `${image}`) }}
                  />
                  <Text numberOfLines = {1} lineBreakMode = 'tail' style={{color : '#f0f0f0', fontSize : 14, margin : 5, maxWidth : 160}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <Text style={{color : '#d0d0d0', fontSize : 12, margin : 5}}>{' '}{timelapse(new Date(item.last_updated))}{' ago'}</Text>
                <View style={{flex : 1}}/>
                
                <TouchableOpacity activeOpacity = {0.7} onPress = {this.openFullStory} style={{borderRadius : 10, backgroundColor : '#ffffff66'}}>
                  <Text style={{color : '#ddd', fontSize :12, margin : 5, marginRight : 8}}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

            <FlatList
              showsHorizontalScrollIndicator = {false}
              horizontal
              style={{marginTop : 5}}
              keyExtractor={(item, index) => `${index}`}
              data={this.state.feed}
              renderItem={({ item }) => {
                  if (item.type === 'post') {
                    return (
                      <TouchableOpacity
                        onPress={() => this.handleChannelClickStory(item, image)}
                        onLongPress={() => this.handlePreview(item, image)}
                        onPressOut={() => this.handleClose()}
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
                        onPress={() => { this.handleChannelClickStory(item, image); }}
                        onLongPress={() => this.handlePreview(item, image)}
                        onPressOut={() => this.handleClose()}
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
                        onPress={() => { this.handleChannelClickStory(item, image); }}
                        onLongPress={() => this.handlePreview(item, image)}
                        onPressOut={() => this.handleClose()}
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
            }
          </View>
      );
    }
}

export default StoryFeed;