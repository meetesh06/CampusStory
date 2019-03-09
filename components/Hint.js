import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class Hint extends React.Component {
  constructor(props){
    super(props);
  }

  getHint = () =>{
    let index =   0 + Math.floor(Math.random() * 8);
    switch(index){
      case 3 : return 'Expore trending events of week in Spotlight!'
      case 1 : return 'Save details in profile for easy events registration!'
      case 2 : return 'Discover channels & stories in discover tab!'
      case 0 : return 'Subscribe channels for easy updates from them!'
      case 4 : return 'Bookmark events by marking interested!'
      case 5 : return 'Find private channels in the settings!'
      default : return 'React to stories with different emojis 😍!'
    }
  }

  state = {
    hint  : this.getHint()
  }

  render(){
    const {hint} = this.state;
    return (
      <View style = {{flexDirection : 'row', padding : 10, backgroundColor : '#444'}}>
        <Text style={{fontSize : 12, color : '#ddd', flex : 1, textAlign : 'center'}}>
          {'Tip : '}
          {hint}
        </Text>
        <TouchableOpacity onPress = {this.props.onClose} activeOpacity = {0.7}>
          <Icon name = 'close' size = {20} style={{color : "#ddd"}} />
        </TouchableOpacity>
      </View>
    )
  }
}
export default Hint;
