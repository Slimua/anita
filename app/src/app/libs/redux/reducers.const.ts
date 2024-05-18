import { TSystemData } from 'app/models/project/project.declarations'
import { formElementReducer, IFormElementState } from 'app/libs/redux/reducers/form-element.reducer'
import { formElesValidStateReducer, IFormElesValidState } from 'app/libs/redux/reducers/form-eles-valid-state.reducer'
import { formProjectReducer, IFormProjectState } from 'app/libs/redux/reducers/form-project.reducer'
import { projectReducer } from 'app/libs/redux/reducers/project.reducer'
import { sectionsForChildOfSelectorReducer } from 'app/libs/redux/reducers/sections-for-child-of-selector.reducer'
import { SectionDetailsDeclaration } from 'app/models/section/section.declarations'

/**
 * Supported reducers
 */
export const REDUCERS = {
  project: projectReducer,
  sectionsForChildOfSelector: sectionsForChildOfSelectorReducer,
  formElesValidState: formElesValidStateReducer,
  formElement: formElementReducer,
  formProject: formProjectReducer
}

/**
 * Types managed by reducers
 */
export interface AnitaStore {
  project: TSystemData
  sectionsForChildOfSelector: Array<SectionDetailsDeclaration>
  formElesValidState: IFormElesValidState
  formElement: IFormElementState
  formProject: IFormProjectState
}
