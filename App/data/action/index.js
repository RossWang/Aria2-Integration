'use strict';

function handleResponse(message) {
	//console.log(message);
	switch (message.response) {
		case "send success":
			break;
		default:
			console.log("Message from the content script: " + request.get);
	}
}

function handleError(error) {
	console.log(error);
}

function sw(e) {
	//console.log(e);
	var sending = browser.runtime.sendMessage({
		get: "changeState",
		checked: e.target.checked
	});
	sending.then(handleResponse, handleError);
}

function detail() {
	browser.storage.local.get("initialize", item => {
		if (!item.initialize || (item.initialize == undefined)) {
			browser.runtime.openOptionsPage();
			browser.notifications.create({
				type: 'basic',
				iconUrl: '../../data/icons/48.png',
				title: "Aria2 Integration",
				message: "you need to set(save) the config first"
			});
		} else {
			browser.tabs.create({
				url: "../../data/ariang/index.html"
			});
		}
	});
}

function launch() {
	document.getElementById('switch').addEventListener('change', sw);
	document.getElementById('detail').addEventListener('click', detail);
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	browser.storage.local.get("enabled", function(item) {
		document.getElementById('switch').checked = item.enabled;
	});
}
//document.addEventListener('WebComponentsReady', launch, false);
document.addEventListener('DOMContentLoaded', launch);