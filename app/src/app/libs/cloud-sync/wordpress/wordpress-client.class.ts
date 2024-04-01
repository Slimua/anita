import axios, { AxiosInstance } from 'axios'

interface IWordPressAuthData {
  access_token: string
  refresh_token: string
  remoteBaseUrl: string
}

export class WordPressClient {
  private axiosInstance: AxiosInstance
  private authData: IWordPressAuthData

  constructor (authData: IWordPressAuthData) {
    this.authData = authData
    this.axiosInstance = axios.create({
      baseURL: `${this.authData.remoteBaseUrl}/wp-json/anita-api/v1/`
    })

    this.axiosInstance.interceptors.request.use((config) => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.authData.access_token}`
      } as any
      return config
    }, (error) => Promise.reject(error))

    this.axiosInstance.interceptors.response.use((response) => response, async (error) => {
      if (error.response?.data?.code === 'rest_token_tampered') {
        return Promise.resolve({ message: 'Token tampered' })
      }
      if (error.response?.data?.code === 'rest_token_expired') {
        /* originalRequest._retry = true
        const newAccessToken = await this.refreshAccessToken()
        this.authData.access_token = newAccessToken
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        return this.axiosInstance(originalRequest) */
      }
      return Promise.reject(error)
    })
  }

  private async refreshAccessToken (): Promise<string> {
    // Implement the logic to refresh the access token using the refresh_token
    // This is a placeholder implementation
    return Promise.resolve('new_access_token')
  }

  public async getSpaceInfo (): Promise<any> {
    try {
      const response = await this.axiosInstance.get('get-space-info')
      return response
    } catch (error) {
      console.error('Error fetching space info:', error)
      throw error
    }
  }
}
