import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://silly-tereshkova.173-208-164-34.plesk.page',
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
