import { MyBaseElement } from '../tools/my-base-element.js';
import { html } from '../tools/custom-html.js';
import { STYLE_A11Y, STYLE_COMMON, STYLE_FORM } from '../tools/styles.js';

import { TodoTaskElement } from './todotask.element.js';

import { TodoList } from '../models/todolist.js';
import { TodoTask } from '../models/todotask.js';

/**
 * @property {TodoList} list — La liste à afficher
 */
export class TodoListElement extends MyBaseElement {
	static get observedAttributes() {
		return ['liste'];
	}

	get styles() {
		return `
			${STYLE_A11Y}
			${STYLE_COMMON}
			${STYLE_FORM}

			:host {
				display: flex;
				flex-direction: column;
				justify-self: stretch;
				align-self: stretch;
			}

			h1 {
				display: flex;
				margin: 0;
				font-size: 1.5rem;
				text-align: center;
				border-bottom: 1px solid #f1f1f1;
			}
			h1 span {
				display: block;
				flex: 1 0 auto;
				order: 1;
				padding: .5rem 1rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			h1 button {
				order: 0;
				flex: 0 0 auto;
				font-size: 1rem;
				padding: .75rem;
				width: 3em;
			}

			.tasks,
			.empty-list {
				flex: 1 0 auto;
				margin: 0;
				padding: 0;
			}

			.tasks {
				overflow-y: auto;
			}
			.tasks li {
				margin: 0;
				padding: 0;
				list-style-type: none;
			}
			.tasks li + li {
				border-top: 1px solid #f1f1f1;
			}

			.empty-list {
				display: flex;
				padding: .5em;
				text-align: center;
				font-weight: bold;
				font-style: italic;
			}
			.empty-list p {
				flex: 1;
				align-self: center;
			}
			.empty-list label {
				display: block;
				margin-top: 2em;
			}
			
			.formulaire-ajout-tache {
				position: relative;
				justify-self: end;
				display: flex;
				border-top: 1px solid #f1f1f1;
			}
			.formulaire-ajout-tache:hover,
			.formulaire-ajout-tache:focus-within {
				border-color: #c4c4c4;
			}
			.formulaire-ajout-tache button {
				flex: 0 0 auto;
				justify-self: end;
			}
		`;
	};

	constructor() {
		super();

		this.shadowRoot.addEventListener('delete-task', (event) => {
			const task = event.detail.task;

			for (let i in this.liste.taches) {
				if (this.liste.taches[i].id === task.id) {
					this.liste.taches.splice(i, 1);
					break;
				}
			}
		});
	}

	connectedCallback() {
		this.id = 'todolist-' + this.liste.id;
		super.connectedCallback();

		setTimeout(() => {
			this.shadowRoot.addEventListener('click', (event) => {
				const btn = this.shadowRoot.querySelector('h1 button');

				if (!event.target || (btn !== event.target && !btn.contains(event.target))) {
					return;
				}

				this.supprimerListe();
			});

			this.shadowRoot.addEventListener('submit', this.creerTache.bind(this));

			this.shadowRoot.addEventListener('input', () => {
				const input = this.shadowRoot.querySelector('form input[type="text"]');
				const btn = this.shadowRoot.querySelector('form button[type="submit"]');

				btn.disabled = !(input.value && input.value.length);
			})
		}, 0);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		super.attributeChangedCallback(name, oldValue, newValue);
	}

	supprimerListe() {
		const deleteListEvent = new CustomEvent('delete-list', {
			bubbles: true,
			composed: true,
			detail: {
				list: this.liste
			}
		});

		this.shadowRoot.dispatchEvent(deleteListEvent);

		this.parentNode.removeChild(this);
	}

	creerTache(event) {
		event.preventDefault();

		const input = this.shadowRoot.querySelector('.formulaire-ajout-tache input[type="text"]');
		const name = input.value;

		this.nouvelleTache = new TodoTask(name);
		this.liste.taches.push(this.nouvelleTache);
		this.update();

		setTimeout(() => {
			this.nouvelleTache = undefined;
			this.update();
		}, 5000);

		input.value = '';

		const createTaskEvent = new CustomEvent('new-task', {
			bubbles: true,
			detail: {
				list: this.liste,
				task: this.nouvelleTache
			}
		});

		this.dispatchEvent(createTaskEvent);
	}

	render() {
		return html`
		${this.liste ?
			`<h1 tabindex="-1">
				<span>${this.liste.nom}</span>

				<button type="button" aria-label="supprimer ${this.liste.nom}">
					<svg viewBox="0 0 640 640" fill-rule="evenodd">
						<path d="M47.103 50.174H246.57V19.583C246.57 8.81 255.37 0 266.153 0h110.116c10.783 0 19.583 8.811 19.583 19.583v30.59h197.034c6.732 0 12.224 5.505 12.224 12.237v59.966H34.88V62.41c0-6.732 5.491-12.236 12.224-12.236zm33.036 104.02h483.963c10.086 0 19.252 8.328 18.342 18.355l-40.96 449.108c-.91 10.028-8.28 18.343-18.355 18.343H120.533c-10.075 0-17.457-8.291-18.355-18.343L61.784 172.55c-.898-10.063 8.256-18.354 18.355-18.354zm314.508 69.758h51.39v340.173h-51.39V223.952zm-203.14 0h51.39v340.173h-51.39V223.952zm101.564 0h51.402v340.173H293.07V223.952z">
					</svg>
				</button>
			</h1>

			${this.liste.taches && this.liste.taches.length ?
				html`
			<ul class="tasks">${
				this.liste.taches.map(tache => html`
				<li>
					<todo-task tache="${tache}" liste="${this.liste}"></todo-task>
				</li>`)
			}</ul>` :
				html`
			<div class="empty-list">
				<p>
					Cette liste a l'air vide…<br>
					<label for="input-ajout-tache">Ajoutez une tâche ↓</label>
				</p>
			</div>`}

			<form class="formulaire-ajout-tache">
				<label for="input-ajout-tache" class="sr-only">Rédigez une nouvelle tâche à faire</label>
				<input type="text" id="input-ajout-tache" aria-invalid="true" aria-label="Rédigez une nouvelle tâche à faire" placeholder="Ex. : Rédiger un tutoriel">
				<button type="submit" disabled>Ajouter</button>

				${this.nouvelleTache ? html`<div role="status" aria-live="polite" class="sr-only">${this.nouvelleTache.nom} a été ajouté</div>` : ''}
			</form>` :
			``
		}
		`;
	}
}
window.customElements.define('todo-list', TodoListElement, { extends: 'section' });
