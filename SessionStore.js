import {
  AsyncStorage
} from 'react-native';
import Constants from './constants';
import axios from 'axios';
import urls from './URLS';

const {
  SET_UP_STATUS,
  COLLEGE,
  INTERESTS,
  TOKEN,
  MUTED,
  CONFIG,
  UPDATES,
  VIEWS,
  VISITS,
  FIRST_TIME,
  USER_DATA,
  SESSION_ID,
  LOGS,
  TRACKS,
  APP_USAGE_TIME
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
    [FIRST_TIME] : true,
    [TOKEN] : 'something',
    [CONFIG] : {},
    [SET_UP_STATUS] : false,
    [COLLEGE] : '',
    [INTERESTS] : '',
    [SESSION_ID] : '',
    [USER_DATA] : {},
    temp : {
      [UPDATES] : [],
      [VIEWS] : [],
      [VISITS] : []
    }
  }

  temp = {
    [UPDATES] : [],
    [VIEWS] : [],
    [VISITS] : [],
    [APP_USAGE_TIME] : new Date().getTime(),
    [LOGS] : [],
    [TRACKS] : []
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

  getValueTemp = (key) =>{
    return this.temp[key];
  }

  putValueTemp = (key, value) =>{
    this.temp[key] = value;
  }

  putInStore = async (key, value) =>{
    await AsyncStorage.setItem(key, '' + value);
  }

  deleteFromStore = async (key) =>{
    await AsyncStorage.removeItem(key);
  }

  format = (obj, callback) =>{
    let res = [];
    let keys = Object.keys(obj);
    for(var i=0; i<keys.length; i++){
      res.push({_id : keys[i], count : obj[keys[i]].length})
      if(i==keys.length - 1){
        return callback(res);
      }
    }
  }

  reset = async () =>{
    this.state = {
      [MUTED] : false,
      [FIRST_TIME] : true,
      [TOKEN] : 'something',
      [CONFIG] : {},
      [SET_UP_STATUS] : false,
      [COLLEGE] : '',
      [USER_DATA] : {},
      [INTERESTS] : '',
      [SESSION_ID] : '',
      temp : {
        [UPDATES] : [],
        [VIEWS] : [],
        [VISITS] : []
      }
    }

    this.temp = {
      [UPDATES] : [],
      [VIEWS] : [],
      [VISITS] : [],
      [APP_USAGE_TIME] : new Date().getTime(),
      [LOGS] : [],
      [TRACKS] : []
    }
    await AsyncStorage.clear();
  }

  getValueBulk = async () =>{ // ['key1', 'key2']
    let keys = Object.keys(this.state);
    let resArrays = await AsyncStorage.multiGet(keys);
    for(var i=0; i< resArrays.length; i++){
      this.state['' + resArrays[i][0]] = JSON.parse(resArrays[i][1]);
    }
    this.temp[APP_USAGE_TIME] = new Date().getTime();
  }

  setSessionId = async () => {
    let session = this.state[SESSION_ID];
    const config = this.state[CONFIG] === null ? {} : this.state[CONFIG];
    const id = config._id;
    if(session === null || session === ''){
      if(this.state.temp === null){
        this.state.temp = {}
      }
      this.state.temp[UPDATES] = [];
      this.state.temp[VIEWS] = [];
      this.state.temp[VISITS] = [];
      this.state[SESSION_ID] =  id === undefined || id === null ? new Date().getTime().toString() + '@temp' : new Date().getTime().toString() + '@' + id
    } else {
      let cs = new Date().getTime();
      let ts = parseInt(session.split('@')[0]);
      let diff = (cs - ts);
      if(diff > (24 * 3600 * 1000)){
        await this.deleteFromStore(SESSION_ID);
        if(this.state.temp === null){
          this.state.temp = {}
        }
        this.state.temp[UPDATES] = [];
        this.state.temp[VIEWS] = [];
        this.state.temp[VISITS] = [];
        this.state[SESSION_ID] =  id === undefined || id === null ? new Date().getTime().toString() + '@temp' : new Date().getTime().toString() + '@' + id
      }
    }
  }

  setValueBulk = async () =>{ // [['key', value], ['key2', value]]
    let arr = [];
    let keys = Object.keys(this.state);
    for(var i=0; i<keys.length; i++){
      arr.push([keys[i], JSON.stringify(this.state[keys[i]])]);
    }
    await AsyncStorage.multiSet(arr);
    this.publishUpdates();
    this.publishViews();
    this.publishVisits();
    this.publishUserData();
    this.publishLogs();
    this.publishTracks();
  }

  publishUpdates = () =>{
    if(this.temp[UPDATES].length > 0){
      const formData = new FormData();
      this.temp[UPDATES] = [];
      formData.append('activity_list', JSON.stringify(this.temp[UPDATES]));
      axios.post(urls.UPDATE_READ, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state[TOKEN]
        }
      }).then((response) => {
        console.log('UPDATE', response)
      }).catch(err => {
        console.log(err)
      });
    }
  }

  publishViews = () =>{
    if(this.temp[VIEWS]!== null || this.temp[VIEWS] !== undefined){
      const formData = new FormData();
      this.format(this.temp[VIEWS], (views)=>{
        this.temp[VIEWS] = {}
        formData.append('views', JSON.stringify(views));
        formData.append('dummy', [{_id : 'something'}]);
        axios.post(urls.UPDATE_STORY_VIEWS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.state[TOKEN]
          }
        }).then((response) => {
          console.log('VIEWS', response);
        }).catch(err => console.log(err));
      });
    }
  }

  publishUserData = () =>{
    const formData = new FormData();
    formData.append(Constants.INTERESTS, this.getValue([INTERESTS]));
    formData.append(Constants.USER_DATA, JSON.stringify(this.getValue([USER_DATA])));
    formData.append('dummy', [{_id : 'something'}]);
    axios.post(urls.UPDATE_USER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': this.state[TOKEN]
      }
    }).then((response) => {
      console.log('USER',response);
    }).catch(err => {
      console.log(err)
    });
}

  publishVisits = () =>{
    if(this.temp[VISITS]!== null || this.temp[VISITS] !== undefined){
      const formData = new FormData();
      this.format(this.temp[VISITS], (visits)=>{
        this.temp[VISITS] = {}
        formData.append('visits', JSON.stringify(visits));
        formData.append('dummy', [{_id : 'something'}]);
        axios.post(urls.UPDATE_CHANNEL_VISITS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.state[TOKEN]
          }
        }).then((response) => {
          console.log('VISIT', response);
        }).catch(err => console.log(err));
      });
    }
  }

  publishLogs = () =>{
    if(this.temp[LOGS].length > 0){
      const formData = new FormData();
      this.temp[LOGS] = [];
      formData.append('logs', JSON.stringify(this.temp[LOGS]));
      formData.append('session_id', JSON.stringify(this.state[SESSION_ID]));
      formData.append('dummy', [{_id : 'something'}]);
      axios.post(urls.PUT_LOGS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state[TOKEN]
        }
      }).then((response) => {
        console.log('LOGS',response);
      }).catch(err => console.log(err));
    }
  }

  publishTracks = () =>{
    if(this.temp[TRACKS].length > 0){
      const formData = new FormData();
      this.temp[TRACKS] = [];
      formData.append('logs', JSON.stringify(this.temp[TRACKS]));
      formData.append('session_id', JSON.stringify(this.state[SESSION_ID]));
      formData.append('dummy', [{_id : 'something'}]);
      axios.post(urls.PUT_TRACKS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state[TOKEN]
        }
      }).then((response) => {
        console.log('TRACKS', response);
      }).catch(err => console.log(err));
    }
  }

  pushViews = (channel, element_id) =>{
    let updates = this.temp[VIEWS] === undefined || this.temp[VIEWS] === null ? {} : this.temp[VIEWS];
    let updates_reserve = this.state.temp[VIEWS] === undefined || this.state.temp[VIEWS] === null ? {} : this.state.temp[VIEWS];
    const c = updates[channel];
    const cr = updates_reserve[channel];
    if(c === undefined){
      updates[channel] = [];
    }
    if(cr === undefined){
      updates_reserve[channel] = [];
    }
    if(updates_reserve[channel].indexOf(element_id) === -1){
      updates[channel].push(element_id);
      updates_reserve[channel].push(element_id);
    }
    this.temp[VIEWS] = updates;
    this.state.temp[VIEWS] = updates_reserve;
  }

  pushVisits = (channel, element_id) =>{
    let updates = this.temp[VISITS] === undefined || this.temp[VISITS] === null ? {} : this.temp[VISITS];
    let updates_reserve = this.state.temp[VISITS] === undefined || this.state.temp[VISITS] === null ? {} : this.state.temp[VISITS];
    const c = updates[channel];
    const cr = updates_reserve[channel];
    if(c === undefined){
      updates[channel] = [];
    }
    if(cr === undefined){
      updates_reserve[channel] = [];
    }
    if(updates_reserve[channel].indexOf(element_id) === -1){
      updates[channel].push(element_id);
      updates_reserve[channel].push(element_id);
    }
    this.temp[VISITS] = updates;
    this.state.temp[VISITS] = updates_reserve;
  }

  pushUpdate = (element) =>{
    let updates = this.temp[UPDATES] === null || this.temp[UPDATES] === undefined ? [] : this.temp[UPDATES];
    let updates_reserve = this.state.temp[UPDATES] === null || this.state.temp[UPDATES] === undefined ? [] : this.state.temp[UPDATES];
    if(updates_reserve.indexOf(element) === -1){
      updates_reserve.push(element);
      updates.push(element);
    }
    this.temp[UPDATES] = updates;
    this.state.temp[UPDATES] = updates_reserve;
  }

  pushLogs = (element) =>{
    let logs = this.temp[LOGS] === null || this.temp[LOGS] === undefined ? [] : this.temp[LOGS];
    logs.push(element);
    this.temp[LOGS] = logs;
  }

  pushTrack = (element) =>{
    let logs = this.temp[TRACKS] === null || this.temp[TRACKS] === undefined ? [] : this.temp[TRACKS];
    logs.push(element);
    this.temp[TRACKS] = logs;
  }
};