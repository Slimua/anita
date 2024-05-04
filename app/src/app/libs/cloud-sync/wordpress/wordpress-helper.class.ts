import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { CloudSyncBase, SupportedCloud } from 'app/cross-refs-exports'
import { WordPressClient } from 'app/libs/cloud-sync/wordpress/wordpress-client.class'
import { ModalState } from 'app/state/modal.state'

/**
 * API reference: Anita Project Manager Wordpress plugin
 */

export interface IWordPressAuthData {
  access_token: string
  refresh_token: string
  remoteBaseUrl: string
}

export class WordpressHelper extends CloudSyncBase<SupportedCloud.WORDPRESS> {
  public static instance: WordpressHelper

  public static init (): WordpressHelper {
    WordpressHelper.instance = new WordpressHelper()
    return WordpressHelper.instance
  }

  constructor () {
    super(SupportedCloud.WORDPRESS)
    CloudSyncBase.initDB()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAccessTokenFromCode (code: string) {
    const unencodedData = atob(code)
    const authData: IWordPressAuthData = JSON.parse(unencodedData)
    if (authData.access_token && authData.refresh_token) {
      const cleanRemoteUrl = authData.remoteBaseUrl.replace('https://', '').replace('http://', '')
      this.storeDataForService(authData, cleanRemoteUrl)
      const client = new WordPressClient(authData)
      try {
        const res = await client.getSpaceInfo()
        console.log('getAccessTokenFromCode ~ res:', res)
        if (res.statusText === 'OK') {
          const remoteId = authData.remoteBaseUrl.replace(/(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '')
          this.saveRemoteInfo(remoteId, res.data)
        } else if (res?.statusText === 'Token tampered' || res?.statusText === 'Token expired') {
          ModalState.showModal({
            isOpen: true,
            title: 'Authentication error',
            hideCancelButton: true,
            type: Type.primary,
            actionText: 'Open login page',
            children: `There is an issue with the your authentication data. Please re-authenticate on ${cleanRemoteUrl}.`,
            handleClickAction: () => client.openLoginPage()
          })
        }
      } catch (error: unknown) {
        console.error('Error getting space info:', error)
      }
    }
  }

  public async getClient (remoteId: string): Promise<WordPressClient | undefined> {
    const authData = await this.getDataForService(remoteId)
    if (!authData) {
      // TODO show modal to re-authenticate
      return
    }
    return new WordPressClient(authData)
  }

  public fetchAllRemotes = async () => {
    const remotes = await this.getAllAccounts()
    if (remotes?.length) {
      for (const remote of remotes) {
        if (remote.service === SupportedCloud.DROPBOX) {
          continue
        }
        const client = await this.getClient(remote.service)
        if (client) {
          const projects = await client.getProjects()
          console.log('fetchAllRemotes= ~ projects:', projects.data)
        }
      }
    }
  }
}
