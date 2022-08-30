import { Icons } from 'app/libs/Icons/Icons.class'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import { appVersion } from 'app/version'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

interface ISidebarProps {
  children: ReactNode
}

export const Sidebar: React.FC<ISidebarProps> = (props) => {
  const toggledClass = useSelector((store: AnitaStore) => store.layout.sidebar)

  return (
    <div className="py-5 z-10">
      <div className={`${toggledClass} sidebar h-full bg-white shadow rounded-sm text-prussian-blue-500 w-64 space-y-6 pt-1 pb-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          {props.children}
        </nav>
        <div className="absolute bottom-1 text-xs text-gray-400">
          <div className="flex items-center">
            <p className="inline-block mr-1">v{appVersion}</p>|
            <a className="ml-1" href="https://github.com/anita-app/anita/issues" target="_blank" rel="noreferrer" data-tip={true} data-for="reportBug">
              {Icons.render('bugOutline', 'mt-1.5')}
            </a>
            <ReactTooltip id="reportBug" effect="solid">
              Report a bug
            </ReactTooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
