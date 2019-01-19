import React from 'react';
import { Dimensions, TouchableOpacity, Animated, PanResponder, AsyncStorage, View, Text } from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import Swiper from 'react-native-animated-swiper';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import { Navigation } from 'react-native-navigation';

const TOKEN = Constants.TOKEN;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
    constructor(props) {
        super(props);
        const getDirectionAndColor = ({ moveX, moveY, dx, dy}) => {
            return dy > 50;
        }
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder:(evt, gestureState) => !!getDirectionAndColor(gestureState),
            onPanResponderMove: (evt, gestureState) => {
                const drag = getDirectionAndColor(gestureState);
                if(drag) {
                    // Animated.timing(
                    //     this.state.fadeAnim,
                    //     {
                    //       toValue: 0,
                    //       duration: 150,
                    //     }
                    // ).start();
                    Navigation.dismissOverlay(this.props.componentId)
                }
            },
          });
    }
    state = {
        stories: [],
        fadeAnim: new Animated.Value(1),
        current: 0
    }
    async componentDidMount() {
        
        const context = this;
        axios.post('https://www.mycampusdock.com/channels/get-activity-list', { channel_id: this.props._id ,last_updated: 'NIL' }, {
        // axios.post('http://127.0.0.1:65534/channels/get-activity-list', { channel_id: this.props._id ,last_updated: 'NIL' }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            console.log(response);
            if(!response.error) {
                if(response.data.length === 0) Navigation.dismissOverlay(this.props.componentId);
                context.setState({ stories: response.data });
            }
            
        }).catch( err => console.log(err) );
    }

    render() {
        // console.log(this.state.stories);
        return(
            <Animated.View
                style={{
                    flex: 1,
                    opacity: this.state.fadeAnim,
                    backgroundColor: '#000000aa'
                }}
                {...this._panResponder.panHandlers}
            >
                {
                    this.state.stories.length > 0 &&
                    this.state.stories[this.state.current].type === "post" &&
                    <Post key={this.state.stories[this.state.current]._id} message={this.state.stories[this.state.current].message} />
                }
                {
                    this.state.stories.length > 0 &&
                    this.state.stories[this.state.current].type === "post-image" &&
                    <PostImage key={this.state.stories[this.state.current]._id} message={this.state.stories[this.state.current].message} image={ this.state.stories[this.state.current].media[0] } />
                }
                {
                    this.state.stories.length > 0 &&
                    this.state.stories[this.state.current].type === "post-video" &&
                    <PostVideo key={this.state.stories[this.state.current]._id} message={this.state.stories[this.state.current].message} video={ this.state.stories[this.state.current].media } />
                }
                <View
                    style={{
                        flex: 1,
                        height: HEIGHT,
                        width: WIDTH,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        position: 'absolute'
                    }}
                >
                    <TouchableOpacity
                        onPress={
                            () => {
                                if(this.state.current === 0) return;
                                this.setState({ current: this.state.current - 1 })
                            }
                        }
                        style={{
                            flex: 1,
                            // backgroundColor: 'red'
                        }}
                    >
                        
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            () => {
                                if(this.state.current === this.state.stories.length - 1) return;
                                this.setState({ current: this.state.current + 1 })
                            }
                        }
                        style={{
                            flex: 1,
                            // backgroundColor: 'green'
                        }}
                    >
                        
                    </TouchableOpacity>

                </View>
                
                {/* <Swiper
                    dots
                    dotsColor="rgba(97, 218, 251, 0.25)"
                    dotsColorActive="rgba(97, 218, 251, 1)"
                    style={styles.slides}>
                    {this.state.stories.map( (val) => {
                        if(val.type === "post") {
                            return <Post key={val._id} message={val.message} />
                        } else if(val.type === "post-image") {
                            return <PostImage key={val._id} message={val.message} image={ val.media[0] } />
                        } else if(val.type === "post-video") {
                            console.log(val.media);
                            return <PostVideo key={val._id} message={val.message} video={ val.media } />
                        }
                    })}
                </Swiper> */}

            </Animated.View>
        );
    }
}

const Slide = ({ title }) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  
const styles = {
    slides: { backgroundColor: '#F5FCFF' },
    slide: { alignItems: 'center', flex: 1, justifyContent: 'center' },
    title: { color: 'rgba(97, 218, 251, 1)', fontSize: 36 }
};

export default StoryScreen;