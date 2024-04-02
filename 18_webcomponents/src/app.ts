class HTMLDateTimeElement extends HTMLElement {
	connectedCallback() {
		this.textContent = new Date().toISOString();
	}
}

class HTMLGreetingElement extends HTMLElement {
	connectedCallback() {
		const curHour = new Date().getHours();
		if(curHour >= 5 && curHour <= 12) 
			this.textContent = "Bonjour";
		else if(curHour >= 13 && curHour <= 19)
			this.textContent = "Bon après-midi";
		else
			this.textContent = "Bonsoir";
	}
}

customElements.define("date-time", HTMLDateTimeElement);
// Il semblerait qu'il faille ajouter un - pour que ça marche
customElements.define("greeting-", HTMLGreetingElement);
