import { dbInstances } from 'app/data/local-dbs/db-instances.const';
import { IProjectSettings } from 'app/data/project-structure/project-info';
import { CLIENT_SECTIONS } from 'app/data/system-local-db/client-sections.enum';
import { Manager } from 'app/libs/Manager/Manager.class';
import { ProjectsListLoader } from 'app/libs/projects-helpers/projects-handlers/projects-list-loader.class';

/**
 * Deletes a project from the current device
 */
export class ProjectDeletor {

  /**
   * Creates an instance of project deletor.
   * @param project the settings of the project to delete
   */
  constructor(
    private project: IProjectSettings
  ) { }

  /**
   * Deletes the project and reloads the list of projects
   */
  public async delete(): Promise<void> {
    await this.callOnProjectDeleted();
    await this.doDelete();
    this.reloadProjectList();
  }

  /**
   * Performs the delete action on IndexedDB with db-connector
   */
  private async doDelete(): Promise<void> {
    await dbInstances.system.callDeletor<IProjectSettings>(CLIENT_SECTIONS.projects, { id: this.project.id }).autoDelete();
  }

  private async callOnProjectDeleted(): Promise<void> {
    const canProceed = await Manager.isProjectLoaded(this.project.id, false);
    if (canProceed)
      await dbInstances[this.project.id].dbStore.onProjectDeleted?.();
  }

  /**
   * Reloads the project list from scratch
   */
  private reloadProjectList(): void {
    new ProjectsListLoader().load();
  }

}
