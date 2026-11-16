/**
 * User and character type definitions
 * Represents user accounts, characters, and guild associations
 */

import type { Profession } from './recipe';

export interface ProfessionLevel {
  profession: Profession;
  level: number;
  maxLevel: number;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  realm: string;
  class: string;
  race: string;
  level: number;
  professions: ProfessionLevel[];
  guildId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  characters: string[]; // Array of character IDs
  primaryCharacterId?: string;
  guildId?: string;
  preferences: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  email: string;
  displayName?: string;
}

export interface UpdateUserInput {
  displayName?: string;
  profilePicture?: string;
  preferences?: Partial<User['preferences']>;
}

export interface CreateCharacterInput {
  name: string;
  realm: string;
  class: string;
  race: string;
  level: number;
  professions?: ProfessionLevel[];
}

export interface UpdateCharacterInput {
  name?: string;
  level?: number;
  professions?: ProfessionLevel[];
  guildId?: string;
}
