import { IWordPressSpaceInfo } from 'app/libs/cloud-sync/wordpress/wordpress.const'
import { TAnitaUniversalDataStorage, TSystemData } from 'app/models/project/project.declarations'
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
        return Promise.resolve({ statusText: 'rest_token_tampered' })
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

  public async getProjects (): Promise<Array<TAnitaUniversalDataStorage> | null> {
    try {
      const response = await this.axiosInstance.get<Array<TAnitaUniversalDataStorage>>('get-projects')
      return response.data || null
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  public async getProjectById (projectId: string): Promise<TAnitaUniversalDataStorage | null> {
    try {
      const response = await this.axiosInstance.get<TAnitaUniversalDataStorage>(`get-project/${projectId}`)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching project with ID ${projectId}:`, error)
      throw error
    }
  }

  public async saveProject (projectData: TSystemData | TAnitaUniversalDataStorage): Promise<void> {
    try {
      const response = await this.axiosInstance.post('save-project', projectData)
      console.log('Project saved successfully:', response.data)
    } catch (error) {
      console.error('Error saving project:', error)
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

  public async saveSectionElement (projectId: string, sectionId: string, elementId: string, elementData: any): Promise<void> {
    try {
      const response = await this.axiosInstance.post('save-section-element', {
        projectId,
        sectionId,
        elementId,
        element: elementData
      })
      console.log('Section element saved successfully:', response.data)
    } catch (error) {
      console.error('Error saving section element:', error)
      throw error
    }
  }

  public async deleteSectionElement (projectId: string, sectionId: string, elementId: string): Promise<void> {
    try {
      const response = await this.axiosInstance.delete('delete-section-element', {
        data: {
          projectId,
          sectionId,
          elementId
        }
      })
      console.log('Section element deleted successfully:', response.data)
    } catch (error) {
      console.error('Error deleting section element:', error)
      throw error
    }
  }
}
