import * as Travail from "./moduleTravail.js";
import * as Vacances from "./moduleVacances.js";

export function calculerJoursRestants(jours)
{
	return [Travail.calculerJoursRestants(jours), Vacances.calculerJoursRestants(jours)];
}
