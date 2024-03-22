enum CreatorType {
	Artist = "artist",
	User = "user",
} 

interface Creator {
	id: string;
	name: string;
	tracklist: string;
	type: CreatorType;
	link?: string;
}

enum AlbumType {
	Album = "album",
}

interface Album {
	id: string;
	title: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	tracklist: string;
	type: AlbumType;
}

enum DatumType {
	Track = "track",
}

interface Datum {
	id: string;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: string;
	rank: string;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	time_add: number;
	artist: Creator;
	album: Album;
	type: DatumType;
}

interface Tracks {
	data: Datum[];
	checksum: string;
}

interface DeezerPlaylist {
	id: string;
	title: string;
	description: string;
	duration: number;
	public: boolean;
	is_loved_track: boolean;
	collaborative: boolean;
	nb_tracks: number;
	fans: number;
	link: string;
	share: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	checksum: string;
	tracklist: string;
	creation_date: Date;
	md5_image: string;
	picture_type: string;
	artist: Creator;
	type: string;
	tracks: Tracks;
}

async function retrieveData(): Promise<DeezerPlaylist> {
	const resp = await fetch("http://localhost:8088/https://api.deezer.com/playlist/11846226041");
	const js = await resp.json();
	return js;
}

function update() {
	const list: HTMLUListElement = document.getElementById("liste") as HTMLUListElement;
	retrieveData().then(x => {
		console.log(x);
		x.tracks.data.forEach((entry, index) => {
			const el = document.createElement("li");
			const main_title = document.createElement("h3");
			main_title.appendChild(document.createTextNode(String(index+1) + ". " + entry.title));
			el.append(main_title);

			const artist = document.createElement("p");
			artist.appendChild(document.createTextNode(entry.artist.name));
			el.append(artist);

			const title = document.createElement("p");
			title.appendChild(document.createTextNode(entry.title));
			el.append(title);

			const img = document.createElement("img");
			img.src = "https://e-cdns-images.dzcdn.net/images/cover/" + entry.md5_image + "/56x56-000000-80-0-0.jpg";
			el.append(img);

			const audio: HTMLAudioElement = document.createElement("audio");
			audio.controls = true;
			audio.preload = "none";

			const music: HTMLSourceElement = document.createElement("source") as HTMLSourceElement;
			music.type = "audio/mpeg";
			music.src = entry.preview;
			music.appendChild(document.createTextNode("Your browser does not support the audio element."));
			audio.append(music);
			el.appendChild(audio);
			
			list.append(el);
		});
	});
}

update();