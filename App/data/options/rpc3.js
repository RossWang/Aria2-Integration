'use strict';

function save() {
	const path3 = document.getElementById('path').value;
	const protocol3 = document.getElementById('protocol').value;
	const host3 = document.getElementById('host').value;
	const port3 = document.getElementById('port').value;
	const interf3 = document.getElementById('interf').value;
	const token3 = document.getElementById('token').value;
	browser.storage.local.set({
		path3,
		protocol3,
		host3,
		port3,
		interf3,
		token3,
	}, () => {
		const status = document.getElementById('status');
		status.textContent = browser.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
		}, 750);
	});
}

function restore() {
	browser.storage.local.get(Object.assign(config.command.s3), prefs => {
		document.getElementById('path').value = prefs.path3;
		document.getElementById('protocol').value = prefs.protocol3;
		document.getElementById('host').value = prefs.host3;
		document.getElementById('port').value = prefs.port3;
		document.getElementById('interf').value = prefs.interf3;
		document.getElementById('token').value = prefs.token3;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);