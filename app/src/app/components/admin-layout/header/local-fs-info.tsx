import { Button } from 'app/components/shared-components/common-ui-eles/button.component'
import { Type } from 'app/components/shared-components/common-ui-eles/components.const'
import { SyncState } from 'app/state/sync.state'
import { useAtomValue } from 'jotai'
import React from 'react'

export const LocalFsInfo: React.FC = () => {
  const isSavingInFs = useAtomValue(SyncState.atoms.isSavingInFs)
  return (
    <Button
      id="local-fs-info"
      type={Type.transparent}
      iconLeft="desktopOutline"
      iconLeftClassName={isSavingInFs ? 'animate-pulse' : ''}
      label="Saved on Disk"
      onClick={() => { }}
      className="cursor-default"
    />
  )
}
