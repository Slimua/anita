/* eslint-disable eqeqeq */
import React, { useEffect } from 'react'
import { AnitaStore } from 'app/libs/redux/reducers.const'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DropboxSyncButton } from 'app/components/admin-layout/header/dropbox-sync/dropbox-sync-button'
import { RESERVED_AUDS_KEYS } from 'app/models/project/project.declarations'
import { LOCAL_STORAGE_SYSTEMS } from 'app/data/local-dbs/local-storage-systems.enum'
import { LocalFsInfo } from 'app/components/admin-layout/header/local-fs-info'
import { Manager } from 'app/cross-refs-exports'
import { WordPressSyncButtons } from 'app/components/admin-layout/header/wordpress-sync/wordpress-sync-buttons'
import { useAtomValue } from 'jotai'
import { SyncStateAtoms } from 'app/state/sync/sync-state.atoms'
import { LayoutState } from 'app/state/layout/layout-state.class'
import { LayoutAtoms } from 'app/state/layout/layout.atoms'

export const AdminLayoutHeader: React.FC = () => {
  const sidebarCollapsed = useAtomValue(LayoutAtoms.sidebarCollapsed)
  const project = useSelector((store: AnitaStore) => store.project)
  const remoteIds = useAtomValue(SyncStateAtoms.wordPressRemotesIds)
  const remoteIdsLength = remoteIds?.length

  const localStorage = project?.[RESERVED_AUDS_KEYS._settings]?.[0]?.localStorage!

  useEffect(() => {
    if (localStorage) {
      Manager.getCurrentProject()?.dropBoxSyncInfo.setLocalStorage(localStorage)
    }
  }, [localStorage])

  const hasMenu = !!project
  const hasWordPressRemotes = !!remoteIdsLength
  const hasProjectLoaded = !!project?.[RESERVED_AUDS_KEYS._settings]?.[0]?.id
  const headerElementsNumber = Number(hasMenu) + Number(hasWordPressRemotes) + Number(hasProjectLoaded)

  return (
    <div className={`bg-white text-gray-700 flex items-center h-14 shadow-md ${headerElementsNumber > 0 ? 'justify-between' : 'justify-center md:justify-start'}`}>
      {(hasMenu || hasProjectLoaded || hasWordPressRemotes) && (
        <div className="flex items-center w-1/3 md:hidden">
          <button className="mobile-menu-button p-4 focus:outline-none" onClick={LayoutState.toggleSidebar}>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}

      <div className={`relative grow flex items-center justify-center md:justify-start md:pl-5 ${headerElementsNumber === 1 ? 'ml-2 md:ml-0' : ''}`}>
        <Link to="/" className={'text-lg font-bold leading-relaxed inline-block md:mr-4 py-2 whitespace-no-wrap uppercase'}>
          <img src={`${process.env.PUBLIC_URL}/assets/logo/logo_square.svg`} style={{ height: '30px', width: 'auto' }} alt="Anita" />
        </Link>
        <Link to="/" className="hidden md:inline-block mr-4 py-2 whitespace-no-wrap text-prussian-blue-400">
          <span className="text-md font-bold leading-relaxed uppercase">Anita</span><sup style={{ fontVariant: 'small-caps' }}>Beta</sup>
        </Link>
      </div>

      {(hasMenu || hasProjectLoaded || hasWordPressRemotes) && (
        <div className="flex items-center justify-end w-1/3 md:pr-5">
          {hasProjectLoaded && !project?.[RESERVED_AUDS_KEYS._settings]?.[0]?.remoteStorage && (
            <div>
              {localStorage == LOCAL_STORAGE_SYSTEMS.IndexedDB && (<DropboxSyncButton projectId={project?.[RESERVED_AUDS_KEYS._settings]?.[0]?.id} />)}
              {localStorage == LOCAL_STORAGE_SYSTEMS.json && (<LocalFsInfo />)}
            </div>
          )}
          {!!remoteIdsLength && (<WordPressSyncButtons remoteIds={remoteIds} />)}
        </div>
      )}

      {!sidebarCollapsed && (<div onClick={LayoutState.toggleSidebar} className="absolute inset-0 h-full w-full z-10 md:hidden"></div>)}

    </div>
  )
}
