import axios from 'axios'
import config from './../config'

export default {
  post (data) {
    return axios.post(`${config.serverURI}/chats`, data)
  }
}
