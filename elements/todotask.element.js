import { CustomElement } from '../tools/custom-element.js';
import { html } from '../tools/custom-html.js';
import { STYLE_A11Y, STYLE_COMMON, STYLE_FORM } from '../tools/styles.js';

import { TodoTask } from '../models/todotask.js';

/**
 * @property {TodoTask} task — La tâche à afficher
 */
export class TodoTaskElement extends CustomElement {
	static get observedAttributes() {
		return ['tache', 'liste'];
	}

	get styles() {
		return `
			${STYLE_A11Y}
			${STYLE_COMMON}
			${STYLE_FORM}

			@keyframes strike {
				0% {
					width: 0;
				}
				100% {
					width: calc(100% + .5em);
				}
			}

			:host {
				display: flex;
			}
			:host(:hover) {
				background-color: #f9f9f9;
			}

			input[type="checkbox"] {
				display: none;
			}

			button {
				flex: 0 0 auto;
				width: 3em;
			}

			label {
				flex: 1;
				padding: 1em .75em;
				vertical-align: middle;
				transition: all .2s ease-in-out;
			}

			label span {
				position: relative;
			}
			label span::after {
				content: '';
				position: absolute;
				top: 50%;
				left: -.25em;
				right: -.25em;
				width: 0;
				height: 2px;
				background: currentColor;
			}
			input:checked + label {
				opacity: .5;
			}
			input:checked + label span::after {
				width: calc(100% + .5em);
				animation-name: strike;
				animation-duration: .2s;
				animation-timing-function: ease-in-out;
				animation-iteration-count: 1;
				animation-fill-mode: forwards;
			}
		`;
	}

	constructor() {
		super();

		this.setAttribute('role', 'listitem');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		super.attributeChangedCallback(name, oldValue, newValue);
	}

	connectedCallback() {
		this.id = `liste-${this.liste.id}-tache-${this.tache.id}`;
		super.connectedCallback();

		setTimeout(() => {
			this.renderRoot.addEventListener('change', (event) => {
				const checkbox = this.renderRoot.querySelector('input[type="checkbox"]');

				if (checkbox !== event.originalTarget) {
					return;
				}

				this.changerEtatTache(!!checkbox.checked);
			});

			this.renderRoot.addEventListener('click', (event) => {
				const btn = this.renderRoot.querySelector('.bouton-supprimer');

				if (!event.originalTarget || (btn !== event.originalTarget && !btn.contains(event.originalTarget))) {
					return;
				}

				this.supprimerTache();
			});
		}, 0);
	}

	changerEtatTache(fait) {
		this.tache.fait = fait;

		const updateTaskEvent = new CustomEvent('update-task', {
			bubbles: true,
			composed: true,
			detail: {
				list: this.liste,
				task: this.tache
			}
		});

		this.renderRoot.dispatchEvent(updateTaskEvent);

		this.update();
	}

	supprimerTache() {
		const deleteTaskEvent = new CustomEvent('delete-task', {
			bubbles: true,
			composed: true,
			detail: {
				list: this.liste,
				task: this.tache
			}
		});
		
		this.renderRoot.dispatchEvent(deleteTaskEvent);

		this.parentNode.removeChild(this);
	}

	render() {
		return html`
		${this.tache ?
			html`<input type="checkbox" id="check-tache" ${this.tache.fait ? `checked` : ``}>
			<label for="check-tache">
				<span>${this.tache.nom}</span>
			</label>
			<button type="button" class="bouton-supprimer" aria-label="supprimer ${this.tache.nom}">
				<svg viewBox="0 0 640 640" fill-rule="evenodd">
					<path d="M47.103 50.174H246.57V19.583C246.57 8.81 255.37 0 266.153 0h110.116c10.783 0 19.583 8.811 19.583 19.583v30.59h197.034c6.732 0 12.224 5.505 12.224 12.237v59.966H34.88V62.41c0-6.732 5.491-12.236 12.224-12.236zm33.036 104.02h483.963c10.086 0 19.252 8.328 18.342 18.355l-40.96 449.108c-.91 10.028-8.28 18.343-18.355 18.343H120.533c-10.075 0-17.457-8.291-18.355-18.343L61.784 172.55c-.898-10.063 8.256-18.354 18.355-18.354zm314.508 69.758h51.39v340.173h-51.39V223.952zm-203.14 0h51.39v340.173h-51.39V223.952zm101.564 0h51.402v340.173H293.07V223.952z">
				</svg>
			</button>` :
			``
		}`;
	}
}
window.customElements.define('todo-task', TodoTaskElement);
