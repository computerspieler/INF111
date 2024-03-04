# 01_hello_world_typescript

:memo: [éditer cette page](https://gitlab.com/-/ide/project/webdev101/01_hello_world_typescript/edit/main/-/README.md)

## installer les prérequis

vous devez installer

- l'IDE [VSCode](https://code.visualstudio.com/download)
- le runtime JavaScript [Node](https://nodejs.org/en/download) qui vous fournira les commandes `node` et `npm` (node package manager)
- le langage [typescript](https://www.typescriptlang.org/download) globalement sur votre ordinateur en utilisant (en mode superutilisateur) `npm install -g typescript` qui fournira la commande `tsc`

  > sur les machines de l'école, VSCode est installé, Node est installé mais pas typescript et vous n'avez pas le droit d'installer globalement typescript. Vous pouvez cependant l'installer localement avec `npm install typescript --save-dev` et utiliser la commande `npx tsc` (au lieu de `tsc`)

## vérifier l'installation

```terminal
node --version
|success|vXX.XX.XX
npm --version
|success|X.X.X
tsc -v
|success|X.X.X
```

## Prettier Formatter for Visual Studio Code

Pour formater automatiquement votre code, vous devez installer l'extension Prettier Formatter for Visual Studio Code. Vous pouvez le faire en cliquant sur l'icône des extensions dans la barre latérale gauche, en recherchant "Prettier" et en cliquant sur "Installer". L'utilisation est assez simple, vous pouvez soit cliquer sur l'icône de la barre d'outils en bas "Prettier", soit utiliser le raccourci clavier `Alt` + `Shift` + `F` pour formater votre code.

## IA d'aide au codage

Pour activer l'IA d'aide au codage, vous devez installer l'extension github copilot dans Visual Studio Code.

## cloner le dépôt

dans VSCode, clonez le dépôt <https://gitlab.com/webdev101/01_hello_world_typescript.git>

## lire et comprendre

vous devez lire et comprendre le code source de `hello.ts` que voici

[hello.ts](hello.ts ":include :type=code typescript")

## transpiler et exécuter

transpilez dans un terminal avec

```terminal
tsc hello.ts
```

le fichier `hello.js` est créé, vous pouvez l'exécuter sans navigateur avec node

```terminal
node hello.js
```

## comprendre l'utilité du typage dans typescript

lisez https://www.typescriptlang.org/fr/docs/handbook/typescript-from-scratch.html pour comprendre pourquoi le typage permet de gagner du temps

lisez sur le site pédagogique les parties théoriques

07 Environnement de developpement.pdf

02 Un peu d'histoire.pdf

03 ECMAScript.pdf

04 Pourquoi TypeScript .pdf

# exercices

## le typage dans typescript

comparez le fichier `hello.js` et `hello.ts` et déduisez l'étape de transpilation. A quoi sert le typage fort dans typescript qui n'existe pas dans javascript ? Répondez dans un fichier texte au format markdown.
