import React, { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { SyncState } from 'app/state/sync.state'

export const useIdLastChangedBySync = (lastChangedId: string | undefined) => {
  const [lastChangedAt, setLastChangedAt] = useState(Date.now())
  const lastSyncedId = useAtomValue(SyncState.atoms.lastSyncedId)

  useEffect(() => {
    if (lastSyncedId === lastChangedId) {
      setLastChangedAt(Date.now())
    }
  }, [lastChangedId, lastSyncedId])

  return lastChangedAt
}
