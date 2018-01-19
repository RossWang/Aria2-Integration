'use strict';

function save() {
	const path = document.getElementById('path').value;
	const protocol = document.getElementById('protocol').value;
	const host = document.getElementById('host').value;
	const port = document.getElementById('port').value;
	const interf = document.getElementById('interf').value;
	const token = document.getElementById('token').value;
	if (document.getElementById('sound0').checked)
		var sound = "0";
	if (document.getElementById('sound1').checked)
		var sound = "1";
	if (document.getElementById('sound2').checked)
		var sound = "2";
	if (document.getElementById('sound3').checked)
		var sound = "3";
	browser.storage.local.set({
		path,
		protocol,
		host,
		port,
		interf,
		token,
		sound,
	}, () => {
		const status = document.getElementById('status');
		status.textContent = browser.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
		}, 750);
		browser.storage.local.set({
			initialize: true
		});
	});
}

function restore() {
	browser.storage.local.get(Object.assign(config.command.guess), prefs => {
		document.getElementById('path').value = prefs.path;
		document.getElementById('protocol').value = prefs.protocol;
		document.getElementById('host').value = prefs.host;
		document.getElementById('port').value = prefs.port;
		document.getElementById('interf').value = prefs.interf;
		document.getElementById('token').value = prefs.token;
		if (prefs.sound == "0")
			document.getElementById('sound0').checked = true;
		if (prefs.sound == "1")
			document.getElementById('sound1').checked = true;
		if (prefs.sound == "2")
			document.getElementById('sound2').checked = true;
		if (prefs.sound == "3")
			document.getElementById('sound3').checked = true;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);