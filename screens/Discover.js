/* eslint-disable no-param-reassign */
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  RefreshControl,
  ScrollView, View,
  Text,
  Platform,
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
import { processRealmObj, processRealmObjRecommended } from './helpers/functions';
import { categories } from './helpers/values';

const { TOKEN } = Constants;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.updateRecommendedList = this.updateRecommendedList.bind(this);
    this.handleChannelClick = this.handleChannelClick.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

    state = {
      loading: false,
      refreshing: false,
      channelList: [],
      categorySelected: '',
      trending: []
    }

    componentDidMount() {
      this.updateContent();
    }

    updateRecommendedList = async (channelsList, category, callback) => {
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
      let error = false;
      await axios.post('https://www.mycampusdock.com/channels/top', formData, {
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
          });
        }
      }).catch((err) => { error = true; console.log(err); });
      this.setState({ loading: false }, () => callback(error));
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
        console.log('trending', response);
        const items = response.data.data;
        this.setState({ trending: items });
      });
    }

    updateContent = async () => {
      const { handleUpdateData } = this;
      handleUpdateData(categories[0].value);
    }

    handleChannelClick = (id, name) => {
      const { componentId } = this.props;
      Navigation.push(componentId, {
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
        // get the previously recommended list to prevent redundant data response from server
        const elementsRecommended = realm.objects('Channels').filtered(`category="${category}" AND (subscribed = "true" OR recommended="true") `);
        processRealmObjRecommended(elementsRecommended, (result) => {
          updateRecommendedList(result, category, () => {
            const elements = realm.objects('Channels').filtered(`category="${category}"`);
            processRealmObj(elements, (final) => {
              this.setState({ channelList: final });
            });
          });
        });
      });
    }

    getItemView = (item) => {
      switch (item.type) {
        case 'post': return <PostThumbnail message={item.message} />;
        case 'post-image': return <PostImageThumbnail image={item.media[0]} />;
        case 'post-video': return <PostVideoThumbnail video={item.media} />;
        default: return <Text>.</Text>;
      }
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
          <View
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
          />
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

            <View
              style={{
                flexDirection: 'row'
              }}
            >
              {
                loading
                && (
                <ActivityIndicator
                  style={{
                    alignSelf: 'center',
                    marginTop: 10,
                    flex: 1
                  }}
                  size="small"
                  color="#444"
                />
                )
              }
            </View>
            {
              !loading
              && (
              <View>
                <Text style={{
                  fontFamily: 'Roboto', fontSize: 18, margin: 5, marginLeft: 10, marginRight: 10, marginBottom: 0
                }}
                >
                  Top Channels
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
            {
              !loading
              && (
              <View>
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
              )
            }
          </ScrollView>
        </View>
      );
    }
}

export default Home;
