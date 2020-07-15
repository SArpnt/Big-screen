// ==UserScript==
// @name         Big screen
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @version      2.0.1
// @description  screen is now big boy
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
			let message = document.getElementById('message');
			let menu = document.getElementById('menu');

			let menubar = document.createElement('div');
			canvas.insertAdjacentElement('afterend', menubar);
			menubar.id = "menubar";
			menubar.className = "row justify-content-center m-0";
			menubar.appendChild(chat.parentElement);
			menubar.appendChild(menu.parentElement);
			let styleTag = document.createElement('style');
			styleTag.innerHTML = `
				#menubar:hover,#menubar:focus-within {opacity:1}
				#menubar {transition: opacity .1s; opacity: .4; width: 100%; pointer-events: none}
				#menubar > * {pointer-events: auto}
			`;
			menubar.insertAdjacentElement('afterend', styleTag);

			let state = ['s', 's']; // first indicates intended state, 2nd indicates actual state
			function setFull(u = true) {
				if (state[1] == 'f') return;
				if (u) state[0] = 'f';
				state[1] = 'f';
				worldElem.style.maxWidth = '100%';
				worldElem.style.padding = '0';
				canvas.parentElement.parentElement.style.width = 'auto';
				canvas.parentElement.parentElement.style.maxWidth = '100%';
				canvas.style.width = 'auto';
				menubar.style.position = 'absolute';
				menubar.style.bottom = '0px';
				menubar.style.opacity = '';
				if (u) update();
			}
			function setBig(u = true) {
				if (state[1] == 'b') return;
				if (u) state[0] = 'b';
				state[1] = 'b';
				worldElem.style.maxWidth = '100%';
				worldElem.style.padding = '0';
				canvas.parentElement.parentElement.style.width = 'auto';
				canvas.parentElement.parentElement.style.maxWidth = '100%';
				canvas.style.width = 'auto';
				menubar.style.position = '';
				menubar.style.bottom = '';
				menubar.style.height = '';
				menubar.style.opacity = '1';
				if (u) update();
			}
			function setSmall(u = true) {
				if (state[1] == 's') return;
				if (u) state[0] = 's';
				state[1] = 's';
				worldElem.style.maxWidth = '';
				worldElem.style.padding = '';
				canvas.parentElement.parentElement.style.width = '';
				canvas.parentElement.parentElement.style.maxWidth = '';
				canvas.style.width = '100%';
				canvas.style.height = '';
				menubar.style.position = '';
				menubar.style.bottom = '';
				menubar.style.height = '';
				menubar.style.opacity = '1';
			}

			function update() {
				if (state[0] != 's') {
					if (state[0] == 'f') canvas.style.height = `${window.innerHeight}px`; // fullscreen height
					if (state[0] == 'b' || canvas.offsetWidth > worldElem.offsetWidth) { // width fix (if window is too tall the game window would be too wide, this constrains width)
						setBig(false);
						canvas.style.height = `${window.innerHeight - menubar.offsetHeight}px`; // big height
						if (canvas.offsetWidth > worldElem.offsetWidth) canvas.style.height = `${Math.round(worldElem.offsetWidth / world.stage.width * world.stage.height)}px`; // width fix
					} else
						setFull(false);
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