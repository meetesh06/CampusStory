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
  }
};

export default {
  getRealm: (callback) => { 
    if(realmdb === null) {
      return Realm.open({schema: [Events, Activity], deleteRealmIfMigrationNeeded: true })
        .then(realm => {
          realmdb = realm;
          callback(realmdb);
        });
    } else {
      callback(realmdb);
    }
  }
};