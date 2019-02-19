/* eslint-disable consistent-return */
import React from 'react';
import {
  Animated,
  View,
  BackHandler,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import FastImage from 'react-native-fast-image';
import SessionStore from '../SessionStore';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class DiscoverPreview extends React.Component {
  constructor(props) {
    super(props);
    this.position = new Animated.Value(0);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    channel : {media : '["dummy"]', name : 'dummy'}
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    const {item,image} = this.props;
    const store = new SessionStore();
    store.pushUpdate(item._id);
    store.pushViews(item.channel, item._id);
    this.setState({ channel : { name : item.channel_name, media : image}});
    try {
      Animated.spring(
        this.position,
        {
          toValue: 400,
          friction: 7,
          //duration : 200,
          //useNativeDriver : true,
        }
      ).start();
    } catch(e) {
      console.log(e);
    }
  }

  getItemView = (item) => {
    // eslint-disable-next-line default-case
    switch (item.type) {
      case 'post': return (
        <Post message={item.message} />
      );
      case 'post-image': return (
        <PostImage image={item.media[0]}/>
      );
      case 'post-video': return (
        <PostVideo video={item.media}/>
      );
    }
  }

  gotoChannel = (item) =>{
    new SessionStore().pushVisits(item.channel, item._id);
    Navigation.showOverlay({
      component: {
        name: 'Channel Detail Screen',
        passProps: {
          id: item.channel,
          modal: true
        },
        options: {
          bottomTabs: {
            animate: true,
            drawBehind: true,
            visible: false
          },
          topBar: {
            title: {
              text: item.channel_name
            },
            visible: true
          }
        }
      }
    });
    Navigation.dismissOverlay(this.props.componentId);
  }

  async componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  close = (componentId) =>{
    Animated.timing(
      this.position,
      {
        duration: 200,
        toValue: 0,
        //useNativeDriver : true,
      }
    ).start(() => {
      Navigation.dismissOverlay(componentId); 
    });
  }

  handleBackButtonClick = () => {
    const {
      componentId
    } = this.props;
    this.close(componentId);
    return true;
  }

  render() {
    const {item, image} = this.props;
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
          height: this.position,
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
            <FastImage
              style={{
                width : 36, height : 36, borderRadius : 20, marginLeft : 10,
              }}

              source={{ uri: `https://www.mycampusdock.com/${image}` }}
              resizeMode={FastImage.resizeMode.cover}
            />
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
              onPress={() => this.close(this.props.componentId)}
            >
              <Icon style={{ alignSelf: 'flex-end', color: '#333' }} size={20} name="close" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default DiscoverPreview;
