const message: string = "Hello, World!";
// create a new heading 1 element
const heading_04: HTMLHeadingElement = document.createElement("h1");
heading_04.textContent = message;
// add the heading the document
document.body.appendChild(heading_04);
heading_04.style.color = "green";
