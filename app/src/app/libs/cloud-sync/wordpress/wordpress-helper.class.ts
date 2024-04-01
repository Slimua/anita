import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { IModalProps } from 'app/components/shared-components/modals/modal.component'
import { CloudSyncBase, SupportedCloud } from 'app/libs/cloud-sync/cloud-sync-base.class'
import { WordPressClient } from 'app/libs/cloud-sync/wordpress/wordpress-client.class'

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

  private clientsByRemote: Record<string, InstanceType<typeof WordPressClient>> = {}

  constructor () {
    super(SupportedCloud.WORDPRESS)
    CloudSyncBase.initDB()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAccessTokenFromCode (code: string, showModal: (modalProps: IModalProps) => void) {
    const unencodedData = atob(code)
    const authData: IWordPressAuthData = JSON.parse(unencodedData)
    if (authData.access_token && authData.refresh_token) {
      this.storeDataForService(authData)
      this.clientsByRemote[authData.remoteBaseUrl] = new WordPressClient(authData)
      try {
        const res = await this.clientsByRemote[authData.remoteBaseUrl].getSpaceInfo()
        console.log('getAccessTokenFromCode ~ res:', res)
        if (res?.message === 'Token tampered') {
          showModal({
            isOpen: true,
            title: 'Error',
            hideCancelButton: true,
            type: Type.primary,
            actionText: 'OK',
            children: 'Token tampered'
          })
        }
      } catch (error: unknown) {
        console.error('Error getting space info:', error)
      }
    }
  }
}
