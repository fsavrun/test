export interface CharacterResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface VideoResponse {
  success: boolean;
  videoUrl?: string;
  videoId?: string;
  error?: string;
}

export interface VideoStatusResponse {
  status: 'created' | 'processing' | 'done' | 'error';
  videoUrl?: string;
  error?: string;
}
