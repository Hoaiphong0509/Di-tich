import { Relic } from './relic';

export interface Member {
  username: string
  knownAs: string
  bio: string
  address: string
  avatarUrl: string
  relics: Relic[]
}
