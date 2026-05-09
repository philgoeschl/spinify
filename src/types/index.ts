export interface Vinyl {
  id: string;
  artist: string;
  album: string;
  year: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayLog {
  id: string;
  vinylId: string;
  userId: string;
  playedAt: string;
  createdAt: string;
}

export interface VinylWithLastPlay extends Vinyl {
  lastPlayedAt: string | null;
  playCount: number;
}

export interface VinylWithPlayLogs extends Vinyl {
  playLogs: PlayLog[];
  lastPlayedAt: string | null;
}

export interface DashboardData {
  lastPlayed: VinylWithLastPlay[];
  suggested: VinylWithLastPlay[];
}

export interface VinylsResponse {
  vinyls: VinylWithLastPlay[];
  hash: string;
}

export interface VinylsUnchangedResponse {
  unchanged: true;
  hash: string;
}

export interface ImportResult {
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
}
