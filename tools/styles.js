export const STYLE_COMMON = `
:host,
*,
*::before,
*::after {
	box-sizing: border-box;
}`;

export const STYLE_A11Y = `
[tabindex="-1"] { outline: none }

.sr-only {
	position: absolute !important;
	clip: rect(1px, 1px, 1px, 1px);
	padding: 0 !important;
	border: 0 !important;
	height: 1px !important;
	width: 1px !important;
	overflow: hidden;
}`;

export const STYLE_FORM = `
form {
	display: flex;
}
button,
input {
	flex: 1 0 auto;
	padding: .75rem;
	height: 3em;
	border: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background: transparent;
	font-size: inherit;
	font-family: inherit;
	line-height: inherit;
	color: inherit;
	transition: all .2s ease-in-out;
}
button {
	justify-self: end;
	height: 3em;
}
button[disabled] {
	color: #c4c4c4;
	cursor: not-allowed;
	pointer-events: none;
}
button svg {
	display: inline-block;
	width: 1em;
	height: 1em;
}
button:hover,
button:focus {
	background-color: #f1f1f1;
}`;
