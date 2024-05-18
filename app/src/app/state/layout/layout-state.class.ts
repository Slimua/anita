import { Bucket } from 'app/state/bucket.state'
import { LayoutAtoms } from 'app/state/layout/layout.atoms'

export class LayoutState {
  public static toggleSidebar () {
    const current = Bucket.general.get(LayoutAtoms.sidebar)
    Bucket.general.set(LayoutAtoms.sidebar, current === '-translate-x-full' ? '' : '-translate-x-full')
  }
}
