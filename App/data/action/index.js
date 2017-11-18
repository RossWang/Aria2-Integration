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
				iconUrl: '/data/icons/48.png',
				title: browser.i18n.getMessage("extensionName"),
				message: browser.i18n.getMessage("error_setConfig")
			});
		} 
		else {
			browser.storage.local.get(config.command.guess, function(item) {
				var ariangUrl = "../../data/ariang/index.html"
				if (item.autoSet) {
					ariangUrl += "#!/settings/rpc/set/";
					ariangUrl += (item.protocol + "/" + item.host + "/" + item.port + "/" + 
					item.interf + "/" + btoa(item.token));
				}
				browser.tabs.create({
					url: ariangUrl
				});
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