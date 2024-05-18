import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { CloudSyncBase, SupportedCloud } from 'app/cross-refs-exports'
import { CloudSyncTable } from 'app/libs/cloud-sync/cloud-sync.const'
import { WordPressClient } from 'app/libs/cloud-sync/wordpress/wordpress-client.class'
import { IWordPressRemoteInfo } from 'app/libs/cloud-sync/wordpress/wordpress.const'
import { Bucket } from 'app/state/bucket.state'
import { ModalState } from 'app/state/modal/modal-state.class'
import { SyncStateAtoms } from 'app/state/sync/sync-state.atoms'
import { SyncState } from 'app/state/sync/sync-state.class'
import { liveQuery } from 'dexie'

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
    this.watchRemotesChanges()
  }

  private watchRemotesChanges = () => {
    liveQuery(() => CloudSyncBase.getDB().table<IWordPressRemoteInfo>(CloudSyncTable.REMOTES_INFO).toArray())
      .subscribe((remotes) => {
        SyncState.setWordPressRemotes(remotes)
        const remoteIds = remotes.map(remote => remote.remoteId)
        Bucket.general.set(SyncStateAtoms.wordPressRemotesIds, remoteIds)
      })
  }

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
      ModalState.showModal({
        isOpen: true,
        title: 'Authentication error',
        hideCancelButton: true,
        type: Type.primary,
        actionText: 'Open login page',
        children: `There is an issue with the your authentication data. Please re-authenticate on ${remoteId}.`,
        handleClickAction: () => window.open(`https://${remoteId}/index.php?anita_oauth=1`)
      })
      return
    }
    return new WordPressClient(authData)
  }
}
