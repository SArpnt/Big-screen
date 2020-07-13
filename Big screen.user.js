// ==UserScript==
// @name         Big screen
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @version      1.0.0
// @description  big boy
// @author       SArpnt
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://github.com/sarpnt/joinFunction/raw/master/script.js
// @require      https://github.com/sarpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// ==/UserScript==

(function () {
	'use strict';
	cardboard.on('worldStageCreated', function () {
		setTimeout(function () {
			let canvas = document.getElementById('stage');
			let worldElem = document.getElementById('world');
			let chat = document.getElementById('chat');

			let isBig = false;
			function setBig() {
				isBig = true;
				worldElem.style.maxWidth = '100%';
				canvas.parentElement.parentElement.style.width = 'auto';
				canvas.parentElement.parentElement.style.maxWidth = '100%';
				canvas.style.width = 'auto';
				canvas.style.maxWidth = '100%';
				update();
			}
			function setSmall() {
				isBig = false;
				worldElem.style.maxWidth = '';
				canvas.parentElement.parentElement.style.width = '';
				canvas.parentElement.parentElement.style.maxWidth = '';
				canvas.style.width = '100%';
				canvas.style.maxWidth = '';
				canvas.style.height = '';
			}

			function update() {
				if (isBig) {
					canvas.style.height = (window.innerHeight - chat.parentElement.offsetHeight) + 'px';
					canvas.style.height = Math.round(canvas.offsetWidth / world.stage.width * world.stage.height) + 'px';
				}
			}
			if (world.stage.hUpdate)
				world.stage.hUpdate = joinFunction(update, world.stage.hUpdate);
			else
				window.addEventListener('resize', update);

			setBig();
		}, 0);
	});
})();