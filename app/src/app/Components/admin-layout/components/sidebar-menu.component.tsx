import { ANITA_URLS, URL_PARAMS } from 'app/libs/Routing/anita-routes.constant'
import { urlParamFiller } from 'app/libs/Routing/url-param-fillers.function'
import { RESERVED_AUDS_KEYS } from 'app/data/project-structure/project-info'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import { ProjectPicker } from 'app/Components/admin-layout/components/project-picker.component'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import React from 'react'
import { Manager } from 'app/libs/Manager/Manager.class'
import { Icons } from 'app/libs/Icons/Icons.class'

const baseStyleOfSidebarLinks = 'flex items-center block py-2.5 px-4 transition duration-200 border-l-2 hover:border-prussian-blue-700 hover:text-prussian-blue-500 text-sm font-semibold'

const addActiveClassNameToBaseStyle = (currentPath: string, linkPath: string): string => {
  if (currentPath === linkPath) {
    return `${baseStyleOfSidebarLinks} border-prussian-blue-700`
  }
  return `${baseStyleOfSidebarLinks} border-transparent`
}

const ProjectMenu: React.FC = () => {
  const project = useSelector((state: AnitaStore) => state.project)
  const location = useLocation()

  if (project === null) {
    return null
  }

  return (
    <div className="mt-3">

      <div className="block py-2.5 px-1">
        <ProjectPicker project={project} />
      </div>
      <div className="block py-2.5 px-4">
        <p className="text-xs text-gray-600">Project sections:</p>
      </div>
      {Manager.getCurrentProject().getSectionsDefinitions().map(section => {
        const linkPath = urlParamFiller(ANITA_URLS.projectSectionElesList, [{ name: URL_PARAMS.projectId, value: project[RESERVED_AUDS_KEYS._settings][0].id }, { name: URL_PARAMS.sectionId, value: section.id }])
        return (
          <Link
            key={section.id}
            to={linkPath}
            className={addActiveClassNameToBaseStyle(location.pathname, linkPath)}
          >
            {Icons.render('chevronForwardOutline')}<span className="ml-2">{section.title}</span>
          </Link>
        )
      }
      )}

    </div>
  )
}

export const SidebarMenu = () => (
  <div>
    < ProjectMenu />
  </div>
)
