'use strict'

postMessage({msg: "init"});
importScripts("aria.js");
var aria2;
var gids = new Map();

onmessage = function(e) {
	gids.set(e.data.gid, e.data.invoke);
	if (aria2 === undefined) {
		connect(e.data.options);
		postMessage({msg: "connect"});
	}
}

function cleanup() {
	gids.clear();
	postMessage({msg: "close"});
	close();
}

function updateBadge() {
	aria2.tellActive(["gid"]).then((info) => {
		postMessage({
			type: "badge",
			count: info.length
		});
		if(info.length == 0) {
			aria2.close();
			cleanup();
		}
	});
}

function connect(options) {
	aria2 = new Aria2(options);
	aria2.onclose = function () {
		aria2 = undefined;
		cleanup();
	}
	aria2.onDownloadStart = function(d) {
		updateBadge();
	};
	aria2.onDownloadComplete = function(d) {
		const invoke = gids.get(d.gid);
		if (invoke !== undefined) {
			aria2.getFiles(d.gid).then((info) => {
				postMessage({
					type:"complete",
					path: info[0].path,
					invoke: invoke
				});
			});
			gids.delete(d.gid);
		}
		updateBadge();
	};
	aria2.onDownloadPause = aria2.onDownloadStop = function(d) {
		updateBadge();
	};
	aria2.onDownloadError = function(d) {
		aria2.tellStatus(d.gid).then((info) => {
			postMessage({
				type: "error",
				msg: info.errorMessage,
				url: info.files[0].uris[0].uri
			});
		});
		updateBadge();
	};
	aria2.open().then(() => {
		updateBadge();
	});
}