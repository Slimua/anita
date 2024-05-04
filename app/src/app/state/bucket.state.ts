import { getDefaultStore } from 'jotai'

export class Bucket {
  static state: ReturnType<typeof getDefaultStore>

  public static createStore () {
    this.state = getDefaultStore()
  }
}
