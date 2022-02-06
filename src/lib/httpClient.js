import axios from 'axios'

// use env in production
const API_URL = process.env.REACT_APP_API_URL || 'https://api.thecatapi.com/v1/'
const API_KEY = process.env.REACT_APP_API_KEY || 'YOUR_KEY'

console.log(process.env)

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        config.baseURL = API_URL

        // headers
        // was axios.defaults.headers.common['x-api-key'] = 'KEY'
        config.headers['x-api-key'] = API_KEY

        return config
    },
    /* istanbul ignore next */
    (error) => {
        return Promise.reject(error)
    }
)

export const httpClient = axios
export default axios
