import { Manager } from 'app/cross-refs-exports'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import { REDUX_ACTIONS } from 'app/libs/redux/redux-actions.const'
import { storeDispatcher } from 'app/libs/redux/store-dispatcher.function'
import { FormAutomator } from 'app/components/shared-components/forms-automator/form-automator.component'
import { FormAutomatorOnChangeValue } from 'app/components/shared-components/forms-automator/form-automator.types'
import { useSelector } from 'react-redux'
import React from 'react'

interface IProjectFormElementManagerProps {
  sectionId: string
}

export const ProjectSectionElementAddEditFormManager: React.FC<IProjectFormElementManagerProps> = ({ sectionId }) => {
  const project = Manager.getCurrentProject()
  const section = project?.getSectionById(sectionId)

  const element = useSelector((store: AnitaStore) => store.formElement.element)

  const handleChange = (fieldName: string | number, value: FormAutomatorOnChangeValue) => {
    storeDispatcher({ type: REDUX_ACTIONS.updateFormElementKey, payload: { fieldName, value } })
  }

  if (!section || !element) {
    return null
  }

  return (
    <form name="element-form">
      {section.childOf && section.childOf.length > 0 && (<FormAutomator
        formModel={[section.getParentInfoFormEle()]}
        element={element}
        handleChange={handleChange}
                                                         />)}
      <FormAutomator formModel={section?.formModel!} element={element!} handleChange={handleChange} />
    </form>
  )
}
