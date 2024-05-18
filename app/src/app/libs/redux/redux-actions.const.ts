/**
 * Supported reducer actions
 */
export enum REDUX_ACTIONS {
  // PROJECT
  setCurrentProject,
  resetCurrentProject,
  updateSection,
  // SECTIONS_FOR_CHILD_OF_SELECTOR
  addSectionForChildOfSelector,
  resetSectionForChildOfSelector,
  // FORMS
  setValidStateForEle,
  unsetValidStateForEle,
  updateFormElement,
  updateFormElementKey,
  setFormProject,
  setProjectEditorMode,
  updateFormProjectSettings,
  updateFormProjectAddSection,
  updateFormProjectUpdateSection,
  updateFormProjectUpdateFormModelOfSection,
  updateFormProjectRemoveSection,
  updateFormProjectAddFieldToSection,
  updateFormProjectRemoveFieldFromSection,
  updateFormProjectUpdateFormModelAddOption,
  updateFormProjectUpdateFormModelDeleteOption,
  updateFormProjectUpdateFormModelOptionValue
}
