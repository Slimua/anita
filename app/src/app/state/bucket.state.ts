import { getDefaultStore } from 'jotai'

export class Bucket {
  static general: ReturnType<typeof getDefaultStore>

  public static createStore () {
    this.general = getDefaultStore()
  }
}
