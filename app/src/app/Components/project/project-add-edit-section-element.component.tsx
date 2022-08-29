import { ANITA_URLS, URL_PARAMS } from 'app/libs/Routing/anita-routes.constant'
import { SectionElement } from 'app/data/project-structure/project-info'
import { Manager } from 'app/libs/Manager/Manager.class'
import { REDUX_ACTIONS } from 'app/libs/redux/redux-actions.const'
import { storeDispatcher } from 'app/libs/redux/store-dispatcher.function'
import { EDITOR_MODE } from 'app/Components/editor-mode.enum'
import { ProjectFormElementManager } from 'app/Components/project/project-add-edit/project-form-element-manager.component'
import { ProjectSaveElement } from 'app/Components/project/project-add-edit/project-save-element.component'
import { MainContentContainer } from 'app/Components/shared-components/common-ui-eles/main-content-container.component'
import { Loader } from 'app/Components/shared-components/loader/loader.component'
import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

export const AddEditSectionElement: React.FC = () => {
  const params = useParams()
  const mode = params[URL_PARAMS.elementId] ? EDITOR_MODE.edit : EDITOR_MODE.add

  const projectId = params[URL_PARAMS.projectId]
  const sectionId = params[URL_PARAMS.sectionId]
  const elementId = (mode === EDITOR_MODE.edit) ? params[URL_PARAMS.elementId] : null

  const [element, setElement] = useState<Partial<SectionElement> | null | undefined>(null)

  useEffect(() => {
    let isMounted = true

    const fetchElement = async () => {
      const project = await Manager.getProjectById(projectId)

      if (!sectionId || !project) {
        return setElement(undefined)
      }

      if (mode === EDITOR_MODE.add) {
        return setElement({})
      }

      const element = await project.getSectionById(sectionId)?.getElementById(elementId)
      if (isMounted) {
        setElement(element)
      }
    }

    if (isMounted) {
      fetchElement()
    }

    return () => {
      isMounted = false
    }
  }, [mode, projectId, sectionId, elementId])

  if (element === undefined) {
    return <Navigate to={ANITA_URLS.projectsList} />
  }

  const headerText = mode === EDITOR_MODE.add ? 'Add Element' : 'Edit Element'

  storeDispatcher({ type: REDUX_ACTIONS.updateFormElement, payload: element })

  return (
    <MainContentContainer headerText={headerText} overflowClassName="overflow-y-visible">
      {element === null && <Loader />}
      {element !== null && <ProjectFormElementManager sectionId={sectionId} />}
      {element !== null && <ProjectSaveElement sectionId={sectionId} />}
    </MainContentContainer>
  )
}
