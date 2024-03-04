# 03 tsconfig.json et les modules

:memo: [éditer cette page](https://gitlab.com/-/ide/project/webdev101/03_tsconfig.json/edit/main/-/README.md)

## cloner le dépôt

dans VSCode, clonez le dépôt <https://gitlab.com/webdev101/03_tsconfig.json.git>

## lire et comprendre

vous devez lire et comprendre le code source des fichiers `index.html`  `tsconfig.json` `src/app.ts` et `src/moduleMath.ts` que voici

[index.html](index.html ":include :type=code html")

[tsconfig.json](tsconfig.json ":include :type=code json")

[src/app.ts](src/app.ts ":include :type=code typescript")

[src/moduleMath.ts](src/moduleMath.ts ":include :type=code typescript")

## transpiler

transpilez dans un terminal avec

```terminal
tsc -w
```

le dossier `out` est créé et les fichiers `out/app.js` `out/app.js.map` `out/moduleMath.js` `out/moduleMath.js.map` sont créés. Les fichiers .map permettent de faire le lien entre le code source et le code transpilé pour pouvoir débugger le code source dans le navigateur.

remarquez que le script transpilé `out/app.js` est lié au fichier `index.html` avec un `type="module"` dans la balise script ce qui autorise le chargement des modules ES6 avec la directive `import` dans le code source.

```html
<script type="module" src="out/app.js"></script>
```

pour transpiler automatiquement à chaque changement du fichier .ts vous pouvez utiliser le "watch mode" avec

```terminal
tsc -w
```

# Execution dans le navigateur

Utilisez le live server de VSCode pour ouvrir le fichier `index.html` dans le navigateur. Cette fois, comme le fichier `index.html` est à la racine du projet il s'affiche directement dans le navigateur.

# lectures

https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules#diff%C3%A9rences_entre_les_modules_et_les_scripts_%C2%AB_classiques_%C2%BB 

https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules#gestion_des_conflits_de_nommage

https://www.typescriptlang.org/fr/docs/handbook/2/modules.html#modules-en-typescript

lisez sur le site pédagogique la partie théorique 

06 L'architecture de TypeScript.pdf

# Exercice

1. Créez une application avec trois fichiers: `calculJours.ts` `moduleVacances.ts` et `moduleTravail.ts` qui utilisent des modules pour calculer le nombre de jours de vacances restants et le nombre de jours de travail restants pour un employé. 
2. Dans les deux modules `moduleVacances.ts` et `moduleTravail.ts` créez la fonction `calculerJoursRestants` avec le même nom dans les deux modules, qui prend en paramètre le nombre de jours de vacances ou de travail déjà pris et retourne le nombre de jours restants. Vous pouvez inventer les règles pour le calcul des jours de vacances et de travail restants. Exportez la fonction qui a le même nom avec `export` dans les deux modules.
3. Dans le fichier `calculJours.ts` importez les deux modules et utilisez la fonction `calculerJoursRestants` pour afficher le nombre de jours de vacances et de travail restants pour un employé. Vous devez résoudre le conflit de nom entre les deux modules (voir la partie "gestion des conflits de nommage" dans la lecture ci-dessus).
4. Affichez les résultats dans des balises `div` avec `createElement` et `appendChild`.
5. Dans le fichier `tsconfig.json` vous pouvez ajouter tous les fichiers .ts en remplaçant la ligne `"files": [...]` par `"include": ["src/**/*.ts"]` pour inclure tous les fichiers .ts dans le dossier `src` et ses sous-dossiers.
