#!/bin/bash
MAINDIR=$(pwd)

# Création de la base de donnée pour l'autocomplétion
if [[ ! -f "output-db.json" ]]; then
cd tools
./build-db.sh
cd "$MAINDIR"
fi

# On crée les fichiers .js
if [ ! -d "out" ]; then
	echo "Création des fichiers .js"
	tsc
else
	files_newer_count=$(find . -maxdepth 2 -type f -name "*.ts" -newer "out" | wc -l)
	if [[ ! $files_newer_count -eq 0 ]]; then
		rm -rf out
		echo "Création des fichiers .js"
		tsc
	fi
fi

# On installe les modules manquants
[[ ! -d "node_modules" ]] && npm install

node server.js

