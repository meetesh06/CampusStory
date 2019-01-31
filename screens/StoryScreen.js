import React from 'react';
import { Platform, Alert, BackHandler, ActivityIndicator, Easing, Dimensions, TouchableOpacity, Animated, PanResponder, AsyncStorage, View, Text } from 'react-native';
import axios from 'axios';
import Constants from '../constants';
import Post from '../components/Post';
import PostImage from '../components/PostImage';
import PostVideo from '../components/PostVideo';
import { Navigation } from 'react-native-navigation';
import Realm from '../realm';

const TOKEN = Constants.TOKEN;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class StoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY();
        this.opacity = new Animated.Value(1);
        this.height = new Animated.Value(HEIGHT);
        this.width = new Animated.Value(WIDTH);
        this.radius = new Animated.Value(0);
        this.updateRead = this.updateRead.bind(true);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.process_realm_obj = this.process_realm_obj.bind(this);
        this.toUpdate = [];
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
            // The gesture has started. Show visual feedback so the user knows
            // what is happening!

            // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: (evt, gestureState) => {
                
                if(gestureState.dy > 0) {
                    this.opacity.setValue(1 - gestureState.dy / HEIGHT)
                }
                if(Platform.OS === "android") {
                    if( gestureState.vy > 0.4 ) {
                        return Navigation.dismissOverlay(this.props.componentId);
                    }
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // Alert.alert(gestureState.dy / HEIGHT * 100 + "");
                if( gestureState.dy / HEIGHT * 100  > 30) {
                    // Navigation.dismissOverlay(this.props.componentId); 
                    Animated.timing(
                        this.opacity,
                        {
                          toValue: 0,
                          easing: Easing.cubic,
                          duration: 300
                        }
                    ).start(() => {
                        Navigation.dismissOverlay(this.props.componentId); 
                    });
                } else {
                    Animated.spring(
                        this.opacity,
                        {
                          toValue: 1,
                          friction: 5
                        }
                    ).start();
                }
                
            },
            onPanResponderTerminate: (evt, gestureState) => {
            // Another component has become the responder, so this gesture
            // should be cancelled
            if( gestureState.dy / HEIGHT * 100  > 30) {
                // Navigation.dismissOverlay(this.props.componentId); 
                Animated.timing(
                    this.opacity,
                    {
                      toValue: 0,
                      easing: Easing.cubic,
                      duration: 300
                    }
                ).start(() => {
                    Navigation.dismissOverlay(this.props.componentId); 
                });
            } else {
                Animated.spring(
                    this.opacity,
                    {
                      toValue: 1,
                      friction: 5
                    }
                ).start();
            }
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return true;
            },
        });
    }
    state = {
        stories: [],
        fadeAnim: new Animated.Value(1),
        current: 0,
        loading: true
    }
    updateRead = () => {
        let current = this.state.stories[this.state.current];
        if(current === undefined) return; 
        this.toUpdate.push(current._id);
        Realm.getRealm((realm) => {
            realm.write(() => {
                realm.create('Activity', { _id: current._id, read: 'true' }, true);
            });
        });
    }
    process_realm_obj = (RealmObject, callback) => {
        var result = Object.keys(RealmObject).map(function(key) {
          return {...RealmObject[key]};
        });
        callback(result);
    }
    // android back button handling
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    async componentWillUnmount() {
        console.log(this.toUpdate);
        let formData = new FormData();
        formData.append("activity_list", JSON.stringify(this.toUpdate));

        axios.post('https://www.mycampusdock.com/channels/update-read', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': await AsyncStorage.getItem(TOKEN)
            }
        }).then( response => {
            console.log(response);    
        }).catch( err => console.log(err) );

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        Navigation.dismissOverlay(this.props.componentId); 
        return true;
    }

    async componentDidMount() {
        const process_realm_obj = this.process_realm_obj;
        Realm.getRealm((realm) => {
            let Final = realm.objects('Activity').filtered(`channel="${this.props._id}"`).sorted('timestamp', true);
            
            // let current = realm.objects('Channels').filtered(`_id="${this.props._id}"`);
            realm.write(() => {
                realm.create('Channels', { _id: this.props._id, updates: 'false' }, true);
            });
            
            process_realm_obj(Final, (result) => {
                this.setState({ stories: result, loading: false }, () => this.updateRead());
            });
        });   
    }

    render() {
        // console.log(this.state.stories[this.state.current]);
        return(
            <Animated.View
                style={[this.position.getLayout(), {
                    width: this.width,
                    height: this.height,
                    borderRadius: this.radius,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    opacity: this.opacity,
                    backgroundColor: '#000000'
                }]}
            >
                {
                    this.state.loading &&
                    <ActivityIndicator size="small" color="#fff" />
                }
                {
                    !this.state.loading && this.state.stories.length === 0 &&
                    <View>
                        <Text style={{ textAlign: 'center', color: '#fff' }}> Sorry there are no new stories yet! </Text>
                    </View>
                }
                {
                    this.state.stories.length > 0 &&
                    this.state.stories[this.state.current].type === "post" &&
                    <Post key={this.state.stories[this.state.current]._id} message={this.state.stories[this.state.current].message} />
                }
                {
                    this.state.stories.length > 0 &&
                    this.state.stories[this.state.current].type === "post-image" &&
                    <PostImage key={this.state.stories[this.state.current]._id} message={this.state.stories[this.state.current].message} image={ JSON.parse(this.state.stories[this.state.current].media)[0] } />
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
                        top: 0,
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
                        }}
                    >
                        
                    </TouchableOpacity>
                    <View
                        collapsable={false}
                        style={{
                            width: WIDTH/2,
                        }}
                        {...this._panResponder.panHandlers}
                    >
                    </View>
                    <TouchableOpacity
                        onPress={
                            () => {
                                if(this.state.current === this.state.stories.length - 1) return;
                                this.setState({ current: this.state.current + 1 }, () => this.updateRead() )
                            }
                        }
                        style={{
                            flex: 1,
                        }}
                    >
                    </TouchableOpacity>
                </View>
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