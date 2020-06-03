/**
 * Générer un identifiant aléatoire
 * @return {string} L'identifiant généré.
 */
export function randomID() {
	return Math.random().toString(36).substr(2, 9);
}
