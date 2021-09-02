import axios from 'axios'
import {Message, MessageBox} from 'element-ui'

// 创建axios实例
const service = axios.create({
    baseURL: "/api/webstore", // process.env.BASE_API, // api 的 base_url
    timeout: 20000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
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

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        console.log(response)
        const res = response.data
        // debugger
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
