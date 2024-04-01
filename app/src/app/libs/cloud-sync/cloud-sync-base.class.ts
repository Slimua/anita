import { Manager } from 'app/libs/manager/manager.class'
import { DateTools } from 'app/libs/tools/date-tools.class'
import Dexie from 'dexie'
import { IWordPressAuthData } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { IDropboxTokens } from './cloud-sync.const'

const DB_VERSION = 4

export enum SupportedCloud {
  DROPBOX = 'dropbox',
  WORDPRESS = 'wordpress'
}

interface IAccountsTableForDropbox extends IDropboxTokens {
  service: SupportedCloud
}

interface IAccountsTableForWordpress extends IWordPressAuthData {
  service: SupportedCloud
}

type TDataForTable<T extends SupportedCloud> = T extends SupportedCloud.DROPBOX ? IDropboxTokens : IWordPressAuthData

type TAccountsTable<T extends SupportedCloud> = T extends SupportedCloud.DROPBOX ? IAccountsTableForDropbox : IAccountsTableForWordpress

enum CloudSyncTable {
  ACCOUNTS = 'accounts',
  SYNC_INFO = 'syncInfo',
  FILES_INFO = 'filesInfo'
}

interface ICloudSyncDB<T extends SupportedCloud> {
  [CloudSyncTable.ACCOUNTS]: TAccountsTable<T>
  [CloudSyncTable.SYNC_INFO]: {
    projectId: string
    lastSync: string
  }
  [CloudSyncTable.FILES_INFO]: {
    projectId: string
    fileId: string
  }
}

export class CloudSyncBase<T extends SupportedCloud> {
  private static DB: Dexie | undefined
  constructor (
    private service: T
  ) { }

  public static getDB (): Dexie {
    CloudSyncBase.initDB()
    return CloudSyncBase.DB!
  }

  public async getLinkedFileIdOrNull (projectId: string | undefined): Promise<string | null> {
    if (!projectId) {
      return null
    }
    CloudSyncBase.initDB()
    return (await CloudSyncBase.DB!.table<ICloudSyncDB<SupportedCloud.DROPBOX>['filesInfo']>(CloudSyncTable.FILES_INFO).get({ projectId }))?.fileId ?? null
  }

  protected async setRemoteId (remoteId: string) {
    const currentProject = Manager.getCurrentProject()

    if (!currentProject) {
      return
    }
    await CloudSyncBase.DB!.table<ICloudSyncDB<SupportedCloud.DROPBOX>['filesInfo']>(CloudSyncTable.FILES_INFO).put({ projectId: currentProject.getId(), fileId: remoteId })
    Manager.loadProjectById(currentProject.getId())
  }

  public static async clearRemoteId (projectId: string) {
    await CloudSyncBase.DB!.table<ICloudSyncDB<SupportedCloud.DROPBOX>['filesInfo']>(CloudSyncTable.FILES_INFO).delete(projectId)
  }

  protected static initDB () {
    if (!CloudSyncBase.DB) {
      CloudSyncBase.DB = new Dexie('CloudSync')
      CloudSyncBase.DB.version(DB_VERSION).stores({
        [CloudSyncTable.ACCOUNTS]: 'service',
        [CloudSyncTable.SYNC_INFO]: 'projectId',
        [CloudSyncTable.FILES_INFO]: 'projectId'
      })
    }
  }

  protected storeDataForService (data: TDataForTable<T>) {
    return CloudSyncBase.DB!.table<ICloudSyncDB<T>['accounts']>(CloudSyncTable.ACCOUNTS).put({ ...data, service: this.service } as TAccountsTable<T>)
  }

  protected getDataForService (): Promise<ICloudSyncDB<T>['accounts'] | undefined> {
    return CloudSyncBase.DB!.table<ICloudSyncDB<T>['accounts']>(CloudSyncTable.ACCOUNTS).get({ service: this.service })
  }

  public async setLastSync (projectId: string) {
    return CloudSyncBase.DB!.table<ICloudSyncDB<T>['syncInfo']>(CloudSyncTable.SYNC_INFO).put({ projectId, lastSync: DateTools.getUtcIsoString() })
  }

  public static async getLastSync <T extends SupportedCloud> (projectId: string): Promise<string | undefined> {
    return (await CloudSyncBase.DB!.table<ICloudSyncDB<T>['syncInfo']>(CloudSyncTable.SYNC_INFO).get({ projectId }))?.lastSync
  }

  public static async deleteLastSync <T extends SupportedCloud> (projectId: string): Promise<void> {
    return CloudSyncBase.DB!.table<ICloudSyncDB<T>['syncInfo']>(CloudSyncTable.SYNC_INFO).delete(projectId)
  }
}
