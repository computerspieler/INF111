import { pi, phi, soustraire, absolue } from "./moduleMath.js";
const resultat: HTMLDivElement = document.createElement("div");
resultat.textContent = `la valeure absolue de phi - pi = ${absolue(soustraire(phi, pi)).toString()}`;
document.body.appendChild(resultat);

import { calculerJoursRestants } from "./calculJours.js";

const travail: HTMLDivElement = document.createElement("div");
const vacances: HTMLDivElement = document.createElement("div");

const jours_restants: number[] = calculerJoursRestants(5);

travail.textContent = `Il reste ${jours_restants[0]} jour.s de travail`;
vacances.textContent = `Il reste ${jours_restants[1]} jour.s de vacances`;

document.body.appendChild(travail);
document.body.appendChild(vacances);

calculerJoursRestants(5);