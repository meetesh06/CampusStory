/* eslint-disable consistent-return */
import React from 'react';
import {
  Animated,
  View,
  BackHandler,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import ReactionButton from '../components/ReactionButton';
import FastImage from 'react-native-fast-image';
import SessionStore from '../SessionStore';
import axios from 'axios';
import urls from '../URLS';
import constants from '../constants';

const WIDTH = Dimensions.get('window').width;

class DiscoverPreview extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    this.opacity = new Animated.Value(0);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    channel : {media : this.props.image, name : this.props.item.channel_name }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    let {item,image} = this.props;
    if(image === null || image === undefined) image = '["xxx"]';
    const store = new SessionStore();
    store.pushUpdate(item._id);
    store.pushViews(item.channel, item._id);
    try {
      Animated.spring(this.opacity,{
        toValue: 1,
        friction: 7,
      }).start();
    } catch(e) {
      console.log(e);
    }
  }

  getItemView = (item) => {
    // eslint-disable-next-line default-case
    switch (item.type) {
      case 'post': return (
        <Post data={item} />
      );
      case 'post-image': return (
        <PostImage image={item.media[0]} _id = {item._id} />
      );
      case 'post-video': return (
        <PostVideo video={item.media} _id = {item._id}/>
      );
    }
  }

  channel_visit = (_id) =>{
    axios.post(urls.UPDATE_CHANNEL_VISITS, { _id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': new SessionStore().getValue(constants.TOKEN)
      }
    }).then((response) => {
      console.log(response);
    }).catch((e)=>{
      console.log(e)
    });
  }

  gotoChannel = (item) =>{
    Navigation.showOverlay({
      component: {
        name: 'Channel Detail Screen',
        passProps: {
          id: item.channel,
          modal: true
        },
        options: {
          overlay: {
            interceptTouchOutside: false
          }
        }
      }
    });
    this.channel_visit(item._id);
    Navigation.dismissOverlay(this.props.componentId);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  close = () =>{
    const {
      componentId
    } = this.props;
    Animated.timing(
      this.position,
      {
        duration: 200,
        toValue: 0,
      }
    ).start(() => {
      Navigation.dismissOverlay(componentId); 
    });
  }

  handleBackButtonClick = () => {
    this.close();
    return true;
  }

  handleReport = ()=>{
    Alert.alert(
      'Report this Story',
      'Any abusive content on the story? Are you sure you want to report this story?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Report', onPress: () => this.reportStory()},
      ]
    );
  }

  reportStory = () =>{
    /* REPORT SOMETHING */
    Alert.alert(
      'Story Reported',
      'We have flagged this story as a report from you and we will look into it if it does not follow our content guidelines we will remove it as soon as possible.',
    );
  }

  render() {
    const {item, image, hide_image} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center'
        }}
      >
        <Animated.View style={{
          width: WIDTH - 20,
          marginLeft: 10,
          borderRadius: 10,
          overflow: 'hidden',
          height: 400,
          opacity: this.opacity,
          backgroundColor: '#fff'
        }}
        >
          
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
          >
            {
              this.getItemView(item)
            }
          </View>

          <View style={{position : 'absolute', flexDirection : 'row', top : 3, left : 0, padding : 5, justifyContent : 'center', alignItems : 'center'}}>
          
          <TouchableOpacity onPress ={()=>this.gotoChannel(item)} style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', }}>
            {
              !hide_image &&
              <FastImage
                style={{
                  width : 36, height : 36, borderRadius : 20, marginLeft : 10,
                }}

                source={{ uri: encodeURI(urls.PREFIX + '/' +  `${image}`) }}
                resizeMode={FastImage.resizeMode.cover}
              />
            }
            <Text style={{fontSize : 15, color : '#dfdfdf', margin : 5, fontFamily : 'Roboto', fontWeight : 'bold'}}>{item.channel_name}</Text>
          </TouchableOpacity>
          
          <View style={{flex : 1}} />
          
          <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                padding: 5,
                marginRight : 5,
                backgroundColor: '#ffffff99',
                borderRadius: 20
              }}
              onPress={() => this.close()}
            >
              <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={20} name="close" />
            </TouchableOpacity>
          </View>

          { item !== undefined &&
              <View style={{position : 'absolute', bottom : 0, right : 0,}}>
                <ReactionButton _id = {item._id} reactions = {item.reactions} my_reactions = {item.my_reactions} data = {item.reaction_type} online = {true} />
              </View>
            }
            { item !== undefined &&
              <TouchableOpacity activeOpacity = {0.7} onPress = {this.handleReport} style={{position : 'absolute', bottom : 10, left : 15, backgroundColor : 'rgba(255, 255, 255, 0.3)', padding : 5, borderRadius : 50 }}>
                <IconMaterial name = 'report' size = {25} color = '#rgba(255, 255, 255, 0.8)' />
              </TouchableOpacity>
            }
        </Animated.View>
      </View>
    );
  }
}

export default DiscoverPreview;
