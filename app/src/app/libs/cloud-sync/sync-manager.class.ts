/* eslint-disable eqeqeq */
import { EDITOR_MODE } from 'app/components/editor-mode.enum'
import { Manager, SupportedCloud } from 'app/cross-refs-exports'
import { LOCAL_STORAGE_SYSTEMS } from 'app/data/local-dbs/local-storage-systems.enum'
import { CloudSyncState } from 'app/libs/cloud-sync/cloud-sync.const'
import { RemoteAndLocalMerger } from 'app/libs/cloud-sync/remote-and-local-merger.class'
import { WordpressHelper } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { RESERVED_AUDS_KEYS, TSystemData } from 'app/models/project/project.declarations'
import { ISectionElement } from 'app/models/section-element/section-element.declarations'
import { SyncState } from 'app/state/sync/sync-state.class'

export interface ISyncWithRemoteOrLocalAddProjectProps {
  mode: EDITOR_MODE.add
  type: 'project'
  systemData: TSystemData
}

export interface ISyncWithRemoteOrLocalEditProjectProps {
  mode: EDITOR_MODE.edit
  type: 'project'
}

interface ISyncWithRemoteOrLocalDeleteProjectProps {
  mode: EDITOR_MODE.delete
  type: 'project'
  projectId: string
}

interface ISyncWithRemoteOrLocalAddOrEditElementSectionProps {
  mode: EDITOR_MODE.add | EDITOR_MODE.edit
  type: 'element'
  projectId: string
  sectionId: string
  elementId: string
  elementData: ISectionElement
}

interface ISyncWithRemoteOrLocalDeleteElementSectionProps {
  mode: EDITOR_MODE.delete
  type: 'element'
  projectId: string
  sectionId: string
  elementId: string
}

type ISyncWithRemoteOrLocalProps = ISyncWithRemoteOrLocalAddProjectProps | ISyncWithRemoteOrLocalEditProjectProps | ISyncWithRemoteOrLocalDeleteProjectProps | ISyncWithRemoteOrLocalAddOrEditElementSectionProps | ISyncWithRemoteOrLocalDeleteElementSectionProps

export class SyncManager {
  public static syncWithRemoteOrLocal = async (props: ISyncWithRemoteOrLocalProps): Promise<void> => {
    const [remoteId, type] = SyncManager.getRemoteIdAndType(props)
    if (remoteId && type == SupportedCloud.WORDPRESS && props.mode === EDITOR_MODE.delete) {
      const projectIdForDelete = props.projectId
      const client = await WordpressHelper.instance.getClient(remoteId)
      if (client) {
        await client.deleteProject(projectIdForDelete)
      }
    } else if (remoteId && type == SupportedCloud.WORDPRESS && props.type === 'element') {
      const client = await WordpressHelper.instance.getClient(remoteId)
      const projectIdForElement = props.projectId
      const sectionIdForElement = props.sectionId
      const elementIdForElement = props.elementId
      if (!client) {
        // TODO handle no client
      } else if (props.mode === EDITOR_MODE.delete) {
        await client.deleteSectionElement(projectIdForElement, sectionIdForElement, elementIdForElement)
      } else {
        const elementDataForElement = props.elementData
        await client.saveSectionElement(projectIdForElement, sectionIdForElement, elementIdForElement, elementDataForElement)
      }
    } else if (remoteId) {
      await this.handleRemoteSync(remoteId, type)
    }
    SyncState.setIsSavingInFs(false)
  }

  private static getRemoteIdAndType = (props: ISyncWithRemoteOrLocalProps): [string, SupportedCloud] | [null, null] => {
    if (Manager.getCurrentProject()?.dropBoxSyncInfo.getLocalStorage() == LOCAL_STORAGE_SYSTEMS.IndexedDB && Manager.getCurrentProject()?.dropBoxSyncInfo.getLinkedFileId()) {
      const remoteId = Manager.getCurrentProject()?.dropBoxSyncInfo.getLinkedFileId()!
      return [remoteId, SupportedCloud.DROPBOX]
    }
    const remoteIdForWordPress = this.getRemoteIdForWordPress(props)
    if (remoteIdForWordPress) {
      return [remoteIdForWordPress, SupportedCloud.WORDPRESS]
    }
    return [null, null]
  }

  private static getRemoteIdForWordPress = (props: ISyncWithRemoteOrLocalProps): string | undefined => {
    if (props.mode === EDITOR_MODE.add && props.type === 'project') {
      return props.systemData[RESERVED_AUDS_KEYS._settings][0].remoteStorage
    }
    return Manager.getCurrentProject()?.getSettings().remoteStorage
  }

  private static handleRemoteSync = (remoteId: string, type: SupportedCloud): Promise<void> | undefined => {
    if (SyncManager.canStartSyncWithRemote()) {
      return new RemoteAndLocalMerger(remoteId, type).sync()
    }
  }

  private static canStartSyncWithRemote = (): boolean => (
    !SyncState.getIsSyncing() &&
    Manager.getCurrentProject()?.dropBoxSyncInfo.getCloudSyncState() === CloudSyncState.LINKED &&
    !!Manager.getCurrentProject()?.dropBoxSyncInfo.getLinkedFileId()
  )
}
