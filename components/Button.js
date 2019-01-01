import React, {Component} from 'react';
import { TouchableOpacity, Animated } from 'react-native';


export default class Button extends Component {
    state = {
        btnScale: new Animated.Value(1),
        clicked: false
    }
    render() {
        let { btnScale } = this.state;
        return(
            <Animated.View style={this.props.style}>
                <TouchableOpacity 
                    onPressIn={() => {
                        Animated.spring(
                            btnScale,
                            { toValue: 1.1, friction: 3 }
                            ).start();
                    }}
                    onPressOut={() => {
                        Animated.spring(
                            btnScale,
                            { toValue: 1, friction: 3 }
                            ).start();
                    }}
                    onPress={() => {
                        let changed = !this.state.clicked;
                        this.setState({ clicked: changed });
                        this.props.onchange(changed);
                        Animated.spring(
                            btnScale,
                            { toValue: 1, friction: 3 }
                            ).start();
                    }}
                >
                    <Animated.View 
                        style={{ 
                            overflow: 'hidden',
                            // backgroundColor: 'red',
                            transform: [
                                {
                                    scale: btnScale
                                }
                            ]
                        }}
                    >
                        {
                            !this.state.clicked &&
                            this.props.state1()
                        }
                        {
                            this.state.clicked &&
                            this.props.state2()
                        }
                        
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}