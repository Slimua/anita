export const WORD_PRESS_ROLE_WEIGHT = {
  subscriber: 1,
  contributor: 2,
  author: 3,
  editor: 4,
  administrator: 5
}

interface IWordPressUser {
  last_name: string
  name: string
  picture: string
  role: 'administrator' | 'editor' | 'author' | 'contributor' | 'subscriber'
}

export interface IWordPressSpaceInfo {
  can_create_projects_role: string
  users: Array<IWordPressUser>
  site_name: string
  site_url: string
  user_role: string
  icon_base_64: string
}

export interface IWordPressRemoteInfo {
  remoteId: string
  data: IWordPressSpaceInfo
}
