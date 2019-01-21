import React from 'react';
import { ActivityIndicator, AsyncStorage, TextInput, TouchableOpacity, RefreshControl, ScrollView, View, Text, Platform, Image, FlatList } from 'react-native';
import Constants from '../constants';
import axios from 'axios';
import Realm from '../realm';
import ChannelCard from '../components/ChannelCard';
import CategoryCard from '../components/CategoryCard';
import { Navigation } from 'react-native-navigation';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import PostThumbnail from '../components/PostThumbnail';
import PostImageThumbnail from '../components/PostImageThumbnail';
import PostVideoThumbnail from '../components/PostVideoThumbnail';

const TOKEN = Constants.TOKEN;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._updateContent = this._updateContent.bind(this);
        this._updateRecommendedList = this._updateRecommendedList.bind(this);
        this.process_realm_obj = this.process_realm_obj.bind(this);
        this.process_realm_obj_recommended = this.process_realm_obj_recommended.bind(this);
        this.handleChannelClick = this.handleChannelClick.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
    }
    state = {
        loading: false,
        refreshing: false,
        recommended_channels: [],
        channel_list: [],
        categorySelected: '',
        categories: []
    }

    componentDidMount() {
        this._updateContent();
        
    }

    process_realm_obj_recommended = (RealmObject, callback) => {
        let result = [];
        result = Object.keys(RealmObject).map(function(key) {
          return RealmObject[key]._id;
        });
        callback(result);
    }

    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }

    _updateRecommendedList = async (channels_list, category, callback) => {
        this.setState({
            loading: true,
            categorySelected: category
        })
        const token = await AsyncStorage.getItem(TOKEN);

        const formData = new FormData();
        formData.append('category_list', JSON.stringify([category]));
        formData.append('channels_list', JSON.stringify(channels_list));
        formData.append('count', 15);
        let error = false;
        await axios.post('https://www.mycampusdock.com/channels/top', formData, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }).then( response => {
            if(!response.data.error) { 
                response.data.data.forEach((el)=>{
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
                let data = response.data.data;
                console.log(data);
                if(data.length === 0) return;
                
                Realm.getRealm((realm) => {
                    realm.write(() => {
                        let i;
                        for(i=0;i<data.length;i++) {
                            try {
                                realm.create('Channels', data[i], true);
                            } catch(e) {
                                console.log(e);
                            }
                        }
                    });
                    console.log('updating realm done');
                });
            }
        }).catch( err => { error = true; console.log(err) }
        )
        this.setState({ loading: false }, () => callback(error))
        this.getTrendingContent();
    }

    getTrendingContent = async ()=> {
        const token = await AsyncStorage.getItem(TOKEN);
        const formData = new FormData();
        formData.append('category', this.state.categorySelected);
        await axios.post('https://www.mycampusdock.com/channels/fetch-popular-activity', formData, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }).then(response => {
            console.log('trending', response);
            const items = response.data.data;
            this.setState({trending : items});
        });
    }
    
    _updateContent = async () => {
        const handleUpdateData = this.handleUpdateData;
        
        this.setState({ refreshing: true });
        formData = new FormData();
		formData.append("dummy", ""); /* DO NOT DELETE */
        await axios.post("https://www.mycampusdock.com/users/get-category-list", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then( (result) => {
            result = result.data;
            console.log(result);
            if(!result.error) {
                this.setState({ categories: result.data, categorySelected: result.data[0].value });
                handleUpdateData(result.data[0].value);
            }
            })
            .catch( (err) => console.log(err) )
        this.setState({ refreshing: false });
    }

    handleChannelClick = (id, name) => {
        Navigation.push(this.props.componentId, {
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
        if(this.state.loading) return;
        const process_realm_obj_recommended = this.process_realm_obj_recommended;
        const process_realm_obj = this.process_realm_obj;
        const _updateRecommendedList = this._updateRecommendedList;
        Realm.getRealm((realm) => {
            // get the previously recommended list to prevent redundant data response from server
            let elements_recommended = realm.objects('Channels').filtered(`category="${category}" AND (subscribed = "true" OR recommended="true") `);            
            process_realm_obj_recommended(elements_recommended, (result) => {
                _updateRecommendedList(result, category, () => {
                    // console.log('updating done');
                    let elements = realm.objects('Channels').filtered(`category="${category}"`);
                    process_realm_obj(elements, (final) => {
                        this.setState({ channel_list: final });
                    })
                });
            })
        });
    }

    getItemView = (item) =>{
        switch(item.type){
            case 'post' : return <PostThumbnail key = {item._id} message = {item.message} style={{width : 100, height : 150, }}/>
            case 'post-image' : return <PostImageThumbnail image = {item.media[0]} />
            case 'post-video' : return <PostVideoThumbnail video = {item.media} />
        }
    }

    render() {
        return(
            <View style={{ flex: 1 }}>
                <View elevation={5} 
                    style = {{ 
                        backgroundColor : '#fff', 
                        //minHeight : Platform.OS === 'android' ? 70 : 90, 
                        paddingTop : Platform.OS === 'android'? 8 : 30, 
                        shadowColor: "#000000",
                        shadowOpacity: 0.1,
                        shadowRadius: 0.5,
                        shadowOffset: {
                            height: 2,
                            width: 2
                        }
                }}>
                <View style={{backgroundColor : '#fff'}}>
                        <View style ={{
                            alignItems : 'center',
                            flexDirection : 'row',
                            marginLeft : 10,
                            marginRight : 10, 
                            marginTop : 10,
                            borderRadius : 20, 
                            margin : 5,
                            backgroundColor : '#rgb(248, 248, 248)'
                            }}>
                            <TouchableOpacity><IconEvil name='search' size={25} color = '#c5c5c5'  style={{marginLeft : 10}}/></TouchableOpacity>
                            <TextInput
                                style={{ fontSize : 16, padding : 3, marginLeft : 3, marginRight : 10, margin : 5, flex : 1,}}
                                placeholder = 'Search'
                                onChangeText = {(text) => console.log(text)}
                            />
                        </View>  
                    </View>
                </View>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._updateContent}
                        />
                    }
                    // style={{ paddingTop: 10 }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#333'
                        }}
                    >
                        <FlatList 
                            style={{
                                padding: 10
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={ (item, index) => index+"" }
                            extraData={this.state.categorySelected}
                            data={this.state.categories} 
                            renderItem={({item}) => 
                                <CategoryCard width={64} height={64} name = {item.value} selected = {this.state.categorySelected === item.value} onPress={() => this.handleUpdateData(item.value)} image={"https://www.mycampusdock.com/"+item.alt} /> 
                            } 
                        />

                    </View>
                    
                    
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        
                        {
                            this.state.loading &&
                            <ActivityIndicator style={{
                                alignSelf: 'center',
                                // backgroundColor: 'red',
                                marginTop: 10,
                                flex: 1
                            }} size="small" color="#444" />
                        }
                        {/* {
                            !this.state.loading &&
                            <Text 
                                style={{ 
                                    flex: 1, 
                                    marginTop: 10, 
                                    textAlign: 'center', 
                                    fontFamily: 'Roboto', 
                                    fontSize: 25, 
                                    marginLeft: 10,
                                    textTransform: 'capitalize'
                                }}
                            > 
                                {this.state.categorySelected}
                            </Text>
                        } */}
                    </View>
                    {
                        !this.state.loading &&
                        <View>
                            <Text style={{fontFamily : 'Roboto', fontSize : 18, margin : 5, marginLeft : 10, marginRight : 10, marginBottom : 0}}>Top Channels</Text>
                            <FlatList 
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index+""}
                                data={this.state.channel_list}
                                renderItem={({item}) => 
                                    <ChannelCard onPress={this.handleChannelClick} width={136} height={96} item={item} />
                                } 
                            />
                        </View>
                    }

                    {
                        !this.state.loading &&
                        <View>
                            <FlatList 
                                style={{
                                    padding: 10
                                }}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={ (item, index) => index+"" }
                                extraData={this.state.categorySelected}
                                numColumns = {3}
                                data={this.state.trending} 
                                renderItem={({item}) => this.getItemView(item)
                                } 
                            />
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }

}

export default Home;