'use strict'

postMessage("init");
importScripts("aria.js");
importScripts("polygoat.js");
var aria2;

onmessage = function(e) {
	if (aria2 == undefined){
		connect(e.data[0]);
		postMessage("connect");
	};
	/*aria2.tellActive(["gid"]).then((info) => {
		postMessage(["badge", info.length]);
		if(info.length == 0) {
			aria2.close();
			close();
		}
	});*/
	
}

function connect(options) {
	aria2 = new Aria2(options);
	aria2.onclose = function () {
		aria2 = null;
	}
	aria2.onDownloadStart = function(d) {
		aria2.tellActive(["gid"]).then((info) => {
			postMessage(["badge", info.length]);
			if(info.length == 0) {
				aria2.close();
				postMessage("close");
				close();
			}
		});
	};
	aria2.onDownloadComplete = function(d) {
		aria2.getFiles(d.gid).then((info) => {
			postMessage(["complete", info[0].path]);
		});
		aria2.tellActive(["gid"]).then((info) => {
			postMessage(["badge", info.length]);
			if(info.length == 0) {
				aria2.close();
				postMessage("close");
				close();
			}
		});
	};
	aria2.onDownloadPause = aria2.onDownloadStop = function(d) {
		aria2.tellActive(["gid"]).then((info) => {
			postMessage(["badge", info.length]);
			if(info.length == 0) {
				aria2.close();
				postMessage("close");
				close();
			}
		});
	};
	aria2.onDownloadError = function(d) {
		aria2.getUris(d.gid).then((info) => {
			postMessage(["error", info[0].uri]);
		});
		aria2.tellActive(["gid"]).then((info) => {
			postMessage(["badge", info.length]);
			if(info.length == 0) {
				aria2.close();
				postMessage("close");
				close();
			}
		});
	};
	aria2.open().then(() => {
		aria2.tellActive(["gid"]).then((info) => {
			postMessage(["badge", info.length]);
			if(info.length == 0) {
				aria2.close();
				postMessage("close");
				close();
			}
		});
	});
}