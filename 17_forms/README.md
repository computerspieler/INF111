# utiliser les FORMS en typescript

!> **Attention** ceci est une page en cours de construction, elle n'est pas encore complète.

:memo: [éditer cette page](https://gitlab.com/-/ide/project/webdev101/webdev101.gitlab.io/edit/main/-/public/17_forms/README.md)

`<form id="myForm">` : C'est l'élément de formulaire HTML. Il a un ID "myForm" pour pouvoir être sélectionné facilement avec TypeScript.

`<label for="name">Name:</label>` : C'est une étiquette pour le champ d'entrée du nom. L'attribut for est utilisé pour associer l'étiquette à l'élément d'entrée avec l'ID "name".

`<input type="text" id="name" />` : C'est un champ d'entrée de texte pour le nom de l'utilisateur. Il a un ID "name" pour pouvoir être sélectionné facilement avec TypeScript.

`<label for="checkbox">Student</label>` : C'est une étiquette pour la case à cocher "Student". L'attribut for est utilisé pour associer l'étiquette à l'élément d'entrée avec l'ID "isStudent".

`<input type="checkbox" id="isStudent" />` : C'est une case à cocher pour indiquer si l'utilisateur est un étudiant ou non. Elle a un ID "isStudent" pour pouvoir être sélectionnée facilement avec TypeScript.

`<button type="submit">Submit</button>` : C'est un bouton qui soumet le formulaire. Lorsqu'il est cliqué, l'événement de soumission du formulaire est déclenché.

`<div id="result"></div>` : C'est une division où les résultats ou les messages peuvent être affichés. Elle a un ID "result" pour pouvoir être sélectionnée facilement avec TypeScript.

D'autres types d'éléments d'entrée que vous pourriez utiliser dans un formulaire incluent :

`<input type="password">` : Un champ d'entrée pour un mot de passe.
`<input type="radio">` : Un bouton radio qui permet à l'utilisateur de choisir une option parmi un ensemble.
`<input type="date">` : Un champ d'entrée pour une date, avec un sélecteur de date intégré.
`<textarea>` : Un champ d'entrée pour du texte multiligne.
`<select>` : Une liste déroulante qui permet à l'utilisateur de choisir une option parmi plusieurs.

[index.html](index.html ":include :type=code html")

`MyFormManager` est une classe TypeScript qui gère un formulaire HTML. Voici ce que fait chaque partie du code :

`window.onload = () => { new MyFormManager(); };` : Cette ligne crée une nouvelle instance de `MyFormManager` lorsque la page est complètement chargée.

Dans le constructeur de `MyFormManager`, plusieurs éléments du formulaire sont récupérés à partir du DOM et stockés comme propriétés de l'objet. Ces éléments incluent le formulaire lui-même, un champ d'entrée pour le nom, une case à cocher pour indiquer si l'utilisateur est un étudiant, et un élément pour afficher les résultats.

Un gestionnaire d'événements est ajouté au formulaire pour l'événement submit. Ce gestionnaire d'événements est la méthode `handleSubmit` de l'objet `MyFormManager`. La méthode `bind` est utilisée pour s'assurer que `this` dans `handleSubmit` se réfère à l'objet `MyFormManager`, et non à l'élément du formulaire.

La méthode `handleSubmit` est appelée lorsque l'utilisateur soumet le formulaire. Elle empêche le comportement par défaut de l'événement de soumission (qui est de recharger la page), puis elle récupère la valeur du champ d'entrée du nom. Si le nom a moins de 4 caractères, un message d'erreur est affiché. Sinon, un message de succès est affiché, indiquant si l'utilisateur est un étudiant ou non.

[src/app.ts](src/app.ts ":include :type=code typescript")

vous pouvez approfondir sur la page https://developer.mozilla.org/fr/docs/Learn/Forms 

en particulier https://developer.mozilla.org/fr/docs/Learn/Forms/Your_first_form et https://developer.mozilla.org/fr/docs/Learn/Forms/HTML5_input_types  sont des ressources intéressantes

# Exercice 

Créez une application qui utilise l'API REST publique OpenAQ (https://docs.openaq.org/). Cette API fournit des données sur la qualité de l'air dans le monde entier.

Votre application doit faire ce qui suit :

- Afficher un formulaire demandant à l'utilisateur d'entrer le nom d'une ville.
Lorsque l'utilisateur soumet le formulaire, votre application doit faire une requête GET à l'API pour récupérer une liste des dernières mesures de la qualité de l'air pour la ville entrée par l'utilisateur.
- Chaque mesure doit être affichée dans un format facile à lire. Au minimum, chaque mesure doit afficher le nom du polluant, la valeur mesurée et l'unité de mesure.
- L'application doit actualiser les données à intervalles réguliers.
- Si la ville entrée par l'utilisateur n'est pas disponible dans l'API, l'application doit en informer l'utilisateur.
 
Conseils :

- Pensez à la gestion des erreurs. Que se passe-t-il si une requête à l'API échoue ?
- Comment allez-vous gérer l'actualisation des données à intervalles réguliers ? Pensez à utiliser setInterval.
- N'oubliez pas de prévenir l'utilisateur si la ville qu'il a entrée n'est pas disponible dans l'API.