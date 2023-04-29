import axios from 'axios';
import config from './../config'

class ApiClient {

  accessToken = null;
  onAccessTokenGeneratedCallback = null;

  constructor() {
    this.refreshAccessToken()
  }

  async post(path, data) {
    if (!this.accessToken) {
      await this.refreshAccessToken()
    }

    let res = await axios.post(this.generateUrl(path), data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })

    if (res.status === 401) {
      await this.refreshAccessToken()

      res = await axios.post(this.generateUrl(path), data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
    }

    return res;
  }

  async get(path) {
    if (!this.accessToken) {
      await this.refreshAccessToken()
    }

    let res = await axios.get(this.generateUrl(path), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })

    if (res.status === 401) {
      await this.refreshAccessToken()

      res = await axios.get(this.generateUrl(path), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
    }

    return res;
  }

  async refreshAccessToken() {

    const response = await axios.post(config.api.authUrl, 'grant_type=client_credentials&client_id=c0d65fdab0fd4603af5106d589204d77&client_secret=3ad85f2a72fc4dad844cd6952e4aa0c4', {
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    this.accessToken = response.data.access_token

    if (this.onAccessTokenGeneratedCallback) {
      this.onAccessTokenGeneratedCallback()
    }
  }

  generateUrl(path) {
    return `${config.api.baseUrl}${path}`
  }

  onAccessTokenGenerated(callback) {
    if (this.onAccessTokenGeneratedCallback !== null) {
      throw new Error('callback already assigned')
    }
    this.onAccessTokenGeneratedCallback = callback
  }
}

export default new ApiClient();
