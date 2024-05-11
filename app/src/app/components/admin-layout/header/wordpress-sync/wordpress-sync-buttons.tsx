import React from 'react'
import { WordPressSyncButton } from 'app/components/admin-layout/header/wordpress-sync/wordpress-sync-button'

interface IWordPressSyncButtonsProps {
  remoteIds: Array<string>
}

export const WordPressSyncButtons: React.FC<IWordPressSyncButtonsProps> = (props) => (
  <div className="flex items-center space-x-2 mr-2">
    {props.remoteIds.map((remoteId) => (
      <WordPressSyncButton
        key={remoteId}
        remoteId={remoteId}
      />
    ))}
  </div>
)
