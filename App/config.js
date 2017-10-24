'use strict';
var config = {};
config.name = browser.i18n.getMessage("extensionName");
config.cookies = false;
config.command = {
	get guess() {
		return {
			path: "",
			protocol: "http",
			host: "127.0.0.1",
			port: "6800",
			interf: "jsonrpc",
			token: "",
			zoom: "1",
			menu: false,
			shutdown: false,
			aggressive: false,
			windowLoc: false,
			auto: true,
		};
	}
};