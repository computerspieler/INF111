# Rendu INF111

## Dépendances
Ce projet dépend des programmes suivants :
- `node` et `npm`
- `express-js`
- `tsc` (Compilateur typescript)

Les dépendances suivantes sont nécéssaires afin de faire marcher l'autocomplétion:
- `python >= 3.9` (il se peut que des versions antérieurs fonctionnent, mais je n'ai pas testé)
- `curl`

## Installation et lancement
Pour les systèmes de type Unix, le script `start.sh` permet d'automatiser le lancement.
Il suffit de l'executer à la racine du projet (i.e. dans le dossier ou
se trouve ce fichier).

## Installation et lancement manuels
Dans le cas ou le script ne fonctionnerait pas :
### Installation de l'autocomplétion
- Téléchargez la base de donnée suivante au format **CSV** : [Vous la trouverez ici](https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/export/).
Vous obtiendrez un fichier nommé `geonames-all-cities-with-a-population-1000.csv`,
mettez-le dans le dossier `tools`.
- Executez le script `format.py` en étant dans le dossier `tools` (i.e. le *current working directory* doit être `tools`),
vous obtiendrez un fichier nommé `output-db.json`.
- Copiez le fichier `output-db.json` à la racine du projet.

### Installation du reste du projet
- Compilez le projet avec la commande `tsc` (i.e. Allez à la racine du projet et executez `tsc`).
- Executez la commande `npm install` à la racine du projet

Et normalement tout est prêt pour lancer le projet.
L'ordre importe peu, si ce n'est qu'il faut effectuer l'étape 1 avec la deuxième.

### Démarrage du serveur
Si le script `start.sh` ne fonctionne pas, executez la commande `node server.js` depuis la racine du projet.
