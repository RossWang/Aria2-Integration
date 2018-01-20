'use strict';

function save() {
	const path2 = document.getElementById('path').value;
	const protocol2 = document.getElementById('protocol').value;
	const host2 = document.getElementById('host').value;
	const port2 = document.getElementById('port').value;
	const interf2 = document.getElementById('interf').value;
	const token2 = document.getElementById('token').value;
	browser.storage.local.set({
		path2,
		protocol2,
		host2,
		port2,
		interf2,
		token2,
	}, () => {
		const status = document.getElementById('status');
		status.textContent = browser.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
		}, 750);
	});
}

function restore() {
	browser.storage.local.get(Object.assign(config.command.s2), prefs => {
		document.getElementById('path').value = prefs.path2;
		document.getElementById('protocol').value = prefs.protocol2;
		document.getElementById('host').value = prefs.host2;
		document.getElementById('port').value = prefs.port2;
		document.getElementById('interf').value = prefs.interf2;
		document.getElementById('token').value = prefs.token2;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);