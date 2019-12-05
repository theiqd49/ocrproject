import axios from 'axios';
import { AsyncStorage } from 'react-native';

let url = "http://192.168.0.5:5000";


const instance = axios.create({
  baseURL: url
});

instance.interceptors.request.use(
  async config => {
    const cookie = await AsyncStorage.getItem('cookie');
    if (cookie) {
      config.headers.Authorization = `Bearer ${cookie}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default instance;
