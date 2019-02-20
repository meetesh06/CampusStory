import Realm from '../../realm';
import SessionStore from '../../SessionStore';
import { goInitializing } from './Navigation';
import firebase from 'react-native-firebase';
import constants from '../../constants';

export function processRealmObj(RealmObject, callback) {
  const result = Object.keys(RealmObject).map(key => ({ ...RealmObject[key] }));
  callback(result);
}

export function processRealmObjRecommended(RealmObject, callback) {
  let result = [];
  // eslint-disable-next-line no-underscore-dangle
  result = Object.keys(RealmObject).map(key => RealmObject[key]._id);
  callback(result);
}
export function shuffleArray(array, callback) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  callback(array);
}
export function getMonthName(num) {
  switch (num) {
    case 1:
      return 'JAN';
    case 2:
      return 'FEB';
    case 3:
      return 'MAR';
    case 4:
      return 'APR';
    case 5:
      return 'MAY';
    case 6:
      return 'JUN';
    case 7:
      return 'JUL';
    case 8:
      return 'AUG';
    case 9:
      return 'SEP';
    case 10:
      return 'OCT';
    case 11:
      return 'NOV';
    case 12:
      return 'DEC';
    default:
      return 'FUCK';
  }
}

export function logout() {
  Realm.getRealm((realm) => {
    realm.write(() => {
      const subs = realm.objects('Firebase');
      processRealmObj(subs, (result)=>{
        arrObjToArray('_id', result, (output)=>{
          const store = new SessionStore();
          const cat = store.getValue(constants.INTERESTS);
          output.push(...cat);
          resetSubscriptions(output, async ()=>{
            realm.deleteAll();
            await store.setValueBulk();
            await store.reset();
            goInitializing();
          });
        });
      });
    });
  });
}

export function arrObjToArray(field, arrayObj, callback){
  let array = [];
  for(let i=0; i<arrayObj.length; i++){
    array.push(arrayObj[i][field])
  }
  callback(array);
}

export function resetSubscriptions(array, callback){
  for(let i=0; i<array.length; i++){
    firebase.messaging().unsubscribeFromTopic(array[i]);
  }
  callback();
}

export function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

export function formatDate(date) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
}

export function timelapse(date) {
  const cs = new Date().getTime();
  const ts = date.getTime();

  const diff = cs - ts;
  const sec = diff / 1000;
  if(sec > 60){
    const min = sec / 60;
    if(min > 60){
      const hour = min / 60;
      if(hour > 24){
        const day = hour / 24;
        return '' + Math.floor(day) + 'd';
      } else {
        return '' + Math.floor(hour) + 'h';
      }
    } else {
      return '' + Math.floor(min) + 'm';
    }
  } else {
    return '' + Math.floor(sec) + 's';
  }
}

export function getCategoryName(category) {
  switch (category) {
    case 'food':
      return 'Food';
    case 'mad':
      return 'Music and Dance';
    case 'art':
      return 'Art';
    case 'society':
      return 'Societies';
    case 'sports':
      return 'Sports';
    case 'fun':
      return 'Fun';
    default:
      return '';
  }
}
