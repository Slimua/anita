import { IWordPressRemoteInfo } from 'app/libs/cloud-sync/wordpress/wordpress.const'
import { PrimitiveAtom, atom } from 'jotai'

export class SyncStateAtoms {
  public static isSyncing = atom<boolean>(false)
  public static isSavingInFs = atom<boolean>(false)
  public static lastSyncedId = atom<string | null>(null)
  public static wordPressRemotesIds = atom<Array<string>>([])
  public static remoteInfo: Record<string, PrimitiveAtom<IWordPressRemoteInfo>> = {}
}
