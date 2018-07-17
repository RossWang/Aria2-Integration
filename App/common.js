
'use strict';
var request = [];
var globalD = [];
var aggressive = false;
var fileSizeLimit = 0;
var fileTypeFilterA = "";
var urlFilterA = "";
var fileTypeFilterB = "";
var urlFilterB = "";
var mon;

function sendTo(url, fileName, filePath, header, server) {
	// check whether config is set
	browser.storage.local.get("initialize", item => {
		if (!item.initialize || (item.initialize == undefined)) {
			browser.runtime.openOptionsPage();
			notify(browser.i18n.getMessage("error_setConfig"));
		}
		else {
			if (server == "1") {
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
					// check whether aria2 is runnning
					isRunning(item, aria2);
					
					// Send TO Aria2
					filePath = filePath.replace(/\\/g, '\\\\');
					item.path = item.path.replace(/\\/g, '\\\\');
					var params = {};
					if (header != "[]")
						params.header = header;
					params.out = fileName;
					params["parameterized-uri"]  = "false";
					if (filePath != "") {
						// file path from download panel
						params.dir = filePath;
					}
					else if (item.path != "") {
						// file path from setting
						params.dir = item.path;
					}
					if (item.protocol.toLowerCase() == "ws" || item.protocol.toLowerCase() == "wss") {
						aria2.open().then(
							function (res) {
								aria2.addUri([url], params).then(
									function (res) {
										monitor(options);
										notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										aria2.close();
									},
									function (err) {
										// retry again after 3 seconds
										setTimeout( () => {
											aria2.addUri([url], params).then(
												function (res) {
													monitor(options);
													notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
													aria2.close();
												},
												function (err) {
													console.log('Error', err);
													notify(browser.i18n.getMessage("error_connect"));
													aria2.close();
												}
											);
										}, 3000);
									}
								);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.open().then( () => {
										aria2.addUri([url], params).then(
											function (res) {
												monitor(options);
												notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
												aria2.close();
											},
											function (err) {
												console.log('Error', err);
												notify(browser.i18n.getMessage("error_connect"));
												aria2.close();
											}
										);
									}, (err) => {
										console.log('Error', err);
										notify(browser.i18n.getMessage("error_connect"));
									});
								}, 3000);
							}
						);
					}
					else {
						aria2.addUri([url], params).then(
							function (res) {
								notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.addUri([url], params).then(
										function (res) {
											notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										},
										function (err) {
											console.log('Error', err);
											notify(browser.i18n.getMessage("error_connect"));
										}
									);
								}, 3000);
							}
						);
					}
					console.log("default", url, params);
				});
			}
			else if(server == "2") {
				browser.storage.local.get(config.command.s2, function(item) {
					var secure = false;
					if (item.protocol2.toLowerCase() == "https" || item.protocol2.toLowerCase() == "wss")
						secure = true;
					var options = {
						host: item.host2,
						port: item.port2,
						secure: secure,
						secret: item.token2,
						path: "/" + item.interf2
					};
					
					var aria2 = new Aria2(options);
					
					// Send TO Aria2
					filePath = filePath.replace(/\\/g, '\\\\');
					item.path2 = item.path2.replace(/\\/g, '\\\\');
					var params = {};
					if (header != "[]")
						params.header = header;
					params.out = fileName;
					if (filePath != "") {
						// file path from download panel
						params.dir = filePath;
					}
					else if (item.path2 != "") {
						// file path from setting
						params.dir = item.path2;
					}
					if (item.protocol2.toLowerCase() == "ws" || item.protocol2.toLowerCase() == "wss") {
						aria2.open().then(
							function (res) {
								aria2.addUri([url], params).then(
									function (res) {
										notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										aria2.close();
									},
									function (err) {
										// retry again after 3 seconds
										setTimeout( () => {
											aria2.addUri([url], params).then(
												function (res) {
													notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
													aria2.close();
												},
												function (err) {
													console.log('Error', err);
													notify(browser.i18n.getMessage("error_connect"));
													aria2.close();
												}
											);
										}, 3000);
									}
								);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.open().then( () => {
										aria2.addUri([url], params).then(
											function (res) {
												notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
												aria2.close();
											},
											function (err) {
												console.log('Error', err);
												notify(browser.i18n.getMessage("error_connect"));
												aria2.close();
											}
										);
									}, (err) => {
										console.log('Error', err);
										notify(browser.i18n.getMessage("error_connect"));
									});
								}, 3000);
							}
						);
					}
					else {
						aria2.addUri([url], params).then(
							function (res) {
								notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.addUri([url], params).then(
										function (res) {
											notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										},
										function (err) {
											console.log('Error', err);
											notify(browser.i18n.getMessage("error_connect"));
										}
									);
								}, 3000);
							}
						);
					}
					console.log("rpc2", url, params);
				});
			}
			else if(server == "3") {
				browser.storage.local.get(config.command.s3, function(item) {
					var secure = false;
					if (item.protocol3.toLowerCase() == "https" || item.protocol3.toLowerCase() == "wss")
						secure = true;
					var options = {
						host: item.host3,
						port: item.port3,
						secure: secure,
						secret: item.token3,
						path: "/" + item.interf3
					};
					
					var aria2 = new Aria2(options);
					
					// Send TO Aria2
					filePath = filePath.replace(/\\/g, '\\\\');
					item.path3 = item.path3.replace(/\\/g, '\\\\');
					var params = {};
					if (header != "[]")
						params.header = header;
					params.out = fileName;
					if (filePath != "") {
						// file path from download panel
						params.dir = filePath;
					}
					else if (item.path3 != "") {
						// file path from setting
						params.dir = item.path3;
					}
					if (item.protocol3.toLowerCase() == "ws" || item.protocol3.toLowerCase() == "wss") {
						aria2.open().then(
							function (res) {
								aria2.addUri([url], params).then(
									function (res) {
										notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										aria2.close();
									},
									function (err) {
										// retry again after 3 seconds
										setTimeout( () => {
											aria2.addUri([url], params).then(
												function (res) {
													notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
													aria2.close();
												},
												function (err) {
													console.log('Error', err);
													notify(browser.i18n.getMessage("error_connect"));
													aria2.close();
												}
											);
										}, 3000);
									}
								);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.open().then( () => {
										aria2.addUri([url], params).then(
											function (res) {
												notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
												aria2.close();
											},
											function (err) {
												console.log('Error', err);
												notify(browser.i18n.getMessage("error_connect"));
												aria2.close();
											}
										);
									}, (err) => {
										console.log('Error', err);
										notify(browser.i18n.getMessage("error_connect"));
									});
								}, 3000);
							}
						);
					}
					else {
						aria2.addUri([url], params).then(
							function (res) {
								notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
							},
							function (err) {
								// retry again after 3 seconds
								setTimeout( () => {
									aria2.addUri([url], params).then(
										function (res) {
											notify(browser.i18n.getMessage("success_connect", fileName) + "\n\n" + url);
										},
										function (err) {
											console.log('Error', err);
											notify(browser.i18n.getMessage("error_connect"));
										}
									);
								}, 3000);
							}
						);
					}
					console.log("rpc3", url, params);
				});
			}
		}
	});
}

function save(url, fileName, filePath, header, as, wid, incog) {
	if (fileName != "") {
		var downloading = browser.downloads.download({
			//conflictAction: "prompt",  //not work
			filename: fileName,
			incognito: incog,  //not work under 57
			saveAs: as,
			url: url,
		});
	} 
	else {
		var downloading = browser.downloads.download({
			//conflictAction: "prompt",  //not work
			incognito: incog,  //not work under 57
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
			sendTo(request.url, request.fileName, request.filePath, request.header, request.server);
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
		case "loadSettings":
			loadSettings();
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

function getRequestHeaders(id, ua) {
	// create header
	var id1;
	var requestHeaders = [];
	if (ua){
		var getheader = ['Referer', 'Cookie', 'Cookie2', 'Authorization', 'User-Agent'];
	}
	else {
		var getheader = ['Referer', 'Cookie', 'Cookie2', 'Authorization'];
	}
	for (var i = 0; i < getheader.length; i++) {
		id1 = request[id].requestHeaders.findIndex(x => x.name === getheader[i]);
		if (id1 >= 0) {
			requestHeaders[i] = request[id].requestHeaders[id1].name + ": " +
				request[id].requestHeaders[id1].value;
		}
	}
	return requestHeaders;
}

function isException(d) {
	// check Exception
	var id = d.responseHeaders.findIndex(x => x.name.toLowerCase() === "content-length");
	if(id != -1) {
		if(Number(d.responseHeaders[id].value) < Number(fileSizeLimit)){
			return true;
		}
	}
	var id2 = d.responseHeaders.findIndex(x => x.name.toLowerCase() === 'content-type');
	if(id2 != -1) {
		if(!RegExp(fileTypeFilterA).test(d.responseHeaders[id2].value)){
			return true;
		}
		if(!RegExp(urlFilterA).test(d.url)){
			return true;
		}
		if(fileTypeFilterB != "" && RegExp(fileTypeFilterB).test(d.responseHeaders[id2].value)){
			return true;
		}
		if(urlFilterB != "" && RegExp(urlFilterB).test(d.url)){
			return true;
		}
	}
	return false;
}

async function prepareDownload(d) {
	var details = {};
	details.url = d.url;
	
	// get request item
	var id = request.findIndex(x => x.requestId === d.requestId);
	if (id >= 0) {
		// create header
		var get = browser.storage.local.get(config.command.guess);
		await get.then(item => {
			details.requestHeaders = getRequestHeaders(id, item.ua);
		});
		// delete request item
		request.splice(id, 1);
	}
	else {
		details.requestHeaders = ""
	}
	
	// process file name
	details.fileName = getFileName(d);
	
	// decode URI Component
	details.url = decodeURIComponent(details.url);
	details.fileName = decodeURIComponent(details.fileName);

	// issue #8
	try {
		details.fileName = decodeURI(escape(details.fileName));
	} catch (e){}

	// file name cannot have ""
	details.fileName = details.fileName.replace('\";', '');
	details.fileName = details.fileName.replace('\"', '');
	details.fileName = details.fileName.replace('\"', '');
	
	// correct File Name
	var getting = correctFileName(details.fileName);
	await getting.then ((name) => {
		details.fileName = name;
		}
	);
	
	// get file size
	details.fileSize = getFileSize(d);
	
	// create download panel
	browser.storage.local.get(config.command.guess, item => {
		if (item.downPanel) {
			downloadPanel(details);
		}
		else {
			sendTo(details.url,details.fileName,"",details.requestHeaders,"1");
		}
	});
	
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
				if (isException(d))
					return {cancel: false};
				prepareDownload(d);
				return {cancel: true};
			}
		}
		else if (d.responseHeaders.find(x => x.name.toLowerCase() === 'content-type') != undefined) {
			var contentType = d.responseHeaders.find(x => x.name.toLowerCase() === 'content-type').value
				.toLowerCase();
			if (contentType.slice(0, 11) == "application" 
				&& contentType.slice(12, 15) != "pdf" 
				&& contentType.slice(12, 17) != "xhtml" 
				&& contentType.slice(12, 23) != "x-xpinstall"
				&& contentType.slice(12, 29) != "x-shockwave-flash" 
				&& contentType.slice(12, 15) != "rss"
				&& contentType.slice(12, 16) != "json" ) {
				//console.log(contentType);
				if (isException(d))
					return {cancel: false};
				prepareDownload(d);
				return {cancel: true};
			}
			else if (aggressive) {
				if (contentType.slice(0, 5) == "image" ) {
					//console.log(contentType);
					if (isException(d))
						return {cancel: false};
					prepareDownload(d);
					return {cancel: true};
				}
				else if (contentType.slice(0, 4) == "text" && contentType.slice(5, 9) != "html") {
					//console.log(contentType);
					if (isException(d))
						return {cancel: false};
					prepareDownload(d);
					return {cancel: true};
				} 
				else if (contentType.slice(0, 4) == "video") {
					//console.log(contentType);
					if (isException(d))
						return {cancel: false};
					prepareDownload(d);
					return {cancel: true};
				}
				else if (contentType.slice(0, 4) == "audio") {
					//console.log(contentType);
					if (isException(d))
						return {cancel: false};
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
		title: browser.i18n.getMessage("extensionName") + 
		` "${enabled ? browser.i18n.getMessage("enabled") : browser.i18n.getMessage("disabled")}"`
	});
}
function cmCallback (info, tab) {
	var server = info.menuItemId.slice(1);
	var url = (info.parentMenuItemId === 'open-video' ? info.srcUrl : info.linkUrl);
	if (url == ""){
		notify(browser.i18n.getMessage("error_notSupported"))
	}
	else {
		browser.cookies.getAll({url:url}).then((cookies) => {
			var requestHeaders = [];
			requestHeaders[0] = ("Referer: " + info.pageUrl + "\"");
			requestHeaders[1] = ("Cookie: ");
			var cookie = {};
			for (cookie of cookies) {
				requestHeaders[1] += cookie.name;
				requestHeaders[1] += "="
				requestHeaders[1] += cookie.value;
				requestHeaders[1] += "; "
			}
			var d = {
				url: url,
				fileName: "",
				fileSize: "",
				requestHeaders: requestHeaders
			}
			browser.storage.local.get(config.command.guess, item => {
				if (item.cmDownPanel) {
					downloadPanel(d);
				}
				else {
					sendTo(url,"","",requestHeaders,server);
				}
			});
			//sendTo(url,"","",requestHeaders);
			//downloadPanel(d);
			console.log(info);
		}, (e) => {
			console.log("Error", e);
			var requestHeaders = "[";
			requestHeaders += ("\"Referer: " + info.pageUrl + "\"");
			requestHeaders += "]";
			var d = {
				url: url,
				fileName: "",
				fileSize: "",
				requestHeaders: requestHeaders
			}
			browser.storage.local.get(config.command.guess, item => {
				if (item.cmDownPanel) {
					downloadPanel(d);
				}
				else {
					sendTo(url,"","",requestHeaders,server);
				}
			});
			//sendTo(url,"","",requestHeaders);
			//downloadPanel(d);
			console.log(info);
		} );;
	}
}
function contextMenus (enabled, cmDownPanel){
	browser.contextMenus.removeAll();
	browser.contextMenus.onClicked.removeListener(cmCallback);
	var cmTitle = browser.i18n.getMessage("CM_title");
	var seD = browser.i18n.getMessage("OP_rpcDefault");
	var se2 = browser.i18n.getMessage("OP_rpc2");
	var se3 = browser.i18n.getMessage("OP_rpc3");
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
		
		if (!cmDownPanel){
			browser.contextMenus.create({
				id: 'A1',
				title: seD,
				contexts: ['link'],
				parentId: 'open-link',
				documentUrlPatterns: ['*://*/*']
			});
			browser.contextMenus.create({
				id: 'A2',
				title: se2,
				contexts: ['link'],
				parentId: 'open-link',
				documentUrlPatterns: ['*://*/*']
			});
			browser.contextMenus.create({
				id: 'A3',
				title: se3,
				contexts: ['link'],
				parentId: 'open-link',
				documentUrlPatterns: ['*://*/*']
			});
			browser.contextMenus.create({
				id: 'B1',
				title: seD,
				contexts: ['video', 'audio'],
				parentId: 'open-video',
				documentUrlPatterns: ['*://*/*']
			});
			browser.contextMenus.create({
				id: 'B2',
				title: se2,
				contexts: ['video', 'audio'],
				parentId: 'open-video',
				documentUrlPatterns: ['*://*/*']
			});
			browser.contextMenus.create({
				id: 'B3',
				title: se3,
				contexts: ['video', 'audio'],
				parentId: 'open-video',
				documentUrlPatterns: ['*://*/*']
			});
		}
		browser.contextMenus.onClicked.addListener(cmCallback);
	}
}

(function(callback) {
	browser.runtime.onInstalled.addListener(callback);
	//browser.runtime.onStartup.addListener(callback);
})(function(d) {
	browser.storage.local.get("initialize", item => {
		if(item.initialize == undefined) {
			browser.runtime.openOptionsPage();
			changeState(true);
			browser.storage.local.set({
				initialize: false
			});
		}
		else {
			browser.storage.local.get(config.command.guess, item => {
				if (d.reason == "update" && item.chgLog == true){
					browser.tabs.create({
						url: "https://github.com/RossWang/Aria2-Integration/blob/master/CHANGELOG.md"
					});
				}
			});
		}
	});
	
});

function loadSettings() {
	browser.storage.local.get(config.command.guess, (item) => {
		aggressive = item.aggressive;
		contextMenus(item.menu, item.cmDownPanel);
		fileSizeLimit = item.fileSizeLimit;
		fileTypeFilterA = item.typeFilterA;
		urlFilterA = item.urlFilterA;
		fileTypeFilterB = item.typeFilterB;
		urlFilterB = item.urlFilterB;
	});
}

(function() {
	browser.storage.local.get("enabled", function(item) {
		changeState(item.enabled);
	});
	browser.browserAction.setBadgeBackgroundColor({color: [0,0,0,100]});
	loadSettings();
	browser.runtime.onMessage.addListener(handleMessage);
})();


