import {
  AsyncStorage
} from 'react-native';
import Constants from './constants';
import axios from 'axios';

const {
  SET_UP_STATUS,
  COLLEGE,
  INTERESTS,
  TOKEN,
  MUTED,
  CONFIG,
  UPDATES,
  VIEWS,
  VISITS
} = Constants;

export default class SessionStore {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
        return instance;
    }
    this.constructor.instance = this;
  }

  state = {
    [MUTED] : false,
    [TOKEN] : 'something',
    [CONFIG] : {},
    [SET_UP_STATUS] : '',
    [COLLEGE] : '',
    [INTERESTS] : '',
    [UPDATES] : [],
    [VIEWS] : [],
    [VISITS] : []
  }

  getValueFromStore = async (key)=>{
    let value = await AsyncStorage.getItem(key);
    return value;
  }

  getValue = (key) =>{
    return this.state[key];
  }

  putValue = (key, value) =>{
    this.state[key] = value;
  }

  putInStore = async (key, value) =>{
    await AsyncStorage.setItem(key, '' + value);
  }

  format = (obj) =>{
    let res = [];
    let keys = Object.keys(obj);
    for(var i=0; i<keys.length; i++){
      res.push({_id : keys[i], count : obj[keys[i]].length})
    }
    return res;
  }

  getValueBulk = async () =>{ // ['key1', 'key2']
    let keys = Object.keys(this.state);
    let resArrays = await AsyncStorage.multiGet(keys);
    for(var i=0; i< resArrays.length; i++){
      this.state['' + resArrays[i][0]] = JSON.parse(resArrays[i][1]);
    }
  }

  setValueBulk = async () =>{ // [['key', value], ['key2', value]]
    console.log('PUSHING');
    let arr = [];
    let keys = Object.keys(this.state);
    for(var i=0; i<keys.length; i++){
      arr.push([keys[i], JSON.stringify(this.state[keys[i]])]);
    }
    await AsyncStorage.multiSet(arr);
    console.log('PUSHING');
    this.publishUpdates();
    this.publishViews();
    this.publishVisits();
    console.log('DONE');
  }

  publishUpdates = () =>{
    const formData = new FormData();
    formData.append('activity_list', JSON.stringify(this.state[UPDATES]));
    axios.post('https://www.mycampusdock.com/channels/update-read', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': this.state[TOKEN]
      }
    }).then((response) => {
    }).catch(err => console.log(err));
  }

  publishViews = () =>{
    const formData = new FormData();
    const views = this.format(this.state[VIEWS]);
    formData.append('views', views);
    console.log(views);
    axios.post('https://www.mycampusdock.com/channels/update-story-views', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': this.state[TOKEN]
      }
    }).then((response) => {
      console.log(response)
    }).catch(err => console.log(err));
  }

  publishVisits = () =>{
    const formData = new FormData();
    const visits = this.format(this.state[VISITS]);
    console.log(visits);
    formData.append('visits', visits);
    axios.post('https://www.mycampusdock.com/channels/update-channel-visits', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': this.state[TOKEN]
      }
    }).then((response) => {
      console.log(response)
    }).catch(err => console.log(err));
  }

  pushViews = (channel, element_id) =>{
    let updates = this.state[VIEWS] === undefined || this.state[VIEWS] === null ? {} : this.state[VIEWS];
    const c = updates[channel];
    if(c === undefined){
      updates[channel] = [];
    }
    if(updates[channel].indexOf(element_id) === -1){
      updates[channel].push(element_id);
    }
    this.state[VIEWS] = updates;
  }

  pushVisits = (channel, element_id) =>{
    let updates = this.state[VISITS] === null || this.state[VISITS] === undefined ? {} : this.state[VISITS];
    const c = updates[channel];
    if(c === undefined){
      updates[channel] = [];
    }
    if(updates[channel].indexOf(element_id) === -1){
      updates[channel].push(element_id);
    }
    this.state[VISITS] = updates;
  }

  pushUpdate = (element) =>{
    let updates = this.state[UPDATES] === null || this.state[UPDATES] === undefined ? [] : this.state[UPDATES];
    if(updates.indexOf(element) === -1){
      updates.push(element);
    }
    this.state[UPDATES] = updates;
  }
};