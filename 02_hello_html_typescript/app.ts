const salut: string = "Wowowowowow!";
// create a new heading 1 element
const maindiv: HTMLHeadingElement = document.createElement("div");
const text: HTMLHeadingElement = document.createElement("h1");
text.textContent = salut;
maindiv.appendChild(text);
// add the heading the document
document.body.appendChild(maindiv);
