import Vue from "vue";
import axios from "axios";
import {Message} from "element-ui";

Vue.prototype.$http = axios;
// 统一方式添加token
// axios.defaults.headers['Authorization'] = `Bearer ${token}`
axios.interceptors.request.use(config => {
  try {
    console.log("request请求拦截...");
    return config;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
    response => {
      /**
       * code为非200是抛错 可结合自己业务进行修改
       */
      const res = response.data
      // debugger
      if (res.code !== 200) {
        return Promise.reject('error')
      } else {
        return response.data
      }
    },
    error => {
      console.log('err' + error) // for debug
      return Promise.reject(error)
    }
);