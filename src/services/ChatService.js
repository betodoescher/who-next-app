import axios from 'axios'
import config from './../config'

export default {
  post (data) {
    return axios.post(`${config.serverURI}/chats`, data)
  },
  getChats (idOrigem, idDestino) {
    return axios.get(`${config.serverURI}/chats/origem/${idOrigem}/destino/${idDestino}`)
  },
  getChatsUsers (id) {
    return axios.get(`${config.serverURI}/chatsusers/${id}`)
  }
}
