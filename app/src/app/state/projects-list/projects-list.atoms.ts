import { LocalProjectSettings } from 'app/models/project/project.declarations'
import { atom } from 'jotai'

export class ProjectsListAtoms {
  public static projects = atom<Array<LocalProjectSettings>>([])
}
