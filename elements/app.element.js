import { MyBaseElement } from '../tools/my-base-element.js';
import { html } from '../tools/custom-html.js';
import { STYLE_COMMON } from '../tools/styles.js';

import { NewTodoListElement } from './new-todolist.element.js';
import { TodoListElement } from './todolist.element.js';

import { TodoList } from '../models/todolist.js';

export class AppElement extends MyBaseElement {
	get styles() {
		return `
			${STYLE_COMMON}
			:host {
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				justify-content: center;
			}

			.todolist {
				flex: 0 0 18rem;
				max-width: calc(100% - 2rem);
				margin: 1rem;
				height: 25rem;
				background-color: white;
				color: black;
				box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
				border-radius: .5rem;
				overflow: hidden;
			}
		`;
	}

	constructor() {
		super();

		this.storageKey = 'todo';
		
		this.charger();

		this.shadowRoot.addEventListener('new-list', (event) => {
			this.listes.push(event.detail);
			this.update();
			this.sauvegarder();
		})

		this.shadowRoot.addEventListener('delete-list', (event) => {
			for (let i in this.listes) {
				if (this.listes[i].id !== event.detail.list.id) {
					continue;
				}
				this.listes.splice(i, 1);
				this.sauvegarder();
				break;
			}
		})

		this.shadowRoot.addEventListener('new-task', (event) => {
			for (let liste of this.listes) {
				if (liste.id !== event.detail.list.id) {
					continue;
				}
				liste.taches.push(event.detail.task);
				break;
			}
			this.sauvegarder();
		});
		this.shadowRoot.addEventListener('update-task', (event) => {
			for (let liste of this.listes) {
				if (liste.id !== event.detail.list.id) {
					continue;
				}
				for (let i in liste.taches) {
					if (liste.taches[i].id !== event.detail.task.id) {
						continue;
					}
					Object.assign(liste.taches[i],  event.detail.task);
					this.sauvegarder();
					break;
				}
				break;
			}
		});
		this.shadowRoot.addEventListener('delete-task', (event) => {
			for (let liste of this.listes) {
				if (liste.id !== event.detail.list.id) {
					continue;
				}
				for (let i in liste.taches) {
					if (liste.taches[i].id !== event.detail.task.id) {
						continue;
					}
					liste.taches.splice(i, 1);
					this.sauvegarder();
					break;
				}
				break;
			}
		});
	}

	charger() {
		const data = window.localStorage.getItem(this.storageKey);

		const listes = JSON.parse(data || '[]') || [];

		this.listes = listes;
		this.update();
	}

	sauvegarder() {
		window.localStorage.setItem(this.storageKey, JSON.stringify(this.listes));
	}

	render() {
		return `
		${this.listes && this.listes.length ?
			this.listes.map(liste => html`<section is="todo-list" class="todolist" liste="${liste}"></section>`) :
			``
		}
		
		<section is="new-todo-list" class="todolist"></section>`
	}
}
window.customElements.define('my-app', AppElement);
