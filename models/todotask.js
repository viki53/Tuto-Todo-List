import { randomID } from '../tools/randomID.js';

/**
 * @readonly
 * @property {nom} id - Identifiant unique (aléatoire) de la tâche.
 * @property {string} nom - Le nom de la tâche.
 * @property {bool} fait - Définit si la tâche est réalisée.
 */
export class TodoTask {
	/**
	 * Créer une tâche
	 * @param {TodoList} liste - La liste à laquelle appartient la tâche.
	 * @param {string} nom - Le nom de la tâche.
	 * @param {string} id - L'identifiant de la tâche.
	 */
	constructor(nom, id, fait = false) {
		this.nom = nom;
		this.id = id || randomID();
		this.fait = fait;
	}

	/**
	 * Sauvegarde la tâche dans le navigateur
	 */
	sauvegarder() {
		window.localStorage.setItem(`tache_${this.id}`, JSON.stringify(this));
	}

	/**
	 * Changer l'état de la tâche
	 * @argument {bool} fait ¬ Le nouvel état de la tache
	 */
	changerEtatTache(fait) {
		this.fait = fait;
	}
}
