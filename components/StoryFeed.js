import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import SessionStore from '../SessionStore';
import PostThumbnail from './PostThumbnail';
import PostImageThumbnail from './PostImageThumbnail';
import PostVideoThumbnail from './PostVideoThumbnail';
import axios from 'axios';
import constants from '../constants';
import { Navigation } from 'react-native-navigation';

const {TOKEN} = constants;

class StoryFeed extends React.PureComponent {
    constructor(props){
      super(props);
      this.handleChannelClickStory = this.handleChannelClickStory.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handlePreview = this.handlePreview.bind(this);
    }

    state = {
      feed : []
    }

    componentDidMount(){
      const { item } = this.props;
      axios.post('https://www.mycampusdock.com/channels/get-story', {channel_id : item._id}, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': new SessionStore().getValue(TOKEN)
        }
      }).then((response) => {
        console.log(response);
        if(!response.data.error){
          this.setState({feed : response.data.data});
        } else {
          this.setState({error : true});
        }
      }).catch((e)=>console.log(e));
    }

    handleChannelClick = (id, name) => {
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

    handleChannelClickStory = (item) => {
      console.log('press');
      this.setState({ peek: false }, () => {
        Navigation.showOverlay({
          component: {
            id: 'preview_overlay',
            passProps: {
              item,
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

    handleClose = () => {
      const {
        peek
      } = this.state;
      if (!peek) return;
      Navigation.dismissOverlay('preview_overlay1');
      // Navigation.dismissOverlay('preview_overlay');
    }

    handlePreview = (item) => {
      console.log('long press');
      this.setState({ peek: true }, () => {
        Navigation.showOverlay({
          component: {
            id: 'preview_overlay1',
            passProps: {
              item,
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

    render() {
      const { item } = this.props;
      const image = item.media[0];
      return(
          <View style={{flex : 1, marginTop : 10}}>
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
              source={{ uri: `https://www.mycampusdock.com/${image}` }}
            />
            <Text style={{color : '#f0f0f0', fontSize : 15, margin : 5}}>{item.name}</Text>
            </TouchableOpacity>

            <FlatList
              horizontal
              style={{marginTop : 5}}
              keyExtractor={(item, index) => `${index}`}
              data={this.state.feed}
              renderItem={({ item }) => {
                  if (item.type === 'post') {
                    return (
                      <TouchableOpacity
                        onPress={() => this.handleChannelClickStory(item)}
                        onLongPress={() => this.handlePreview(item)}
                        onPressOut={() => this.handleClose()}
                        activeOpacity={0.9}
                      >
                        <PostThumbnail message={item.message}/>
                      </TouchableOpacity>
                    );
                  }
                  if (item.type === 'post-image') {
                    return (
                      <TouchableOpacity
                        style={{
                          overflow: 'hidden'
                        }}
                        onPress={() => { this.handleChannelClickStory(item); }}
                        onLongPress={() => this.handlePreview(item)}
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
                        onPress={() => { this.handleChannelClickStory(item); }}
                        onLongPress={() => this.handlePreview(item)}
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
      );
    }
}

export default StoryFeed;