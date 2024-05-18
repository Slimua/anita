import { DbInitializer } from 'app/data/local-dbs/db-initializer.class'
import { dbInstances } from 'app/data/local-dbs/db-instances.const'
import { LOCAL_STORAGE_SYSTEMS } from 'app/data/local-dbs/local-storage-systems.enum'
import { AdditionalInfoForLocalStorage, TAnitaUniversalDataStorage, LocalProjectSettings, RESERVED_AUDS_KEYS } from 'app/models/project/project.declarations'
import { FileSystemFileHandle } from 'app/libs/db-connector/plugins/file-handles/helpers/file-system-access-api'
import { SaveProjectSettingsInIndexedDB } from 'app/models/project/save-project-settings-in-indexed-db.class'

/**
 * Imports one project file, and then calls `SaveProjectSettingsInIndexedDB`.
 * Also sets the last imported project as the current one by calling `CurrentProjectSetter`.
 *
 * @see SaveProjectSettingsInIndexedDB
 * @see CurrentProjectSetter
 */
export class ProjectDataImporter {
  private additionalInfoForLocalStorage!: AdditionalInfoForLocalStorage

  /**
   *
   * @param projectData The project data of the project to import
   * @param fileHandle FileSystemFileHandle of the project to import
   */
  constructor (
    private projectData: TAnitaUniversalDataStorage,
    private fileHandle?: FileSystemFileHandle

  ) { }

  /**
   * Asks for the files to import and processes them, then sets the current project as the last one imported
   */
  public async import (): Promise<LocalProjectSettings> {
    await this.initializeDb()
    await this.setLocalProjectSettings()

    // Relaxed equality check, because in the form the localStorage data is stored as a string
    // eslint-disable-next-line eqeqeq
    if (this.projectData[RESERVED_AUDS_KEYS._settings][0].localStorage == LOCAL_STORAGE_SYSTEMS.IndexedDB) {
      await this.saveDataToDb()
    }

    return { ...this.projectData[RESERVED_AUDS_KEYS._settings][0], ...this.additionalInfoForLocalStorage }
  }

  private async setLocalProjectSettings () {
    this.additionalInfoForLocalStorage = await dbInstances[this.projectData[RESERVED_AUDS_KEYS._settings][0].id].dbStore.postProjectCreation?.(this.projectData) || {}
    await new SaveProjectSettingsInIndexedDB(this.projectData[RESERVED_AUDS_KEYS._settings][0], this.additionalInfoForLocalStorage).save()
  }

  /**
   * Initialize the DbConnector instance
   */
  private async initializeDb (): Promise<void> {
    await new DbInitializer(this.projectData[RESERVED_AUDS_KEYS._settings][0], this.projectData[RESERVED_AUDS_KEYS._sections], this.fileHandle).init()
  }

  private async saveDataToDb (): Promise<any> {
    for (const section in this.projectData) {
      await dbInstances[this.projectData[RESERVED_AUDS_KEYS._settings][0].id].callInsertor(section, this.projectData[section]).autoInsert()
    }
  }
}
