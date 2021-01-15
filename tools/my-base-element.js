/**
 * @readonly
 * @property {ShadowRoot} shadowRoot — The element's shadow root
 */
export class MyBaseElement extends HTMLElement {
	get styles() {
		return '';
	}

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.render();
	}

	connectedCallback() {
		this.update();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this[name] = JSON.parse(unescape(newValue));
		this.update();
	}

	updateStyle() {
		const style = document.createElement('style');
		style.textContent = this.styles;
		this.shadowRoot.appendChild(style);
	}

	update() {
		this.shadowRoot.innerHTML = this.render();
		this.updateStyle();
	}

	setProperty(prop, value) {
		this.setAttribute(prop, escape(JSON.stringify(value)));
	}
	getProperty(prop) {
		return JSON.parse(unescape(this.getAttribute(prop)));
	}

	render() {
		return '<!-- This element is empty -->';
	}
}
