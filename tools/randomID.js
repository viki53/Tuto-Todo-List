/**
 * Générer un identifiant aléatoire
 * @return {string} L'identifiant généré.
 */
export function randomID() {
	if (window.crypto && window.crypto.randomBytes) {
		return window.crypto.randomBytes(20).toString('hex');
	}
	return Math.random().toString(36).substr(2, 9);
}
