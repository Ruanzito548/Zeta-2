/**
 * Guild type definitions
 * Represents guilds and shared economic data
 */

export interface GuildMember {
  userId: string;
  characterId: string;
  role: 'member' | 'officer' | 'leader';
  joinedAt: Date;
}

export interface Guild {
  id: string;
  name: string;
  realm: string;
  leader: string; // User ID of the leader
  members: GuildMember[];
  dataVisibility: 'private' | 'members_only' | 'public';
  settings: {
    shareMarketData: boolean;
    sharePricingData: boolean;
    shareRecipeData: boolean;
    sharingLevel: 'none' | 'members' | 'trusted_members' | 'all';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuildInput {
  name: string;
  realm: string;
}

export interface UpdateGuildInput {
  name?: string;
  dataVisibility?: 'private' | 'members_only' | 'public';
  settings?: Partial<Guild['settings']>;
}

export interface GuildAuditLog {
  id: string;
  guildId: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: Date;
}
