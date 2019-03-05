import React from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import urls from '../URLS';
import axios from 'axios';
import SessionStore from '../SessionStore';
import constants from '../constants';
import Realm from '../realm';

const REACTIONS_LIMIT = constants.REACTIONS_LIMIT
class ReactButton extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    count : 0,
    old_count : 0,
    total : 0,
    reaction_type : {},
    reacted : false,
    bubbles : [],
  }

  componentDidMount(){
    this.set(this.props);
  }

  componentWillReceiveProps(nextProps){
    console.log('Something new', this.props.index, nextProps.index);
    if(this.props.index !== nextProps.index){
      this.pushReactions();
      this.set(nextProps);
    }
  }

  set = (props) =>{
    const {_id, data, online} = props;
    let reactions, my_reactions;
    let reaction_type = JSON.parse(data);

    if(online){
      let story_obj = new SessionStore().getValueTemp(_id + '-story-reaction');
      if(story_obj === null || story_obj === undefined){
        story_obj = {
          reactions : props.reactions,
          my_reactions : props.my_reactions
        };
        new SessionStore().putValueTemp(_id + '-story-reaction', story_obj);
      }
      reactions = story_obj.reactions;
      my_reactions = story_obj.my_reactions; 
    } else {
      reactions = props.reactions;
      my_reactions = props.my_reactions;
    }

    let myReactionsArray = my_reactions;
    if(myReactionsArray.length > 0){
      let myReactions = myReactionsArray[0];
      let count = parseInt(myReactions.count);
      let old_count = count;
      let total = parseInt(reactions) - count;
      this.setState({total, count, old_count, reaction_type, reacted : true, bubbles : []});
    } else {
      this.setState({total : parseInt(reactions), count : 0, old_count : 0, reaction_type, reacted : false, bubbles : []});
    }
  }
  
  renderBubbles = () =>{
    return this.state.bubbles.map((value, index)=>
      <Bubble key={index} value = {value} index = {index} onFinishAnimation = {this.removeBubble}/>
    );
  }

  removeBubble = (index) =>{
    let bubbles = this.state.bubbles;
    bubbles.splice(index, 1);
    this.setState({bubbles});
  }

  addBubble = () =>{
    const {reaction_type, count, bubbles} = this.state;
    if(count >= REACTIONS_LIMIT){
      bubbles.push({reaction_type, count});
      this.setState({count, bubbles});
    }
    else {
      let new_count = count + 1;
      bubbles.push({reaction_type, count : new_count});
      this.setState({count : new_count, bubbles});
    }
  }

  pushReactions = () =>{
    const {count, total, old_count} = this.state;
    const new_total = count + total;
    const change = count - old_count;
    const {_id, my_reactions, online} = this.props;

    if(change > 0 && change <= REACTIONS_LIMIT){
      let formData = new FormData();
      formData.append('_id', _id);
      formData.append('count', change);
      axios.post(urls.REACT_STORY, formData, {
        headers: {
          'x-access-token': new SessionStore().getValue(constants.TOKEN)
        }
      }).then((response) => {
        if(!response.data.error){
          if(online){
            let my_new_reactions = my_reactions;
            if(my_new_reactions.length > 0){
              my_new_reactions[0].count = count;
            } else {
              my_new_reactions.push({count});
            }
            let story_obj = {
              reactions : new_total,
              my_reactions : my_new_reactions
            };
            new SessionStore().putValueTemp(_id + '-story-reaction', story_obj);
          } else {
            Realm.getRealm((realm)=>{
              realm.write(() => {
                let activity = realm.objects('Activity').filtered(`_id="${_id}"`);
                let my_new_reactions = my_reactions;
                if(my_new_reactions.length > 0){
                  my_new_reactions[0].count = count;
                  activity[0].reactions = '' + new_total;
                  activity[0].my_reactions = JSON.stringify(my_new_reactions);
                  realm.create('Activity', activity[0], true); 
                } else {
                  my_new_reactions.push({count});
                  activity[0].reactions = '' + new_total;
                  activity[0].my_reactions = JSON.stringify(my_new_reactions);
                  realm.create('Activity', activity[0], true); 
                }        
              });
            });
          }
        }
      });
    }
  }

  componentWillUnmount(){
    console.log('Will Unmount');
    this.pushReactions();
  }

  render(){
    const {reacted, reaction_type, count, total} = this.state;
    const new_total = count + total;
    return (
      <TouchableOpacity
      activeOpacity = {0.7}
        style={{
          backgroundColor : 'transparent',
          paddingTop : 20, paddingLeft : 20
        }}
        onPress = {this.addBubble}
      >
      <View style={{flexDirection : 'row', alignSelf : 'center', justifyContent : 'center', alignItems : 'center',}}>
        <Text style={{color : '#fff', fontSize : 14, fontWeight : '500', margin : 3}}>
          {new_total}
          {'  '}
        </Text>
        <View style={{width : 40, height : 40, borderRadius : 40, padding : 0, backgroundColor : reacted ? '#rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
          <Text style={{fontSize : 28, textAlign : 'center',}}>{reaction_type.value}</Text>
        </View>
      </View>
      {
        this.renderBubbles()
      }
      </TouchableOpacity>
    );
  }
};

class Bubble extends React.Component{
  constructor(props){
    super(props);
  }

  state = {
    yPos : new Animated.Value(0),
    opacity : new Animated.Value(0)
  }

  componentDidMount(){
    Animated.parallel([
      Animated.timing(this.state.yPos, {
        toValue : -80,
        duration : 500
      }),
      Animated.timing(this.state.opacity, {
        toValue : 1,
        duration : 500
      })
    ]).start(()=>{
      Animated.timing(this.state.opacity, {
        toValue : 0,
        duration : 800
      }).start(()=>{
          // setTimeout(()=>{
          //   this.props.onFinishAnimation(this.props.index);
          // }, 500); 
      });
    });
  }
  
  render(){
    const {value} = this.props;
    let animationStyle = {
      transform : [{translateY : this.state.yPos}],
      opacity : this.state.opacity
    }

    return(
      <Animated.View
        style = {[
          {
            position : 'absolute',
            backgroundColor : 'rgba(255, 255, 255, 0.4)',
            width : 50,
            bottom : 0,
            right : 0,
            height : 50,
            justifyContent : 'center',
            alignItems : 'center',
            borderRadius : 50,
          },
          animationStyle
        ]}
      >
          <View style={{width : 30, height : 30, borderRadius : 40, padding : 0, justifyContent : 'center', alignItems : 'center'}}>
            <Text style={{fontSize : 22, textAlign : 'center',}}>{value.reaction_type.value}</Text>
          </View>
          <Text style={{fontSize : 12, color : '#333', textAlign : 'center'}}>
            {'+'}
            {value.count}
          </Text>
      </Animated.View>
    );
  }
}

export default ReactButton;
