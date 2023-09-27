export type Album = {
	url: string;
	artwork: string;
	title: string;
	artist: string;
	src?: ExternalImageSource[];
};

export type ExternalImageSource = {
	format: string;
	img: string;
	w: number;
	h?: number;
};
