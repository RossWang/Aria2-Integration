'use strict';
function hashHandler(ev) {
	ev.preventDefault();
	if (location.hash != '' && location.hash != '#') {
		document.querySelector('.iframe').src = location.hash.slice(1) + ".html";
		document.querySelector('#general').className = "";
		document.querySelector('#rpc').className = "";
		document.querySelector('#exception').className = "";
		document.querySelector('#about').className = "";
		if (location.hash == "#rpc" || location.hash == "#rpc2" || location.hash == "#rpc3")
			document.querySelector("#rpc").className = "active";
		else
			document.querySelector(location.hash).className = "active";
	}
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}
window.addEventListener("hashchange", hashHandler);
document.addEventListener('DOMContentLoaded', hashHandler);
