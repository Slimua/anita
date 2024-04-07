import { IWordPressSpaceInfo } from 'app/libs/cloud-sync/wordpress/wordpress.const'
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
        console.log('this.axiosInstance.interceptors.response.use ~ error.response?.data:', error.response?.data)
        return Promise.resolve({ statusText: 'Token tampered' })
      }
      if (error.response?.data?.code === 'rest_token_expired') {
        /* originalRequest._retry = true
        const newAccessToken = await this.refreshAccessToken()
        this.authData.access_token = newAccessToken
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        return this.axiosInstance(originalRequest) */
      }
      // create custom error with response data
      if (error.response?.data?.message) {
        const errorMessage = `[${error.response.data.code}] ${error.response.data.message}`
        return Promise.reject(new Error(errorMessage))
      }
      return Promise.reject(error)
    })
  }

  private async refreshAccessToken (): Promise<string> {
    // Implement the logic to refresh the access token using the refresh_token
    // This is a placeholder implementation
    return Promise.resolve('new_access_token')
  }

  public openLoginPage (): void {
    window.open(`${this.authData.remoteBaseUrl}/index.php?anita_oauth=1`)
  }

  public async getSpaceInfo () {
    try {
      const response = await this.axiosInstance.get<IWordPressSpaceInfo>('get-space-info')
      return response
    } catch (error) {
      console.error('Error fetching space info:', error)
      throw error
    }
  }

  public async getProjects () {
    try {
      const response = await this.axiosInstance.get('get-projects')
      return response
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  public async createProject (projectData: any): Promise<void> {
    try {
      const response = await this.axiosInstance.post('create-project', projectData)
      console.log('Project created successfully:', response.data)
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  public async editProject (projectData: any): Promise<void> {
    try {
      const response = await this.axiosInstance.patch('edit-project', projectData)
      console.log('Project edited successfully:', response.data)
    } catch (error) {
      console.error('Error editing project:', error)
      throw error
    }
  }

  public async deleteProject (projectId: string): Promise<void> {
    try {
      const response = await this.axiosInstance.post('delete-project', { projectId })
      console.log('Project deleted successfully:', response.data)
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  public async addSectionElement (projectId: string, sectionId: string, elementId: string, elementData: any): Promise<void> {
    try {
      const response = await this.axiosInstance.put('add-section-element', {
        projectId,
        sectionId,
        elementId,
        element: elementData
      })
      console.log('Section element added successfully:', response.data)
    } catch (error) {
      console.error('Error adding section element:', error)
      throw error
    }
  }

  public async editSectionElement (projectId: string, sectionId: string, elementId: string, elementData: any): Promise<void> {
    try {
      const response = await this.axiosInstance.patch('edit-section-element', {
        projectId,
        sectionId,
        elementId,
        element: elementData
      })
      console.log('Section element edited successfully:', response.data)
    } catch (error) {
      console.error('Error editing section element:', error)
      throw error
    }
  }

  public async deleteSectionElement (projectId: string, sectionId: string, elementId: string): Promise<void> {
    try {
      const response = await this.axiosInstance.post('delete-section-element', {
        projectId,
        sectionId,
        elementId
      })
      console.log('Section element deleted successfully:', response.data)
    } catch (error) {
      console.error('Error deleting section element:', error)
      throw error
    }
  }
}
