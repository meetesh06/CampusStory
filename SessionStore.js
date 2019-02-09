import {
  AsyncStorage
} from 'react-native';
import Constants from './constants';

const {
  SET_UP_STATUS,
  COLLEGE,
  INTERESTS,
  TOKEN,
  MUTED,
  CONFIG
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
    [INTERESTS] : ''
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
    console.log('State GET', this.state);
  }

  setValueBulk = async () =>{ // [['key', value], ['key2', value]]
    let arr = [];
    let keys = Object.keys(this.state);
    for(var i=0; i<keys.length; i++){
      arr.push([keys[i], JSON.stringify(this.state[keys[i]])]);
    }
    await AsyncStorage.multiSet(arr);
    console.log('State SET', this.state);
  }
};