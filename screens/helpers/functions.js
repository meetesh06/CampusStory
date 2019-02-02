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
