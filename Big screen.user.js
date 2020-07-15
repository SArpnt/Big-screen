// ==UserScript==
// @name         Fullscreen
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @version      2.0.0
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
			let menu = document.getElementById('menu');

			let menubar = document.createElement('div');
			canvas.insertAdjacentElement('afterend', menubar);
			menubar.id = "menubar";
			menubar.className = "row justify-content-center m-0";
			menubar.appendChild(chat.parentElement);
			menubar.appendChild(menu.parentElement);
			let styleTag = document.createElement('style')
			styleTag.innerHTML = `
				#menubar:hover {animation-name: fadein; opacity:1}
				#menubar {animation-name: fadeout; animation-duration: .1s; width: 100%; pointer-events: none}
				#menubar > * {pointer-events: auto}
				@keyframes fadein {0% {opacity:0.4}}
				@keyframes fadeout {0% {opacity:1}}
			`
			menubar.insertAdjacentElement('afterend', styleTag)

			let state = 'small';
			function setFull() {
				state = 'full';
				worldElem.style.maxWidth = '100%';
				canvas.parentElement.parentElement.style.width = 'auto';
				canvas.parentElement.parentElement.style.maxWidth = '100%';
				canvas.style.width = 'auto';
				canvas.style.maxWidth = '100%';
				menubar.style.position = 'absolute';
				menubar.style.bottom = '0px';
				menubar.style.opacity = ''
				update();
			}
			function setBig() {
				state = 'big';
				worldElem.style.maxWidth = '100%';
				canvas.parentElement.parentElement.style.width = 'auto';
				canvas.parentElement.parentElement.style.maxWidth = '100%';
				canvas.style.width = 'auto';
				canvas.style.maxWidth = '100%';
				menubar.style.position = '';
				menubar.style.bottom = '';
				menubar.style.opacity = '1'
				update();
			}
			function setSmall() {
				state = 'small';
				worldElem.style.maxWidth = '';
				canvas.parentElement.parentElement.style.width = '';
				canvas.parentElement.parentElement.style.maxWidth = '';
				canvas.style.width = '100%';
				canvas.style.maxWidth = '';
				canvas.style.height = '';
				menubar.style.position = '';
				menubar.style.bottom = '';
				menubar.style.opacity = '1'
			}

			function update() {
				if (state != 'small') {
					if (state = 'full')
						canvas.style.height = window.innerHeight + 'px';
					else if (state = 'big')
						canvas.style.height = (window.innerHeight - menubar.offsetHeight) + 'px';
					canvas.style.height = Math.round(canvas.offsetWidth / world.stage.width * world.stage.height) + 'px';
				}
			}
			if (world.stage.hUpdate)
				world.stage.hUpdate = joinFunction(update, world.stage.hUpdate);
			else
				window.addEventListener('resize', update);

			setFull();
		}, 0);
	});
})();