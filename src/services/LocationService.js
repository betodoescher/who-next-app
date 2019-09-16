import axios from 'axios'
import config from './../config'

export default {
  post (param) {
    return axios.post(`${config.serverURI}/locationuser`, param)
  }
}
