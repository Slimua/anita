import { ProjectSettings } from 'app/data/model/project-info';
import { ProjectDeletor } from 'app/libs/project-helpers/project-handlers/project-deletor.class';
import { useState } from 'react';

export const DeleteProjectButton = ({ project }: { project: ProjectSettings }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <span>
      <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-red-700 inline-flex items-center md:mb-2 lg:mb-0 rounded bg-red-700 bg-opacity-10 hover:bg-opacity-20 text-sm">
        <i className="bi-trash"></i><span className="ml-2 hidden lg:inline-block">Delete project</span>
      </button>
      {isModalOpen && <DeleteProjectModal project={project} closeFn={() => setIsModalOpen(false)} />}
    </span>
  )
}

export const DeleteProjectModal = ({ project, closeFn }: { project: ProjectSettings, closeFn: () => void }) => (
  <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="animate__animated animate__fadeIn fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="animate__animated animate__fadeIn inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <i className=" text-red-600 bi-exclamation-triangle text-xl -mt-1"></i>

            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete Project
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this project?<br /><br />All project data will be permanently removed from this device. This action cannot be undone.<br /><br />Data stored on other devices will not be affected.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button onClick={() => new ProjectDeletor(project).delete()} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Delete
          </button>
          <button onClick={closeFn} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)