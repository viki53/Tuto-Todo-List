export function html(strings, ...values) {
	const l = strings.length - 1;
	let html = '';

	for (let i = 0; i < l; i++) {
		const s = strings[i];
		let v = values[i];

		if (Array.isArray(v)) {
			v = v.join('');
		}
		if (typeof v === 'object') {
			v = escape(JSON.stringify(v));
		}
		html += s + v;
	}
	html += strings[l];

	return html;
}
