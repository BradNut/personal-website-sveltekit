export type BandCampResults = {
  collectionItems: Album[];
};

export type Album = {
  url: string;
  artwork: string;
  title: string;
  artist: string;
  src: Record<string, any> | ExternalImageSource[] | undefined;
};

export type ExternalImageSource = {
  format: string;
  img: string;
  w: number;
  h?: number;
};
