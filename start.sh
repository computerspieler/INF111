#!/bin/bash
MAINDIR=$(pwd)

# Création de la base de donnée pour l'autocomplétion
if [[ ! -f "output-db.json" ]]; then
cd tools
./build-db.sh
cd "$MAINDIR"
fi

cd "$MAINDIR"
# On réinitaliser la base de donnée
git checkout 16_http_CRUD/db.json

# On crée les fichiers .js
find "$MAINDIR" -maxdepth 1 -type d -print0 | while IFS= read -r -d '' d; do
	cd "$d"
	if [[ -f "tsconfig.json" ]]; then
		if [ ! -d "out" ]; then
			echo "Création des fichiers .js pour $d"
			tsc
		else
			files_newer_count=$(find . -maxdepth 2 -type f -name "*.ts" -newer "out" | wc -l)
			if [[ ! $files_newer_count -eq 0 ]]; then
				rm -rf out
				echo "Création des fichiers .js pour $d"
				tsc
			fi
		fi
	fi
done

# On installe les modules manquants
cd "$MAINDIR"
[[ ! -d "node_modules" ]] && npm install

npx json-server 16_http_CRUD/db.json &
node projet_final/server.js
