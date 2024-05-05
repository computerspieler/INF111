#!/bin/bash
MAINDIR=$(pwd)

# Création de la base de donnée pour l'autocomplétion
if [[ ! -f "output-db.json" ]]; then
cd tools
./build-db.sh
cd $(MAINDIR)
fi

# On réinitaliser la base de donnée
git checkout 16_http_CRUD/db.json

# On crée les fichiers .js
for d in $(find . -maxdepth 1 -type d | sort); do
	cd "$MAINDIR/$d"
	if [[ -f "tsconfig.json" ]]; then
		echo "Création des fichiers .js pour $d"
		[[ ! -d "out" ]] && tsc
	fi
done

# On installe les modules manquants
cd "$MAINDIR"
[[ ! -d "node_modules" ]] && npm install

npx json-server 16_http_CRUD/db.json &
node server.js
