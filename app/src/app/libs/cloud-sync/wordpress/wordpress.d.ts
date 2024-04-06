interface IWordPressUser {
  last_name: string
  name: string
  picture: string
  role: 'administrator' | 'editor' | 'author' | 'contributor' | 'subscriber'
}

export interface IWordPressSpaceInfo {
  can_create_projects_role: string
  users: Array<IWordPressUser>
}
