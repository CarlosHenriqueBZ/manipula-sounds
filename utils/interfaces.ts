export interface Artist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
}

 export interface Track {
  id: number;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  position: number;
  artist: Artist;
  album: Album;
  type: string;
}

interface Artists {
  data: Artist[];
}

interface Tracks {
  data: Track[];
}

export interface Podcast {
  id: number;
  title: string;
  description: string;
  available: boolean;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface Podcasts {
  data: Podcast[];
  total: number;
}

export interface Payload {
  data: {
  map(arg0: (moment: Track, index: number) => import("react").JSX.Element): import("react").ReactNode;
  length: any;
  tracks: Tracks;
  artists: Artists;
  podcasts: Podcasts;
  }
  
}

export interface DeezerTrackData extends Track {}