import React from 'react';
import {
  ActivityIndicator, TouchableWithoutFeedback,TouchableOpacity, Dimensions, View, Text
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SessionStore from '../SessionStore';
import constants from '../constants';

const WIDTH = Dimensions.get('window').width;
const {MUTED} = constants;

class PostVideo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      buffering: false,
      muted : this.props.muted === undefined ? new SessionStore().getValue(MUTED) : this.props.muted
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.muted !== prevProps.muted) this.setState({muted : this.props.muted}); /* ANTI PATTERN */
  }

    render() {
      const {
        loading,
        buffering
      } = this.state;
      const {
        message,
        video
      } = this.props;
      return (
        <View style={{
          backgroundColor: '#000',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        >
          <TouchableWithoutFeedback onPress = {()=>{
            new SessionStore().putValue(MUTED, !this.state.muted);
            this.setState({muted : !this.state.muted});
          }}>
            <Video
              source={{ uri: encodeURI(`https://www.mycampusdock.com/${video}`) }}
              onLoad={() => this.setState({ loading: false })}
              muted = {this.state.muted}
              // eslint-disable-next-line react/no-unused-state
              onBuffer={val => this.setState({ buffering: val.isBuffering })}
              style={{
                backgroundColor: '#222',
                width: WIDTH,
                height: 300,
                margin: 5,
              }}
            />
          </TouchableWithoutFeedback>

          <View style={{flexDirection : 'row',}}>
              <TouchableOpacity style={{width : 30 , height : 30, borderRadius : 20, backgroundColor : 'rgba(255, 255, 255, 0.2)', justifyContent : 'center', alignItems : 'center'}} onPress ={()=>this.setState({muted : !this.state.muted})}>
                <Icon name = {this.state.muted ? 'volume-mute' : 'volume-high' } size = {22} />
              </TouchableOpacity>
          </View>

          <Text
            style={{
              color: '#fff',
              marginTop: 15,
              fontFamily: 'Roboto',
              fontSize: 14,
              margin : 5,
              textAlign : 'center'
            }}
          >
            {message}
          </Text>
          {
            (loading || buffering)
              && (
                <ActivityIndicator size="small" color="#fff" />
              )
          }
        </View>
      );
    }
}

export default PostVideo;
