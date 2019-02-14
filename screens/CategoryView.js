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
import { Navigation } from 'react-native-navigation';
import Constants from '../constants';
import Realm from '../realm';
import ChannelCard from '../components/ChannelCard';
import PostThumbnail from '../components/PostThumbnail';
import PostImageThumbnail from '../components/PostImageThumbnail';
import PostVideoThumbnail from '../components/PostVideoThumbnail';
import SessionStore from '../SessionStore';
import RealmManager from '../RealmManager';

import {
  getCategoryName,
  processRealmObj,
  processRealmObjRecommended,
  shuffleArray
} from './helpers/functions';

const { TOKEN } = Constants;

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.updateContent = this.updateContent.bind(this);
    this.updateRecommendedList = this.updateRecommendedList.bind(this);
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.getTrendingContent = this.getTrendingContent.bind(this);
    this.getItemView = this.getItemView.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleChannelClickStory = this.handleChannelClickStory.bind(this);
    this.mounted = false;
  }

  state = {
    refreshing: false,
    channelList: [],
    peek: false,
    trending: []
  }

  componentDidMount() {
    const { category } = this.props;
    console.log('loading ', category);
    this.mounted = true;
    this.handleUpdateData(category);
    // this.getTrendingContent(category);
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  updateRecommendedList = (channelsList, category) => {
    const token = new SessionStore().getValue(TOKEN);
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('category_list', JSON.stringify([category]));
    formData.append('channels_list', JSON.stringify(channelsList));
    formData.append('count', 10);
    axios.post('https://www.mycampusdock.com/channels/top', formData, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then((response) => {
      if (!response.data.error) {
        response.data.data.forEach((el) => {
          el.priority = JSON.stringify(el.priority);
          el.media = JSON.stringify(el.media);
          el.followers = JSON.stringify(el.followers);
          el.channel_already = JSON.stringify(el.channel_already);
          el.category_found = JSON.stringify(el.category_found);
          el.recommended = JSON.stringify(true);
          el.subscribed = JSON.stringify(false);
          el.subscribed = JSON.stringify(false);
          el.updates = JSON.stringify(false);
        });
        const { data } = response.data;
        if (data.length === 0) return;

        Realm.getRealm((realm) => {
          realm.write(() => {
            let i;
            for (i = 0; i < data.length; i += 1) {
              try {
                realm.create('Channels', data[i], true);
              } catch (e) {
                console.log(e);
              }
            }
          });
          if (this.mounted) {
            const elements = realm.objects('Channels').filtered(`category="${category}"`).sorted('recommended', true);
            processRealmObj(elements, (final) => {
              shuffleArray(final, (channelList) => {
                this.setState({ channelList });
              });
            });
          }
        });
      }
    }).catch(err => (console.log(err)));
  }

  getTrendingContent = (category) => {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('category', category);
    axios.post('https://www.mycampusdock.com/channels/fetch-popular-activity', formData, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(TOKEN)
      }
    }).then((response) => {
      const items = response.data.data;
      this.setState({ trending: items, refreshing: false });
    }).catch(err => console.log(err))
      .finally(() => { this.setState({ refreshing: false }); });
  }

  handleChannelClick = (id, name) => {
    if (!this.mounted) return;
    Navigation.showModal({
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
    if (!this.mounted) return;
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

  handleUpdateData = (category) => {
    this.setState({
      refreshing: true,
      categorySelected: category
    });
    this.getTrendingContent(category);
    const { updateRecommendedList } = this;
    Realm.getRealm((realm) => {
      const elements = realm.objects('Channels').filtered(`category="${category}"`);
      processRealmObj(elements, (final) => {
        this.setState({ channelList: final });
      });
      const elementsRecommended = realm.objects('Channels').filtered(`category="${category}" AND (subscribed = "true" OR recommended="true") `);
      processRealmObjRecommended(elementsRecommended, (result) => {
        updateRecommendedList(result, category);
      });
    });
  }

  handlePreview = (item) => {
    if (!this.mounted) return;
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

  getItemView = (item) => {
    switch (item.type) {
      case 'post': return (
        <TouchableOpacity
          onPress={() => this.handleChannelClickStory(item)}
          onPressOut={() => this.handleClose()}
          activeOpacity={0.9}
        >
          <PostThumbnail message={item.message} />
        </TouchableOpacity>
      );
      case 'post-image': return (
        <TouchableOpacity
          onPress={() => { this.handleChannelClickStory(item); }}
          onPressOut={() => this.handleClose()}
          activeOpacity={0.9}
        >
          <PostImageThumbnail image={item.media[0]} />
        </TouchableOpacity>
      );
      case 'post-video': return (
        <TouchableOpacity
          onPress={() => { this.handleChannelClickStory(item); }}
          onPressOut={() => this.handleClose()}
          activeOpacity={0.9}
        >
          <PostVideoThumbnail video={item.media} />
        </TouchableOpacity>
      );
      default: return <Text>.</Text>;
    }
  }
  
  getChannelImage = async (id) =>{
    let img;
    const realm_manager = new RealmManager();
    await realm_manager.getItemById(id, 'Channels', (result)=>{
      if(result === null) img = 'null';
      else img =  result.media[0];
      console.log('EXECUTION STOPPED');
      return img;
    });
    console.log('RETURNING', img);
    return img;
  }

  render() {
    const { handleUpdateData, handleChannelClick } = this;
    const { category } = this.props;
    const {
      refreshing,
      categorySelected,
      channelList,
      trending
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#333' }}>
        <ScrollView
          showsVerticalScrollIndicator = {false}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => handleUpdateData(category)}
            />
          )}
        >
          {
            channelList.length > 0 && (
              <View>
                <Text style={{
                  fontFamily: 'Roboto', fontSize: 18, margin: 5, marginLeft: 10, marginRight: 10, marginBottom: 2
                }}
                >
                  Top
                  {' '}
                  {getCategoryName(categorySelected)}
                  {' '}
                  channels
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${index}`}
                  data={channelList}
                  renderItem={({ item }) => (
                    <ChannelCard
                      onPress={handleChannelClick}
                      width={136}
                      height={96}
                      item={item}
                    />
                  )}
                />
              </View>
            )
          }
          <View>
            {
              trending.length > 0 && (
                <View>
                  {/* <Text style={{
                    fontFamily: 'Roboto',
                    fontSize: 18,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    color: '#f0f0f0'
                  }}
                  >
                    Trending Now
                  </Text> */}
                  <FlatList
                    keyExtractor={(item, index) => `${index}`}
                    extraData={categorySelected}
                   numColumns={3}
                    data={trending}
                    renderItem={({ item }) => {
                      if (item.type === 'post') {
                        return (
                          <TouchableOpacity
                            onPress={() => this.handleChannelClickStory(item)}
                            onLongPress={() => this.handlePreview(item)}
                            onPressOut={() => this.handleClose()}
                            activeOpacity={0.9}
                          >
                            <PostThumbnail message={item.message} channel_name = {item.channel_name} channel_image = {this.getChannelImage(item.channel)} />
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
                            activeOpacity={0.2}
                          >
                            <PostVideoThumbnail video={item.media} />
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    }}
                  />
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;
