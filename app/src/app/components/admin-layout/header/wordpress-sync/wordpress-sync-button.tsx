import React from 'react'
import { useAtomValue } from 'jotai'
import { SyncStateAtoms } from 'app/state/sync/sync-state.atoms'

interface IWordPressSyncButtonProps {
  remoteId: string
}

const getFallbackText = (siteName: string) => {
  const words = siteName.split(' ')
  if (words.length >= 2) {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase()
  }
  return siteName.substring(0, 2).toUpperCase()
}

export const WordPressSyncButton: React.FC<IWordPressSyncButtonProps> = (props) => {
  const remoteInfo = useAtomValue(SyncStateAtoms.remoteInfo[props.remoteId])

  if (!remoteInfo?.data || !remoteInfo.data.site_name) {
    return null
  }

  return (
    <>
      {remoteInfo.data.icon_base_64 && (
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-xs border-none"
          aria-label="WordPress Sync"
        >
          {getFallbackText(remoteInfo.data.site_name)}
        </button>
      )}
      {remoteInfo.data.icon_base_64 && (
        <button
          className="w-8 h-8 p-1 rounded-full flex items-center justify-center border border-gray-300"
          aria-label="WordPress Sync"
        >
          <img src={remoteInfo.data.icon_base_64} alt={remoteInfo.data.site_name} className="w-full h-full rounded-full" />
        </button>
      )}
    </>
  )
}
