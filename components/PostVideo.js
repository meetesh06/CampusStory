import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';

const WIDTH = Dimensions.get('window').width;

class PostImage extends React.Component {
    render() {
        return(
            <View style={{ backgroundColor: '#000', flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <Video 
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.video }}
                    // controls={true}
                    // playInBackground={false}
                    // paused={true}
                    style={{
                        backgroundColor: '#333',
                        // flex: 1,
                        width: WIDTH,
                        height: 300,
                        margin: 5,
                        borderRadius: 10
                    }} 
                />
                {/* <Video 
                    source={{ uri: 'https://www.mycampusdock.com/' + this.props.video }}
                    ref={(ref) => {
                        this.player = ref
                    }}                                      // Store reference
                    // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    // onError={this.videoError}               // Callback when video cannot be loaded
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }} 
                /> */}

                <Text
                    style={{
                        color: '#fff',
                        marginTop: 10,
                        fontFamily: 'Roboto',
                        fontSize: 14
                    }}
                >
                    {this.props.message}
                </Text>
            </View>
        );
    }
}

export default PostImage;