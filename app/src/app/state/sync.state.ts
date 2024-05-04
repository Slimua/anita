import { Bucket } from 'app/state/bucket.state'
import { atom } from 'jotai'

class SyncStateAtoms {
  public static isSyncing = atom<boolean>(false)
  public static isSavingInFs = atom<boolean>(false)
  public static lastSyncedId = atom<string | null>(null)
}

export class SyncState {
  public static atoms = SyncStateAtoms

  public static setIsSyncing = (isSyncing: boolean) => {
    Bucket.state.set(this.atoms.isSyncing, isSyncing)
  }

  public static getIsSyncing = () => Bucket.state.get(this.atoms.isSyncing)

  public static setIsSavingInFs = (isSavingInFs: boolean) => {
    Bucket.state.set(this.atoms.isSavingInFs, isSavingInFs)
  }

  public static setLastSyncedId = (lastSyncedId: string | null) => {
    Bucket.state.set(this.atoms.lastSyncedId, lastSyncedId)
  }
}
