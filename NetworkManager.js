import axios from 'axios';

export default class NetworkManager {
    constructor() {
      const instance = this.constructor.instance;
      if (instance) {
          return instance;
      }
      this.constructor.instance = this;
    }

    post = (url, formData, headers, context, callback) =>{
        formData.append('dummy', '');
        axios.post(url, formData, headers).then((response)=>{
            callback(response);
        }).catch((err)=>{
            callback(null);
            console.log(err, context);
        });
    }
}