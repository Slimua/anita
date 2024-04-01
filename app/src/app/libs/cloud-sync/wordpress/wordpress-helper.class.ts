import { CloudSyncBase, SupportedCloud } from 'app/libs/cloud-sync/cloud-sync-base.class'

/**
 * API reference: Anita Project Manager Wordpress plugin
 */

export interface IWordPressAuthData {
  accessToken: string
  refreshToken: string
  remoteBaseUrl: string
}

export class WordpressHelper extends CloudSyncBase<SupportedCloud.WORDPRESS> {
  public static instance: WordpressHelper

  public static init (): WordpressHelper {
    WordpressHelper.instance = new WordpressHelper()
    return WordpressHelper.instance
  }

  private BASE_URL: string = ''

  constructor () {
    super(SupportedCloud.WORDPRESS)
    CloudSyncBase.initDB()
    this.setBaseUrl()
  }

  public async getAccessTokenFromCode (code: string) {
    const authData: IWordPressAuthData = JSON.parse(atob(code))
    if (authData.accessToken && authData.refreshToken) {
      this.storeDataForService(authData)
    }
  }

  private setBaseUrl () {
    const base = `${window.location.origin}/`
    this.BASE_URL = window.location.href.includes('localhost') ? base : `${base}app/`
  }
}
