import { randomID } from '../tools/randomID.js';
import { TodoTask } from './todotask.js';

/**
 * @property {nom} id - Identifiant unique (aléatoire) de la liste.
 * @property {string} nom - Le nom de la liste.
 * @property {TodoTask[]} taches - Les tâches de la liste.
 */
export class TodoList {
	/**
	 * Créer une liste
	 * @param {string} nom - Le nom de la liste.
	 * @param {string} id - L'identifiant de la liste.
	 */
	constructor(nom, id) {
		this.id = id || randomID();
		this.nom = nom;
		this.taches = [];
	}

	/**
	 * Sauvegarde la liste dans le navigateur
	 */
	sauvegarder() {
		window.localStorage.setItem(`liste_${this.id}`, JSON.stringify(this));
	}

	/**
	 * Ajouter une tâche à la liste
	 * @param {TodoTask|string} tache - La tâche à ajouter ou son nom.
	 * @return {Tache} La tâche créée
	 */
	ajouterTache(tache) {
		if (typeof tache === 'string') {
			tache = new TodoTask(tache);
		}

		this.taches.push(tache);

		return tache;
	}
}
