/* eslint-disable no-param-reassign */
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  RefreshControl,
  ScrollView, View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList
} from 'react-native';
import axios from 'axios';
import { Navigation } from 'react-native-navigation';
import Constants from '../constants';
import Realm from '../realm';
import ChannelCard from '../components/ChannelCard';
import CategoryCard from '../components/CategoryCard';
import PostThumbnail from '../components/PostThumbnail';
import PostImageThumbnail from '../components/PostImageThumbnail';
import PostVideoThumbnail from '../components/PostVideoThumbnail';
import { processRealmObj, processRealmObjRecommended, shuffleArray } from './helpers/functions';
import { categories } from './helpers/values';

const { TOKEN } = Constants;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.updateRecommendedList = this.updateRecommendedList.bind(this);
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.getTrendingContent = this.getTrendingContent.bind(this);
    this.getItemView = this.getItemView.bind(this);
    //this.handlePreviewOverlay = this.handlePreviewOverlay.bind(this);
  }

    state = {
      loading: false,
      refreshing: false,
      channelList: [],
      categorySelected: '',
      trending: []
    }

    componentDidMount() {
      this.navigationEventListener = Navigation.events().bindComponent(this);
      Realm.getRealm((realm) => {
        const categorySelected = categories[0].value;
        const elements = realm.objects('Channels').filtered(`category="${categorySelected}"`);
        processRealmObj(elements, (final) => {
          shuffleArray(final, (channelList) => {
            this.setState({ channelList, categorySelected });
          });
        });
      });
    }

    componentWillUnmount() {
      // Not mandatory
      if (this.navigationEventListener) {
        this.navigationEventListener.remove();
      }
    }

    updateRecommendedList = async (channelsList, category) => {
      this.setState({
        loading: true,
        categorySelected: category
      });
      const token = await AsyncStorage.getItem(TOKEN);

      // eslint-disable-next-line no-undef
      const formData = new FormData();
      formData.append('category_list', JSON.stringify([category]));
      formData.append('channels_list', JSON.stringify(channelsList));
      formData.append('count', 10);
      await axios.post('https://www.mycampusdock.com/channels/top', formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      }).then((response) => {
        console.log(response);
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
            const {
              categorySelected
            } = this.state;
            if (categorySelected === category) {
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
      this.getTrendingContent();
    }

    getTrendingContent = async () => {
      const token = await AsyncStorage.getItem(TOKEN);
      // eslint-disable-next-line no-undef
      const formData = new FormData();
      const { categorySelected } = this.state;
      formData.append('category', categorySelected);
      await axios.post('https://www.mycampusdock.com/channels/fetch-popular-activity', formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      }).then((response) => {
        const items = response.data.data;
        this.setState({ trending: items, loading: false });
      });
    }

    updateContent = () => {
      const { handleUpdateData } = this;
      const { categorySelected } = this.state;
      handleUpdateData(categorySelected);
    }

    handleChannelClick = (id, name) => {
      // const { componentId } = this.props;
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

    handleUpdateData = (category) => {
      const { loading } = this.state;
      if (loading) return;
      const { updateRecommendedList } = this;
      Realm.getRealm((realm) => {
        let elements;
        console.log('Cat :', category);
        // if (category === 'hottest') {
        //   elements = realm.objects('Channels').sorted('recommended', true);
        //   processRealmObj(elements, (final) => {
        //     shuffleArray(final, (channelList) => {
        //       this.setState({ channelList });
        //     });
        //   });
        // } else {
          
        // }
        elements = realm.objects('Channels').filtered(`category="${category}"`);
        processRealmObj(elements, (final) => {
          this.setState({ channelList: final });
        });
        // get the previously recommended list to prevent redundant data response from server
        const elementsRecommended = realm.objects('Channels').filtered(`category="${category}" AND (subscribed = "true" OR recommended="true") `);
        processRealmObjRecommended(elementsRecommended, (result) => {
          updateRecommendedList(result, category);
        });
      });
    }

    // handlePreviewOverlay = (item, type, index) => {
    //   this.setState()
    //   const { trending } = this.state;
    //   const current = [...trending];
    //   const final = [];
    //   final.push(current[index]);
    //   let i;
    //   current.splice(index, 1);
    //   current.unshift(item);
    //   for (i = 1; i < current.length; i += 1) {
    //     if (current[i].type === type) {
    //       final.push(current[i]);
    //     }
    //   }
    //   console.log(final);
    //   Navigation.showOverlay({
    //     component: {
    //       passProps: {
    //         stories: final,
    //         type
    //       },
    //       name: 'Preview Overlay Screen',
    //       options: {
    //         overlay: {
    //           interceptTouchOutside: false
    //         }
    //       }
    //     }
    //   });
    // }

    handlePreview = (item) =>{
      this.setState({tap : false})
      Navigation.showOverlay({
        component: {
          id : 'preview_overlay',
          passProps: {
            item,
          },
          name: 'Discover Preview',
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
    }

    handleClose = () =>{
      if(this.state.tap){
        return;
      } else {
        Navigation.dismissOverlay('preview_overlay');
      }
    }

    getItemView = (item) => {
      switch (item.type) {
        case 'post': return (
          <TouchableOpacity onPress={()=>this.setState({tap : true})} onLongPress={()=>this.handlePreview(item)} onPressOut={()=>this.handleClose()} activeOpacity = {0.9}>
            <PostThumbnail message={item.message} />
          </TouchableOpacity>
        );
        case 'post-image': return (
          <TouchableOpacity onPress={()=>this.setState({tap : true})} onLongPress={()=>this.handlePreview(item)} onPressOut={()=>this.handleClose()} activeOpacity = {0.9}>
            <PostImageThumbnail image={item.media[0]} />
          </TouchableOpacity>
        );
        case 'post-video': return (
          <TouchableOpacity onPress={()=>this.setState({tap : true})} onLongPress={()=>this.handlePreview(item)} onPressOut={()=>this.handleClose()} activeOpacity = {0.9}>
            <PostVideoThumbnail video={item.media} />
          </TouchableOpacity>
        );
        default: return <Text>.</Text>;
      }
    }

    componentDidAppear() {
      this.getTrendingContent();
    }

    render() {
      const { updateContent, handleChannelClick, handleUpdateData } = this;
      const {
        refreshing,
        categorySelected,
        channelList,
        loading,
        trending
      } = this.state;
      return (
        <View style={{ flex: 1 }}>
          {/* <View
            elevation={5}
            style={{
              backgroundColor: '#fff',
              paddingTop: Platform.OS === 'android' ? 8 : 42,
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 0.5,
              shadowOffset: {
                height: 2,
                width: 2
              }
            }}
          /> */}
          <ScrollView
            refreshControl={(
              <RefreshControl
                refreshing={refreshing}
                onRefresh={updateContent}
              />
            )}
          >
            <View
              style={{
                flex: 1,
                // padding: 10,
                backgroundColor: '#222'
              }}
            >
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                extraData={categorySelected}
                data={categories}
                renderItem={({ item }) => (
                  <CategoryCard
                    width={100}
                    height={75}
                    name={item.title}
                    selected={categorySelected === item.value}
                    onPress={() => handleUpdateData(item.value)}
                    image={item.image}
                  />
                )}
              />
            </View>
            <View>
              <Text style={{
                fontFamily: 'Roboto', fontSize: 18, margin: 5, marginLeft: 10, marginRight: 10, marginBottom: 2
              }}
              >
                Top {categorySelected} channels
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
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 30
                }}
              >
                {
                  loading
                  && (
                  <ActivityIndicator
                    style={{
                      alignSelf: 'center',
                      flex: 1
                    }}
                    size="small"
                    color="#444"
                  />
                  )
                }

              </View>
            </View>
            <View>
            {
                trending.length > 0 && 
                <View>
                <Text style={{
                  fontFamily: 'Roboto', fontSize: 18, marginLeft: 10, marginRight: 10, marginBottom: 0
                }}
                >
                  Trending Now
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${index}`}
                  extraData={categorySelected}
                  numColumns={3}
                  data={trending}
                  renderItem={({ item }) => this.getItemView(item)
                      }
                />
                </View>
              }
            </View>
          </ScrollView>
        </View>
      );
    }
}

export default Home;
