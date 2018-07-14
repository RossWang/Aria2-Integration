'use strict';

function restore() {
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");

	// Connection Status
	browser.storage.local.get(config.command.guess, function(item) {
		var sec = false;
		if (item.protocol.toLowerCase() == "https" || item.protocol.toLowerCase() == "wss") {
			sec = true;
		}
		var options = {
			host: item.host,
			port: item.port,
			secure: sec,
			secret: item.token,
			path: "/" + item.interf
		};

		var aria2 = new Aria2(options);
		aria2.getVersion().then(
			function (res) {
				console.log(res);
				document.getElementById("server1").textContent = 'version ' + res.version + ' detected';
			},
			function (err) {
				console.log(err);
				document.getElementById("server1").textContent = err;
			}
		);
	});
	browser.storage.local.get(config.command.s2, function(item) {
		var sec = false;
		if (item.protocol2.toLowerCase() == "https" || item.protocol2.toLowerCase() == "wss") {
			sec = true;
		}
		var options = {
			host: item.host2,
			port: item.port2,
			secure: sec,
			secret: item.token2,
			path: "/" + item.interf2
		};

		var aria2 = new Aria2(options);
		aria2.getVersion().then(
			function (res) {
				console.log(res);
				document.getElementById("server2").textContent = 'version ' + res.version + ' detected';
			},
			function (err) {
				console.log(err);
				document.getElementById("server2").textContent = err;
			}
		);
	});
	browser.storage.local.get(config.command.s3, function(item) {
		var sec = false;
		if (item.protocol3.toLowerCase() == "https" || item.protocol3.toLowerCase() == "wss") {
			sec = true;
		}
		var options = {
			host: item.host3,
			port: item.port3,
			secure: sec,
			secret: item.token3,
			path: "/" + item.interf3
		};

		var aria2 = new Aria2(options);
		aria2.getVersion().then(
			function (res) {
				console.log(res);
				document.getElementById("server3").textContent = 'Version ' + res.version + ' detected';
			},
			function (err) {
				console.log(err);
				document.getElementById("server3").textContent = err;
			}
		);
	});
}

document.addEventListener('DOMContentLoaded', restore);