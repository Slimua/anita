/* eslint-disable eqeqeq */
import { EDITOR_MODE } from 'app/components/editor-mode.enum'
import { Manager } from 'app/cross-refs-exports'
import { LOCAL_STORAGE_SYSTEMS } from 'app/data/local-dbs/local-storage-systems.enum'
import { CloudSyncState } from 'app/libs/cloud-sync/cloud-sync.const'
import { RemoteAndLocalMerger } from 'app/libs/cloud-sync/remote-and-local-merger.class'
import { IS_SAVING_IN_FS, IS_SYNCING } from 'app/libs/cloud-sync/sync-manager.const'
import { WordpressHelper } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { IProjectSettings, RESERVED_AUDS_KEYS, TSystemData } from 'app/models/project/project.declarations'
import { ISectionElement } from 'app/models/section-element/section-element.declarations'

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
  projectSettings: IProjectSettings
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
    console.log('syncWithRemoteOrLocal= ~ Manager.getCurrentProject()?.getSettings().remoteStorage:', Manager.getCurrentProject()?.getSettings().remoteStorage)
    if (Manager.getCurrentProject()?.dropBoxSyncInfo.getLocalStorage() == LOCAL_STORAGE_SYSTEMS.IndexedDB && EDITOR_MODE.delete !== props.mode) {
      await this.handleRemoteSync()
      return
    }
    const remoteStorageId = this.getRemoteStorageId(props)
    console.log('syncWithRemoteOrLocal= ~ remoteStorageId:', remoteStorageId)
    if (remoteStorageId) {
      this.handleWPSync(props, remoteStorageId)
    }
    IS_SAVING_IN_FS.next(false)
  }

  private static getRemoteStorageId = (props: ISyncWithRemoteOrLocalProps): string | undefined => {
    if (props.mode === EDITOR_MODE.add && props.type === 'project') {
      return props.systemData[RESERVED_AUDS_KEYS._settings][0].remoteStorage
    }
    if (props.mode === EDITOR_MODE.delete && props.type === 'project') {
      return props.projectSettings.remoteStorage
    }
    return Manager.getCurrentProject()?.getSettings().remoteStorage
  }

  private static handleRemoteSync = (): Promise<void> | undefined => {
    if (SyncManager.canStartSyncWithRemote()) {
      return new RemoteAndLocalMerger(Manager.getCurrentProject()?.dropBoxSyncInfo.getLinkedFileId()!).sync()
    }
  }

  private static handleWPSync = async (props: ISyncWithRemoteOrLocalProps, remoteStorageId: string) => {
    console.log('handleWPSync= ~ props:', props)
    const wordpressHelper = WordpressHelper.instance
    const client = await wordpressHelper.getClient(remoteStorageId)

    if (!client) {
      // TODO - develop system to put edits in a queue and try again later
    } else if (props.type === 'project') {
      switch (props.mode) {
        case EDITOR_MODE.add:{
          const projectAllDataForAdd = props.systemData
          await client.createProject(projectAllDataForAdd)
          break
        }
        case EDITOR_MODE.edit:{
          const projectAllDataForEdit = Manager.getCurrentProject()!.getAllData()
          await client.editProject(projectAllDataForEdit)
          break
        }
        case EDITOR_MODE.delete:{
          const projectIdForDelete = props.projectId
          await client.deleteProject(projectIdForDelete)
          break
        }
      }
    } else if (props.type === 'element') {
      const { projectId, sectionId, elementId, elementData } = props as ISyncWithRemoteOrLocalAddOrEditElementSectionProps
      switch (props.mode) {
        case EDITOR_MODE.add:
          await client.addSectionElement(projectId, sectionId, elementId, elementData)
          break
        case EDITOR_MODE.edit:
          await client.editSectionElement(projectId, sectionId, elementId, elementData)
          break
        case EDITOR_MODE.delete:
          await client.deleteSectionElement(projectId, sectionId, elementId)
          break
      }
    }
  }

  private static canStartSyncWithRemote = (): boolean => (
    !IS_SYNCING.getValue() &&
    Manager.getCurrentProject()?.dropBoxSyncInfo.getCloudSyncState() === CloudSyncState.LINKED &&
    !!Manager.getCurrentProject()?.dropBoxSyncInfo.getLinkedFileId()
  )
}
