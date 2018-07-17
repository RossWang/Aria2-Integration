'use strict';
var advl = false;

function handleResponse(message) {
	//console.log(message);
	switch (message.response) {
		case "all":
			document.getElementById('url').value = message.url;
			document.getElementById('fs').textContent = message.fileSize;
			document.getElementById('fn').value = message.fileName;
			document.querySelector(".head").value = message.header;
			document.getElementById('db').focus();
			break;
		case "send success":
			var getting = browser.windows.getCurrent();
			getting.then(windowInfo => {
				browser.windows.remove(windowInfo.id)
			}, () => {});
			break;
		case "saveas create":
			break;
		default:
			console.log("Message from the content script: " + request.get);
	}
}

function handleError(error) {
	browser.notifications.create({
		type: 'basic',
		iconUrl: '/data/icons/48.png',
		title: browser.i18n.getMessage("extensionName"),
		message: error.message || error
	});
}
//////////////////////////////////////////
///////////////////////////////////////
function init() {
	var sending = browser.runtime.sendMessage({
		get: "all"
	});
	sending.then(handleResponse, handleError);
	document.documentElement.style.transformOrigin = "left top";
	browser.storage.local.get(config.command.guess, (item) => {
		document.documentElement.style.transform = "scale(" + item.zoom + ")";
	});
	document.getElementById('db').addEventListener('click', download);
	document.getElementById('sb').addEventListener('click', save);
	document.getElementById('sab').addEventListener('click', saveas);
	document.getElementById('advb').addEventListener('click', adv);
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}

function saveWinLoc (){
	browser.storage.local.get(config.command.guess, (item) => {
		if (item.windowLoc) {
			var getting = browser.windows.getCurrent();
			getting.then(windowInfo => {
				browser.storage.local.set({
					dpTop: windowInfo.top,
					dpLeft: windowInfo.left
				});
			}, () => {});
		}
	});
}

function download() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	const rpc = document.querySelector(".s1").value
	verifyFileName(fn).then((e) => {
		if (e.length != 0) {
			document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
			document.getElementById('fn').onchange = function() {
				document.getElementById('fn').style = "";
				document.getElementById('fn').onchange = null;
			};
		}
		else {
			var sending = browser.runtime.sendMessage({
				get: "download",
				url: url,
				fileName: fn,
				filePath: fp,
				header: head.split(","),
				server: rpc,
			});
			sending.then(handleResponse, handleError);
			saveWinLoc();
		}
	});
}

function save() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	verifyFileName(fn).then((e) => {
		if (e.length != 0) {
			document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
			document.getElementById('fn').onchange = function() {
				document.getElementById('fn').style = "";
				document.getElementById('fn').onchange = null;
			};
		}
		else {
			var getting = browser.windows.getCurrent();
			getting.then((windowInfo) => {
				var sending = browser.runtime.sendMessage({
					get: "save",
					url: url,
					fileName: fn,
					filePath: fp,
					header: head.split(","),
					incognito: windowInfo.incognito,
				});
				sending.then(handleResponse, handleError);
			}, (e) => console.log(e));
			saveWinLoc();
		}
	});
}

function saveas() {
	const url = document.getElementById('url').value;
	const fn = document.getElementById('fn').value;
	const fp = document.getElementById('fp').value;
	const head = document.querySelector(".head").value
	verifyFileName(fn).then((e) => {
		if (e.length != 0) {
			document.getElementById('fn').style = "border: 1px solid red;box-shadow: red 0px 0px 4px;";
			document.getElementById('fn').onchange = function() {
				document.getElementById('fn').style = "";
				document.getElementById('fn').onchange = null;
			};
		}
		else {
			var getting = browser.windows.getCurrent();
			getting.then((windowInfo) => {
				var sending = browser.runtime.sendMessage({
					get: "saveas",
					url: url,
					fileName: fn,
					filePath: fp,
					header: head.split(","),
					wid: windowInfo.id,
					incognito: windowInfo.incognito,
				});
				sending.then(handleResponse, handleError);
			}, (e) => console.log(e));
			saveWinLoc();
		}
	});
}

function adv() {
	if (advl == false) {
		var getting = browser.windows.getCurrent();
		getting.then((windowInfo) => {
			var updating = browser.windows.update(windowInfo.id, {
				height: windowInfo.height + 95,
			});
		});
		document.querySelector(".head").style = "display:block";
		document.querySelector(".s1").style = "display:block";
		advl = true;
	}
	else {
		var getting = browser.windows.getCurrent();
		getting.then((windowInfo) => {
			var updating = browser.windows.update(windowInfo.id, {
				height: windowInfo.height - 95,
			});
		});
		document.querySelector(".head").style = "display:none";
		document.querySelector(".s1").style = "display:none";
		advl = false;
	}
}

document.addEventListener('DOMContentLoaded', init);