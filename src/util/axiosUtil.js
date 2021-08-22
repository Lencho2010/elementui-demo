import Vue from "vue";
import axios from "axios";

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

axios.interceptors.response.use(response => {
  // console.log(response);
  return response;
}, error => {
  return Promise.reject(error);
});