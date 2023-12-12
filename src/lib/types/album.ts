export type BandCampResults = {
	collectionItems: Album[];
}

export type Album = {
	url: string;
	artwork: string;
	title: string;
	artist: string;
};

export type ExternalImageSource = {
	format: string;
	img: string;
	w: number;
	h?: number;
};
