import { ProjectSettings } from 'app/data/project-structure/project-info';
import { ProjectDeletor } from 'app/libs/project-helpers/project-handlers/project-deletor.class';
import { Modal } from 'app/ui-react-components/shared-components/modals/modal.component';
import { useState } from 'react';

export const DeleteProjectButton = ({ project }: { project: ProjectSettings }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate__fadeIn');

  const handleClickModal = () => {
    if (isModalOpen) {
      setAnimationClass('animate__fadeOut')
      setTimeout(() => setIsModalOpen(false), 500);
    } else {
      setAnimationClass('animate__fadeIn')
      setIsModalOpen(true)
    }
  }

  const handleClickDelete = () => {
    handleClickModal();
    // This timeout must be equal or greater than the one in closeFn.
    // Otherwise we would cause an update on an unmounted component.
    setTimeout(() => new ProjectDeletor(project).delete(), 500);
  }

  return (
    <span>
      <button onClick={handleClickModal} className="px-4 py-2 text-red-700 inline-flex items-center md:mb-2 lg:mb-0 rounded bg-red-700 bg-opacity-10 hover:bg-opacity-20 text-sm">
        <i className="bi-trash"></i><span className="ml-2 hidden lg:inline-block">Delete project</span>
      </button>
      {isModalOpen && <Modal
        title="Delete Project"
        actionText="Delete"
        type="alert"
        handleClickAction={handleClickDelete}
        closeFn={handleClickModal}
        animationClass={animationClass}
        icon="text-red-600 bi-exclamation-triangle"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this project?<br /><br />All project data will be permanently removed from this device. This action cannot be undone.<br /><br />Data stored on other devices will not be affected.
        </p>

      </Modal>
      }
    </span>
  )
}
