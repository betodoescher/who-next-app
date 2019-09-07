import axios from 'axios'
import config from './../config'

export default {
  async getNextUsers (data) {
    const users = await axios
      .post(config.serverURI + '/users_next', data)
      .then((response) => {
        return response.data
      })

    return users
  },
  post (username) {
    return axios.post(`${config.serverURI}/users`, {
      username: username
    })
  },
  locationUser (username) {
    return axios.get(`${config.serverURI}/locationuser/${username}`)
  }
}
