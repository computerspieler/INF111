# Rendu INF111

## Dépendances
Ce projet dépend des programmes suivants :
- `node` et `npm`
- `express-js`
- `tsc` (Compilateur typescript)

Les dépendances suivantes sont nécéssaires afin de faire marcher l'autocomplétion:
- `python3`
- `curl`

## Installation
Pour les systèmes de type Unix, le script `start.sh` permet de faire le pluss gros
du travail. Il suffit de l'executer à la racine du projet (i.e. dans le dossier ou
se trouve ce fichier).

Dans le cas ou le script ne fonctionnerait pas, il vous faudra:
- Télécharger la base de donnée suivante au format **CSV** : [Vous la trouverez ici](https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/export/).
Vous obtiendrez un fichier nommé `geonames-all-cities-with-a-population-1000.csv`,
mettez-le dans le dossier `tools`.
- Executer le script `format.py`, vous obtiendrez un fichier nommé `output-db.json`.
- Copier le fichier `output-db.json` à la racine du projet.
- Compiler chaque projet avec la commande `tsc` (i.e. Aller dans le dossier et executez `tsc`).
- Executer la commande `npm install` à la racine du projet

Et normalement tout est prêt pour lancer le projet.

## Démarrage
Pour démarrer le serveur:
- Executez la commande `node projet_final/server.js` depuis la racine du projet.
- Executez la commande `npx json-server 16_http_CRUD/db.json` depuis la racine du projet.
- Lancez une instance de Five-Server à la racine du projet.

L'ordre importe peu, tant que ces commandes sont executés en parallèle, il ne devrait
pas y avoir de soucis.

