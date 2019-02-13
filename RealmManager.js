import Realm from './realm';

export default class RealmManager {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
        return instance;
    }
    this.constructor.instance = this;

    Realm.getRealm((realm) => {
      this.realm = realm;
    });
  }

  processRealmObj = (RealmObject, callback)=>{
    this.process_one(RealmObject, (result)=>{
      // console.log('Realm Processed Result 1', result);
    });
    this.process_two(RealmObject, (result)=>{
      //console.log('Realm Processed Result 2', result);
      callback(result);
    });
  }

  process_one = (RealmObject, callback) =>{
    let result = [];
    result = Object.keys(RealmObject).map(key => RealmObject[key]._id);
    callback(result);
  }

  process_two = (RealmObject, callback) =>{
    const result = Object.keys(RealmObject).map(key => ({ ...RealmObject[key] }));
    callback(result);
  }

  /*
    * example conditions_array : ['condition_one = "false"', 'condition_two = "true"']
    * example ClassName : 'Channels'
    * sort_field_name : null OR 'date'
    * reverse : true or false
    * callback : to get result array
  */
  getItems = (conditions_array, ClassName, sort_field_name, reverse, callback)=>{
    let realm_obj = this.realm.objects(ClassName);
    for(var i=0; i<conditions_array.length; i++){
      realm_obj = realm_obj.filtered(conditions_array[i]);
    }
    if(sort_field_name !== null){
      realm_obj = realm_obj.sorted(sort_field_name, reverse);
    }
    this.processRealmObj(realm_obj, callback);
  }

  /*
    * example id : 'Qwerty123'
    * example ClassName : 'Channels'
    * callback : to get result or null
  */
  getItemById = (id, ClassName, callback)=>{
    this.getItems([`_id="${id}"`], ClassName, null, false, (result)=>{
      if(result.length > 0) callback(result[0]);
      else callback(null);
    });
  }

  /*
    * example item : {name : 'Qweerty', value : '123'}
    * example ClassName : 'Channels'
    * should_update : true OR false
  */
  putItem = (item, ClassName, should_update) =>{
    this.realm.write(()=>{
      this.realm.create(ClassName, item, should_update);
    });
  }

  /*
    * example items_array : [{name : 'Qweerty', value : '123'}, {name : 'Asdf', value : '890'}]
    * example ClassName : 'Channels'
    * should_update : true OR false
    * callback : to know when execution done
  */
  putItems = (items_array, ClassName, should_update, callback)=>{
    this.realm.write(()=>{
      for(var i=0; i< items_array.length; i++){
        this.realm.create(ClassName, items_array[i], should_update);
      }
    });
    callback();
  }
};