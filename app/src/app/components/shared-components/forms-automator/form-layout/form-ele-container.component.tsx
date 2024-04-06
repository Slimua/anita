import { PROJECT_EDITOR_MODE } from 'app/data/project-form-builder/project-editor-form-builder.const'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

interface IFormEleContainerProps {
  children: ReactNode
  width: string | number
  advancedModeOnly?: boolean
}

export const FormEleContainer: React.FC<IFormEleContainerProps> = ({ children, width, advancedModeOnly }) => {
  const projectEditorMode = useSelector((store: AnitaStore) => store.formProject.mode)
  const hiddenClass = projectEditorMode === PROJECT_EDITOR_MODE.basic && advancedModeOnly ? 'hidden' : ''
  return (
    <div className={`${width} my-3 px-2 inline-block align-top ${hiddenClass}`}>
      {children}
    </div>
  )
}
