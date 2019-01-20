import Realm from 'realm';

var realmdb = null;

const Events = {
  name: 'Events',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string',
    name: 'string',
    college: 'string',
    reach: 'string',
    views: 'string',
    enrollees: 'string',
    timestamp: 'date',
    title: 'string',
    description: 'string',
    location: 'string',
    category: 'string',
    tags: 'string',
    reg_start: 'date',
    reg_end: 'date',
    date: 'date',
    contact_details: 'string',
    faq: 'string',
    price: 'string',
    available_seats: 'string',
    audience: 'string',
    channel: 'string',
    media: 'string'
  }
};
const Channels = {
  name: 'Channels',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    priority: 'string',
    name: 'string',
    media: 'string',
    followers: 'string',
    description: 'string',
    creator: 'string',
    channel_already: 'string',
    category_found: 'string',
    category: 'string',
    recommended: 'string',
    subscribed: 'string',
    college: 'string',
    updates: 'string'
  }
};

const Firebase = {
  name: 'Firebase',
  primaryKey: '_id',
  properties: {
    _id:  'string',
    notify: 'string',
    channel: 'string'
  }
}

const Activity = {
  name: 'Activity',
  primaryKey: '_id',
  properties: {
    _id:  'string',
    reach: 'string',
    views: 'string',
    type: 'string',
    timestamp: 'date',
    channel: 'string',
    audience: 'string',
    message: 'string',
    email: 'string',
    name: 'string',
    // poll specific
    poll_type: 'string',
    options: 'string',
    // poll data
    answered: 'string',
    // post-image, post-video specific
    media:  'string',
    // stuff
    read:  'string'
  }
};

export default {
  getRealm: (callback) => { 
    if(realmdb === null) {
      return Realm.open({schema: [Firebase, Events, Activity, Channels], deleteRealmIfMigrationNeeded: true })
        .then(realm => {
          realmdb = realm;
          callback(realmdb);
        });
    } else {
      callback(realmdb);
    }
  }
};