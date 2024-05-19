import { ANITA_URLS } from 'app/libs/routing/anita-routes.constant'
import { IProjectSettings } from 'app/models/project/project.declarations'
import { Manager } from 'app/cross-refs-exports'
import { REDUX_ACTIONS } from 'app/libs/redux/redux-actions.const'
import { storeDispatcher } from 'app/libs/redux/store-dispatcher.function'
import { Button } from 'app/components/shared-components/common-ui-eles/button.component'
import React from 'react'
import { useNavigate } from 'react-router'
import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { ModalState } from 'app/state/modal/modal-state.class'
import { WordpressHelper } from 'app/libs/cloud-sync/wordpress/wordpress-helper.class'
import { ProjectDeletor } from 'app/models/project/project-deletor.class'

interface IDeleteProjectButtonProps {
  project: IProjectSettings
}

export const DeleteProjectButton: React.FC<IDeleteProjectButtonProps> = ({ project }) => {
  const navigate = useNavigate()

  const handleClickDelete = async () => {
    if (Manager.getCurrentProject()?.getId() === project.id) {
      storeDispatcher({ type: REDUX_ACTIONS.resetCurrentProject })
    }
    new ProjectDeletor(project.id).delete()
    navigate(ANITA_URLS.projectsList)
  }

  const handleClickModal = () => {
    ModalState.showModal({
      title: 'Delete Project',
      type: Type.danger,
      ctas: [{
        actionText: 'Delete',
        handleClickAction: handleClickDelete
      }],
      children: (
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this project?<br /><br />All project data will be permanently removed from this device. This action cannot be undone.<br /><br />Data stored on other devices will not be affected.
        </p>
      )
    })
  }

  if (project.remoteStorage && !WordpressHelper.instance.canDeleteProject(project.remoteStorage)) {
    return null
  }

  return (
    <Button
      id="deleteProject"
      label="Delete Project"
      iconLeft="trashOutline"
      onClick={handleClickModal}
      breakpoint={'lg'}
      type={Type.danger}
      fill={'outline'}
      hasTooltip={true}
    />
  )
}
