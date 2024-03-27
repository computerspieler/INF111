//attendre que le DOM soit chargé

window.onload = () => {
	new MyFormManager();
};

class MyFormManager {
	myForm: HTMLFormElement;
	nameInput: HTMLInputElement;
	result: HTMLDivElement;
	isStudent: HTMLInputElement;
	constructor() {
		this.myForm = document.getElementById("myForm") as HTMLFormElement;
		this.nameInput = document.getElementById("name") as HTMLInputElement;
		this.result = document.getElementById("result") as HTMLDivElement;
		this.isStudent = document.getElementById("isStudent") as HTMLInputElement;
		//ici le bind est nécessaire pour que la méthode handleSubmit
		//ait accès à l'objet courant, sinon this vaudrait l'élément
		//qui a déclenché l'événement (ici le formulaire et non l'objet MyFormManager)
		this.myForm.addEventListener("submit", this.handleSubmit.bind(this));
	}

	handleSubmit(event: Event) {
		// empêcher le navigateur de soumettre le formulaire
		// ceci empêche le rechargement de la page
		event.preventDefault();
		const name = this.nameInput.value;
		if (name.length < 4) {
		this.result.style.color = "red";
		this.result.textContent = "Name must be at least 4 characters long.";
		} else {
		this.result.style.color = "green";
		if (this.isStudent.checked) {
			this.result.textContent = `Name Ok: ${name}, you are a student`;
		} else {
			this.result.textContent = `Name Ok: ${name}, you are not a student`;
		}
		}
	}
}
