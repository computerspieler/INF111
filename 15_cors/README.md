# CORS (Cross-Origin Resource Sharing)

:memo: [éditer cette page](https://gitlab.com/-/ide/project/webdev101/webdev101.gitlab.io/edit/main/-/public/15_cors/README.md)

Ce code interagit avec l'API de Deezer pour récupérer et afficher une liste de genres musicaux.

Voici ce que fait chaque partie du code :

La fonction `getGenresFromDeezer` fait une requête à l'API de Deezer pour obtenir une liste de genres musicaux. Elle utilise `fetch` pour faire la requête, puis `await` pour attendre que la promesse renvoyée par `fetch` soit résolue. Ensuite, elle convertit la réponse en JSON et renvoie les données de genre.

La méthode `then` est utilisée pour traiter la promesse renvoyée par `getGenresFromDeezer`. Elle prend une fonction de rappel qui est appelée lorsque la promesse est résolue. Cette fonction de rappel prend la liste des genres et utilise `forEach` pour afficher le nom de chaque genre dans la console.

Ensuite, le même processus est répété, mais cette fois en utilisant une classe `DeezerService`. Cette classe a deux méthodes : `getGenresFromDeezer`, qui fait la même chose que la fonction du même nom, et `displayGenres`, qui récupère les genres de Deezer et les affiche.

Enfin, une instance de `DeezerService` est créée et la méthode `displayGenres` est appelée pour afficher les genres.

Notez que ce code suppose que vous avez un serveur proxy en cours d'exécution sur `localhost:8088` pour contourner les restrictions de la politique de même origine (CORS) imposées par l'API de Deezer.

CORS signifie Cross-Origin Resource Sharing (Partage de ressources entre origines). C'est un mécanisme qui permet à de nombreux ressources (par exemple, les polices, les images, les scripts) sur une page web d'être demandées à un autre domaine que celui du site d'origine.

Par défaut, la politique de même origine (Same-Origin Policy) dans les navigateurs web empêche les requêtes d'accéder à des ressources de différents domaines. Cette politique est une mesure de sécurité importante pour empêcher les attaques de type "Cross-Site Request Forgery" (CSRF).

Cependant, CORS permet aux serveurs de spécifier qui (c'est-à-dire, quels domaines) peut accéder à leurs ressources. Cela se fait en ajoutant des en-têtes HTTP spécifiques qui indiquent quels domaines sont autorisés à accéder aux ressources.

Dans notre exemple, vous devez avoir un serveur proxy en cours d'exécution sur `localhost:8088` pour contourner les restrictions CORS imposées par l'API de Deezer. Cela signifie que l'API de Deezer n'autorise pas les requêtes CORS directes depuis votre domaine (ici votre domaine est localhost, car vous exécutez le code en local), et votre navigateur empêchera ces requêtes. C'est pour contourner la restriction de votre navigateur que nous utilisons un serveur proxy.

Pour pouvoir tester cette application, vous devez d'abord démarrer le proxy CORS, en exécutant la commande suivante :

```terminal
npm install
node proxycors.js
```

Cette commande utilise npm, le gestionnaire de paquets de Node.js, configuré avec package.json. Dans la configuration de package.json, nous utilisons le package cors.js qui sera téléchargé et installé automatiquement. Nous utilisons ce package dans le fichier `proxycors.js`. Attention ce fichier est en javascript et non en typescript. Vous n'êtes pas obligé de comprendre son code.

Vous devez lire et comprendre le code source de `app.ts` que voici ainsi que vérifier son fonctionnement en démarrant le proxy cors, en transpilant avec `tsc` et en exécutant `index.html` dans votre navigateur.

[src/app.ts](src/app.ts ":include :type=code typescript")

Pour rappel, vous pouvez accéder au code source de toutes les parties (à partir de 06) sur le dépôt suivant : https://gitlab.com/webdev101/webdev101.gitlab.io/-/tree/main/public/

# lecture

pas de lecture particulière si ce n'est https://fr.wikipedia.org/wiki/Cross-origin_resource_sharing

# exercice

Faites une application qui affiche une liste des titres de la playlist "top 100 France 2023" 
https://api.deezer.com/playlist/11846226041

L'affichage doit être fait sous forme de liste non ordonnée (ul) et chaque titre doit être un élément de liste (li). Chaque élément de liste doit être numéroté (en utilisant l'index de la liste, pas son "id" - pour cela un `forEach` avec un deuxième paramètre `index` vous sera utile), contenir le titre de la chanson (sans lien, que le texte) et le nom de l'artiste (sans lien, que le texte), le titre de l'album (sans lien que le texte) et la petite photo de l'album (cover_small) en utilisant une balise img. Il doit être suivi d'un petit lecteur audio pour écouter un extrait de la chanson en mp3 (ce lien est disponible dans la propriété `preview: string` de l'interface `Datum`). Ce lecteur audio est une balise audio avec un attribut src qui pointe vers le lien de l'extrait de la chanson. Il doit également avoir un attribut `controls` pour afficher les contrôles de lecture audio. Pour ne pas précharger les fichiers audio, vous devez ajouter l'attribut `preload="none"` à la balise audio sinon tous les extraits de chansons seront téléchargés en même temps au démarrage de la page! voici un exemple HTML pour chaque élément de liste:

```html
<li>
<h3>1. Flowers</h3>
<p>Miley Cyrus</p>
<p>Flowers</p>
<img src="https://e-cdns-images.dzcdn.net/images/cover/98610629a40996b61b3d24bd5ab8c2e1/56x56-000000-80-0-0.jpg" alt="cover">
<audio controls="" preload="none">
    <source src="https://cdns-preview-0.dzcdn.net/stream/c-0f43035b21f9ce0dbf0cbcb78da9fd24-5.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
</li>
```

Pour vous aider voici les interfaces générées par le site quicktype.io pour le JSON récupéré par l'API de Deezer.

```typescript
export interface DeezerPlaylist {
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
  creator: Creator;
  type: string;
  tracks: Tracks;
}

export interface Creator {
  id: string;
  name: string;
  tracklist: string;
  type: CreatorType;
  link?: string;
}

export enum CreatorType {
  Artist = "artist",
  User = "user",
}

export interface Tracks {
  data: Datum[];
  checksum: string;
}

export interface Datum {
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

export interface Album {
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

export enum AlbumType {
  Album = "album",
}

export enum DatumType {
  Track = "track",
}
```
