import Realm from 'realm';

let realmdb = null;

const Events = {
  name: 'Events',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string?',
    college: 'string',
    reach: 'string',
    views: 'string',
    enrollees: 'string',
    timestamp: 'date',
    title: 'string',
    ms: 'int',
    description: 'string',
    location: 'string',
    category: 'string',
    date: 'date',
    time: 'date',
    channel_name: 'string',
    contact_details: 'string',
    faq: 'string',
    audience: 'string',
    channel: 'string',
    interested: 'bool?',
    going: 'bool?',
    remind: 'bool?',
    media: 'string',
    reg_link: 'string',
  }
};
const Channels = {
  name: 'Channels',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    priority: 'string?',
    name: 'string',
    media: 'string',
    followers: 'string',
    description: 'string',
    creator: 'string',
    private : 'bool?',
    category: 'string',
    subscribed: 'string',
    college: 'string',
    social_link : 'string?',
    reactions : 'string',
    updates: 'bool?'
  }
};

const Firebase = {
  name: 'Firebase',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    notify: 'bool?',
    type: 'string',
    private : 'bool?'
  }
};

const Notifications = {
  name: 'Notifications',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type: 'string',
    timestamp: 'date',
    message: 'string',
    audience: 'string'
  }
};

const Activity = {
  name: 'Activity',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    reach: 'string',
    views: 'string',
    reactions : 'string',
    my_reactions : 'string?',
    type: 'string',
    timestamp: 'date',
    channel: 'string',
    channel_name: 'string',
    audience: 'string',
    message: 'string',
    email: 'string',
    category: 'string',
    config : 'string?',
    reaction_type : 'string',
    media: 'string',
    read: 'bool?',
    hashtag : 'string?',
    url : 'string?',
    event : 'string?'
  }
};

export default {
  getRealm: (callback) => {
    if (realmdb === null) {
      return Realm.open({
        schema: [Firebase, Events, Activity, Channels, Notifications],
        deleteRealmIfMigrationNeeded: true
      })
        .then((realm) => {
          realmdb = realm;
          callback(realmdb);
        });
    }
    callback(realmdb);
    return true;
  }
};
