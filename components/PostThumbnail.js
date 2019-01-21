import React from 'react';
import { Text, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const WIDTH = Dimensions.get('window').width;

class PostThumbnail extends React.Component {
    render() {
        return(
            <LinearGradient style={{ width : (WIDTH - 20) / 3, height : WIDTH / 3, justifyContent : 'center', alignItems : 'center'}} colors={['#0056e5', '#85f5ff']} >
                <Text
                    style={{
                        fontSize: 12,
                        textAlign : 'center',
                        margin : 5,
                        fontFamily: 'Roboto',
                        color: '#fff',
                    }}
                    numberOfLines = {4}
                    lineBreakMode = 'tail'
                > {'Something More is always better than something else'} </Text>
            </LinearGradient>
        );
    }
}

export default PostThumbnail;