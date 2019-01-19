import React from 'react';
import { Animated, PanResponder, AsyncStorage, View, Text } from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import Swiper from 'react-native-animated-swiper';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import { Navigation } from 'react-native-navigation';

const TOKEN = Constants.TOKEN;

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
                    Animated.timing(
                        this.state.fadeAnim,
                        {
                          toValue: 0,
                          duration: 150,
                        }
                    ).start();
                    setTimeout(() => {
                        Navigation.dismissOverlay(this.props.componentId)
                    }, 150);
                }
            },
          });
    }
    state = {
        stories: [],
        fadeAnim: new Animated.Value(1)
    }
    async componentDidMount() {
        
        const context = this;
        // axios.post('https://www.mycampusdock.com/channels/get-activity-list', { channel_id: this.props._id ,last_updated: 'NIL' }, {
        axios.post('http://127.0.0.1:65534/channels/get-activity-list', { channel_id: this.props._id ,last_updated: '' }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            response = response.data;
            if(!response.error) {
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
                    backgroundColor: '#00000088'
                }}
                {...this._panResponder.panHandlers}
            >
                <Swiper
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
                            // return <PostVideo key={val._id} message={val.message} image={ val.media[0] } />
                        }
                    })}
                </Swiper>

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