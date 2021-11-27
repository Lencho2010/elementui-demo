import axios from "axios";
import { Message, MessageBox } from "element-ui";

const env = Object.is(process.env.NODE_ENV, "production");

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 20000 // 请求超时时间
});

// request拦截器
// 统一方式添加token
// axios.defaults.headers['Authorization'] = `Bearer ${token}`
service.interceptors.request.use(config => {
  try {
    /*if (config.url = "/user/login") return config;
    let token = sessionStorage.getItem("token");
    console.log(token);
    if (!token) {
      console.log("登录");
      return Promise.reject("用户未登录");
    }
    config.headers.token = `${token}`;
    console.log(config.headers.token);
    console.log(config);*/
    return config;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}, error => {
  return Promise.reject(error);
});

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    if (response.data instanceof Blob) {
      return Promise.resolve(response)
    }

    const res = response.data;
    // debugger
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: "error",
        duration: 3 * 1000
      });
      return Promise.reject("error");
    } else {
      return response.data;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
