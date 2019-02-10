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
  UPDATES
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
    [UPDATES] : []
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

  getValueBulk = async () =>{ // ['key1', 'key2']
    let keys = Object.keys(this.state);
    let resArrays = await AsyncStorage.multiGet(keys);
    for(var i=0; i< resArrays.length; i++){
      this.state['' + resArrays[i][0]] = JSON.parse(resArrays[i][1]);
    }
  }

  setValueBulk = async () =>{ // [['key', value], ['key2', value]]
    let arr = [];
    let keys = Object.keys(this.state);
    for(var i=0; i<keys.length; i++){
      arr.push([keys[i], JSON.stringify(this.state[keys[i]])]);
    }
    await AsyncStorage.multiSet(arr);
    if(this.state[UPDATES] && this.state[UPDATES].length > 0){
      this.publishUpdates();
    }
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
      console.log('UPDATES', response);
    }).catch(err => console.log(err));
  }

  pushUpdate = (element) =>{
    let updates = this.state[UPDATES] === null ? [] : this.state[UPDATES];
    if(updates.indexOf(element) === -1){
      console.log('ITEM ADDED');
      updates.push(element);
    }
  }
};