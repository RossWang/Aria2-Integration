/* globals config, Parser */
'use strict';

var request = [];
var globalD = [];
var aggressive = false;

function notify(message) {
	browser.notifications.create({
		type: 'basic',
		iconUrl: '/data/icons/48.png',
		title: browser.i18n.getMessage("extensionName"),
		message: message.message || message
	});
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

function isRunning(item) {
	//check whether aria2 is runnning
	var xhttp = new XMLHttpRequest();
	var url = "aria2://"
	if (item.shutdown)
		url += "stop-with-process";
	xhttp.ontimeout = function() {
		if (item.auto) {
			var creating = browser.windows.create({
				url: url,
				type: "popup",
				width: 50,
				height: 50,
			});
			creating.then(windowInfo => {
				browser.windows.remove(windowInfo.id);
			}, () => {});
		}
	};
	xhttp.timeout = 400;
	xhttp.open("GET", item.protocol + "://" + item.host + ":" + item.port +
		"/", true);
	xhttp.send();
}

function sendTo(url, fileName, filePath, header) {
	// check whether config is set
	browser.storage.local.get("initialize", item => {
		if (!item.initialize || (item.initialize == undefined)) {
			browser.runtime.openOptionsPage();
			notify(browser.i18n.getMessage("error_setConfig"));
		}
		else {
			browser.storage.local.get(config.command.guess, function(item) {
				// check whether aria2 is runnning
				isRunning(item);
				
				// Send TO Aria2
				var xhr = new XMLHttpRequest();
				filePath = filePath.replace(/\\/g, '\\\\');
				item.path = item.path.replace(/\\/g, '\\\\');
				if (filePath != "") {
					// file path from download panel
					var params =
						`{"jsonrpc":"2.0","method":"aria2.addUri","id":"ext","params":["token:` +
						item.token + `",["` + url + `"],{"header":` + header + `,"out":"` +
						fileName + `","dir":"` + filePath + `"}]}`;
				}
				else if (item.path != "") {
					// file path from setting
					var params =
						`{"jsonrpc":"2.0","method":"aria2.addUri","id":"ext","params":["token:` +
						item.token + `",["` + url + `"],{"header":` + header + `,"out":"` +
						fileName + `","dir":"` + item.path + `"}]}`;
				}
				else {
					// default file path 
					var params =
						`{"jsonrpc":"2.0","method":"aria2.addUri","id":"ext","params":["token:` +
						item.token + `",["` + url + `"],{"header":` + header + `,"out":"` +
						fileName + `"}]}`;
				}
				
				console.log(params);
				
				// callback
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) {
						notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
					} else if (xhr.readyState == 4 && xhr.status != 0) {
						notify(browser.i18n.getMessage("error_connect"));
					}
				};
				
				// retry again after 5 seconds
				xhr.onerror = function() {
					setTimeout( () => {
						xhr.open("POST", item.protocol + "://" + item.host + ":" + item.port +
							"/" + item.interf, true);
						xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
						xhr.onerror = function() {notify(browser.i18n.getMessage("error_connect"));};
						//console.log(xhr);
						xhr.send(params)
					}, 5000);
				};
				
				xhr.timeout = 4000;
				xhr.open("POST", item.protocol + "://" + item.host + ":" + item.port +
					"/" + item.interf, true);
				xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
				xhr.send(params);
			});
		}
	});
}

function save(url, fileName, filePath, header, as, wid, incog) {
	if (fileName != "") {
		var downloading = browser.downloads.download({
			//conflictAction: "prompt",  //not work
			filename: fileName,
			//incognito: incog,  //not work
			saveAs: as,
			url: url,
		});
	} 
	else {
		var downloading = browser.downloads.download({
			//conflictAction: "prompt",  //not work
			//incognito: incog,  //not work
			saveAs: as,
			url: url,
		});
	}
	
	// close download panel
	if (wid != 0) downloading.then(id => {
		browser.windows.remove(wid)
	}, (e) => {
		notify(e)
	});
	else downloading.then(() => {}, (e) => {
		notify(e)
	});
}

function tmpopen(url, fileName, header) {
	var downloading = browser.downloads.download({
		filename: "%temp%",
		//headers: header,
		url: url
	});
	downloading.then(id => {
		var opening = browser.downloads.open(id);
		opening.then(() => {}, (e) => {
			console.log(e)
		})
	}, (e) => {
		console.log(e)
	});
}

function handleMessage(request, sender, sendResponse) {
	//console.log("Message from the content script: " +request.get);
	switch (request.get) {
		case "all":
			var d = globalD.pop();
			//var tmp = d.responseHeaders.find(x => x.name === 'Content-Type').value;
			sendResponse({
				response: "all",
				url: d.url,
				fileName: d.fileName,
				fileSize: d.fileSize,
				//fileType: tmp,
				header: d.requestHeaders,
			});
			break;
		case "download":
			sendTo(request.url, request.fileName, request.filePath, request.header);
			sendResponse({
				response: "send success"
			});
			break;
		case "save":
			save(request.url, request.fileName, request.filePath, request.header, false,
				false, request.incognito);
			sendResponse({
				response: "send success"
			});
			break;
		case "saveas":
			save(request.url, request.fileName, request.filePath, request.header, true,
				request.wid, request.incognito)
			sendResponse({
				response: "saveas create"
			});
			break;
		case "tmpopen":
			tmpopen(request.url, request.fileName, request.header);
			sendResponse({
				response: "send success"
			});
			break;
		case "changeState":
			changeState(request.checked);
			sendResponse({
				response: "send success"
			});
			break;
		case "aggressive":
			aggressive = request.aggressive;
			sendResponse({
				response: "send success"
			});
			break;
		case "contextMenus":
			contextMenus(request.contextMenus);
			sendResponse({
				response: "send success"
			});
			break;
		default:
			console.log("Message from the content script: " + request.get);
			sendResponse({
				response: "Response from background script"
			});
	}
}

function downloadPanel(d) {
	globalD.push(d);
	//get incognito
	var getting = browser.windows.getCurrent();
	getting.then((windowInfo) => {
		browser.storage.local.get(['dpTop', 'dpLeft', 'dpWidth', 'dpHeight'], item1 => {
			var creating = browser.windows.create({
				top: item1.dpTop,
				left: item1.dpLeft,
				url: "data/DownloadPanel/index.html",
				type: "popup",
				width: 412 + parseInt((screen.width / 5000) * parseInt(item1.dpWidth || 0)),
				height: 200 + parseInt(33 * window.devicePixelRatio + (screen.height / 5000) * parseInt(item1.dpHeight || 0)) ,
				incognito: windowInfo.incognito,
				//titlePreface: "Aria2",
				//state: "fullscreen",
			});
			creating.then((wInfo) => {
				function handleZoomed(zoomChangeInfo){
					browser.storage.local.get(config.command.guess, (item) => {
						if (zoomChangeInfo.tabId == wInfo.tabs[0].id) {
							var updating = browser.windows.update(wInfo.id, {
								focused: true,
								top: item1.dpTop,
								left: item1.dpLeft,
								width: parseInt(412 * zoomChangeInfo.newZoomFactor * item.zoom 
													+ (screen.width / 5000) * parseInt(item1.dpWidth || 0)),
								height: parseInt(200 * zoomChangeInfo.newZoomFactor * item.zoom
													+ 33 * window.devicePixelRatio 
													+ (screen.height / 5000) * parseInt(item1.dpHeight || 0)),
							});
							browser.tabs.onZoomChange.removeListener(handleZoomed);
						}
					});
				}
				browser.tabs.onZoomChange.addListener(handleZoomed);
			}, () => {});
		});
	}, () => {});
}

function getFileName(d) {
	// get file name
	var fileName = "";
	var id = 0;
	var id1 = 0;
	id = d.responseHeaders.findIndex(x => x.name.toLowerCase() === "content-disposition");
	if (id >= 0) {
		id1 = d.responseHeaders[id].value.lastIndexOf("\'");
		if (id1 >= 0) {
			fileName = d.responseHeaders[id].value.slice(id1 + 1);
		}
		else {
			id1 = d.responseHeaders[id].value.lastIndexOf("=");
			if (id1 >= 0) {
				fileName = d.responseHeaders[id].value.slice(id1 + 1);
			}
			else {
				id = d.url.lastIndexOf("/");
				if (id >= 0) {
					id1 = d.url.lastIndexOf("?");
					if (id1 == -1) {
						fileName = d.url.slice(id + 1);
						
					}
				}
			}
		}
	}
	else {
		id = d.url.lastIndexOf("/");
		if (id >= 0) {
			id1 = d.url.lastIndexOf("?");
			if (id1 == -1) {
				fileName = d.url.slice(id + 1);	
			}
			else {
				fileName = d.url.slice(id + 1, id1);
			}
		}
	}
	return fileName;
}

function getFileSize(d){
	var fileSize = "";
	var id = 0;
	id = d.responseHeaders.findIndex(x => x.name.toLowerCase() === "content-length");
	if (id >= 0) {
		fileSize = humanFileSize(d.responseHeaders[id].value, true);
	}
	return fileSize;
}

function getRequestHeaders(id) {
	// create header
	var id1;
	var requestHeaders = "[";
	var getheader = ['Referer', 'Cookie', 'Cookie2'];
	for (var i = 0; i < 3; i++) {
		id1 = request[id].requestHeaders.findIndex(x => x.name === getheader[i]);
		if (id1 >= 0) {
			if (requestHeaders != "[") requestHeaders += ",";
			requestHeaders += ("\"" + request[id].requestHeaders[id1].name + ": " +
				request[id].requestHeaders[id1].value + "\"");
		}
	}
	requestHeaders += "]";
	return requestHeaders;
}

function prepareDownload(d) {
	
	// get request item
	var id = request.findIndex(x => x.requestId === d.requestId);
	if (id >= 0) {
		// create header
		d.requestHeaders = getRequestHeaders(id);
		// delete request item
		request.splice(id, 1);
	}
	else {
		d.requestHeaders = ""
	}
	
	// process file name
	d.fileName = getFileName(d);
	
	// decode URI Component
	d.url = decodeURIComponent(d.url);
	d.fileName = decodeURIComponent(d.fileName);
	
	// file name cannot have ""
	d.fileName = d.fileName.replace('\"', '');
	d.fileName = d.fileName.replace('\"', '');
	
	// get file size
	d.fileSize = getFileSize(d);
	
	// create download panel
	downloadPanel(d);
	
	// avoid blank new tab
	var getting = browser.tabs.query({
			active: true,
			lastFocusedWindow: true,
			//url: "about:blank", // not allowed
			windowType: "normal"
		});
		getting.then(tabsInfo => {
			if (tabsInfo[0].url == "about:blank")
				browser.tabs.remove(tabsInfo[0].id)
		}, (e) => {console.log(e);});
}

function observeRequest(d) {
	request.push(d);
}

function observeResponse(d) {
	//console.log(d.responseHeaders);
	// bug0001: goo.gl
	if (d.statusCode == 200 || aggressive) {
		if (d.responseHeaders.find(x => x.name.toLowerCase() === 'content-disposition') != undefined) {
			var contentDisposition = d.responseHeaders.find(x => x.name.toLowerCase() ===
				'content-disposition').value.toLowerCase();
			if (contentDisposition.slice(0, 10) == "attachment") {
				//console.log(contentDisposition);
				prepareDownload(d);
				return {cancel: true};
			}
		}
		else if (d.responseHeaders.find(x => x.name.toLowerCase() === 'content-type') != undefined) {
			var contentType = d.responseHeaders.find(x => x.name.toLowerCase() === 'content-type').value
				.toLowerCase();
			if (contentType.slice(0, 11) == "application" 
				&& contentType.slice(12, 15) != "pdf" 
				&& contentType.slice(12, 29) != "x-shockwave-flash" 
				&& contentType.slice(12, 16) != "json" ) {
				//console.log(contentType);
				prepareDownload(d);
				return {cancel: true};
			}
			else if (aggressive) {
				if (contentType.slice(0, 5) == "image" ) {
					//console.log(contentType);
					prepareDownload(d);
					return {cancel: true};
				}
				else if (contentType.slice(0, 4) == "text" && contentType.slice(5, 9) != "html") {
					//console.log(contentType);
					prepareDownload(d);
					return {cancel: true};
				} 
				else if (contentType.slice(0, 4) == "vedio") {
					//console.log(contentType);
					prepareDownload(d);
					return {cancel: true};
				}
				else if (contentType.slice(0, 4) == "audio") {
					//console.log(contentType);
					prepareDownload(d);
					return {cancel: true};
				}
			}	
		}
	}
	// get request item and delete
	var id = request.findIndex(x => x.requestId === d.requestId);
	if (id >= 0) {
		request.splice(id, 1);
	}
	return false;
}

function requestError (d) {
	var id = request.findIndex(x => x.requestId === d.requestId);
	if (id >= 0) {
		request.splice(id, 1);
	}
	//console.log(d.error);
	return;
}

function tabRemoved (tabId, removeInfo) {
	var id = request.findIndex(x => x.tabId === tabId);
	while (id >= 0) {
		request.splice(id, 1);
		id = request.findIndex(x => x.tabId === tabId);
		//console.log("removed");
	}
	//console.log(tabId);
	return;
}

function changeState(enabled) {
	if (enabled) {
		var types = ["main_frame", "sub_frame"]
		browser.webRequest.onSendHeaders.addListener(observeRequest, {
			urls: ["<all_urls>"],
			types: types
		}, ["requestHeaders"]);
		browser.webRequest.onHeadersReceived.addListener(observeResponse, {
			urls: ["<all_urls>"],
			types: types
		}, ["blocking", "responseHeaders"]);
		browser.webRequest.onErrorOccurred.addListener(requestError, {
			urls: ["<all_urls>"],
			types: types
		});
		browser.tabs.onRemoved.addListener(tabRemoved);
		browser.storage.local.set({
			enabled: true
		});
		
	}
	else {
		browser.webRequest.onHeadersReceived.removeListener(observeResponse);
		browser.webRequest.onSendHeaders.removeListener(observeRequest);
		browser.webRequest.onErrorOccurred.removeListener(requestError);
		browser.tabs.onRemoved.removeListener(tabRemoved);
		request.splice(0, request.length);
		browser.storage.local.set({
			enabled: false
		});
	}
	browser.browserAction.setIcon({
		path: {
			'16': 'data/icons/' + (enabled ? '' : 'disabled/') + '16.png',
			'32': 'data/icons/' + (enabled ? '' : 'disabled/') + '32.png',
			'64': 'data/icons/' + (enabled ? '' : 'disabled/') + '64.png',
			'128': 'data/icons/' + (enabled ? '' : 'disabled/') + '128.png',
			'256': 'data/icons/' + (enabled ? '' : 'disabled/') + '256.png',
		}
	});
	browser.browserAction.setTitle({
		title: config.name + 
		` "${enabled ? browser.i18n.getMessage("enabled") : browser.i18n.getMessage("disabled")}"`
	});
}
function cmCallback (info, tab) {
	var url = (info.menuItemId === 'open-video' ? info.srcUrl : info.linkUrl);
	if (url == ""){
		notify(browser.i18n.getMessage("error_notSupported"))
	}
	else {
		var requestHeaders = "[";
		requestHeaders += ("\"referer: " + info.pageUrl + "\"");
		requestHeaders += "]";
		var d = {
			url: url,
			fileName: "",
			fileSize: "",
			requestHeaders: requestHeaders
		}
		//sendTo(url,"","",requestHeaders);
		downloadPanel(d);
		console.log(info);
	}
}
function contextMenus (enabled){
	var cmTitle = browser.i18n.getMessage("CM_title");
	if (enabled){
		browser.contextMenus.create({
			id: 'open-link',
			title: cmTitle,
			contexts: ['link'],
			documentUrlPatterns: ['*://*/*']
			});
		browser.contextMenus.create({
			id: 'open-video',
			title: cmTitle,
			contexts: ['video', 'audio'],
			documentUrlPatterns: ['*://*/*']
		});
		
		browser.contextMenus.onClicked.addListener(cmCallback);
	}
	else {
		browser.contextMenus.removeAll();
		browser.contextMenus.onClicked.removeListener(cmCallback);
	}
}

(function(callback) {
	browser.runtime.onInstalled.addListener(callback);
	//browser.runtime.onStartup.addListener(callback);
})(function() {
	browser.storage.local.get("initialize", item => {
		if(item.initialize == undefined) {
			browser.runtime.openOptionsPage();
			changeState(true);
			browser.storage.local.set({
				initialize: false
			});
		}	
	});
});

(function() {
	browser.storage.local.get("enabled", function(item) {
		changeState(item.enabled);
	});
	browser.storage.local.get(config.command.guess, (item) => {
		aggressive = item.aggressive;
		contextMenus(item.menu);
	});
	browser.runtime.onMessage.addListener(handleMessage);
})();


