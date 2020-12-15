// ==UserScript==
// @name         Big screen
// @description  screen is now big boy
// @author       SArpnt
// @version      2.2.1
// @namespace    https://boxcrittersmods.ga/authors/sarpnt/
// @homepage     https://boxcrittersmods.ga/mods/big-screen/
// @updateURL    https://github.com/SArpnt/Big-screen/raw/master/Big%20screen.user.js
// @downloadURL  https://github.com/SArpnt/Big-screen/raw/master/Big%20screen.user.js
// @supportURL   https://github.com/SArpnt/Big-screen/issues
// @icon         https://github.com/SArpnt/Big-screen/raw/master/icon16.png
// @icon64       https://github.com/SArpnt/Big-screen/raw/master/icon64.png
// @run-at       document-start
// @grant        none
// @include      /^https:\/\/boxcritters\.com\/play\/(index\.html)?([\?#].*)?$/
// @require      https://github.com/SArpnt/joinFunction/raw/master/script.js
// @require      https://github.com/SArpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// ==/UserScript==

(function () {
	'use strict';
	let canvas,
		worldElem,
		chat,
		menu,
		menubar;

	let styleTag = document.createElement('style');
	styleTag.innerHTML = `
		#menubar:hover,#menubar:focus-within {opacity:1}
		#menubar {transition: opacity .1s; opacity: .4; width: 100%; pointer-events: none}
		#menubar > * {pointer-events: auto}
	`;
	document.documentElement.appendChild(styleTag);

	let state = ['s', 's']; // first indicates intended state, 2nd indicates actual state
	function setFull(u = true) {
		if (state[1] == 'f') return;
		if (u) state[0] = 'f';
		state[1] = 'f';
		worldElem.style.maxWidth = '100%';
		worldElem.style.padding = '0';
		canvas.parentElement.style.width = 'auto';
		canvas.parentElement.style.maxWidth = '100%';
		canvas.style.width = 'auto';
		menubar.style.position = 'absolute';
		menubar.style.bottom = '0';
		menubar.style.left = '0';
		menubar.style.right = '0';
		menubar.style.width = 'auto';
		menubar.style.opacity = '';
		if (u) update();
	}
	function setBig(u = true) {
		if (state[1] == 'b') return;
		if (u) state[0] = 'b';
		state[1] = 'b';
		worldElem.style.maxWidth = '100%';
		worldElem.style.padding = '0';
		canvas.parentElement.style.width = 'auto';
		canvas.parentElement.style.maxWidth = '100%';
		canvas.style.width = 'auto';
		menubar.style.position = '';
		menubar.style.bottom = '';
		menubar.style.left = '';
		menubar.style.right = '';
		menubar.style.width = '';
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
		canvas.parentElement.style.width = '';
		canvas.parentElement.style.maxWidth = '';
		canvas.style.width = '100%';
		canvas.style.height = '';
		menubar.style.position = '';
		menubar.style.bottom = '';
		menubar.style.left = '';
		menubar.style.right = '';
		menubar.style.width = '';
		menubar.style.height = '';
		menubar.style.opacity = '1';
	}
	function update() {
		if (state[0] != 's') {
			if (state[0] == 'f') canvas.style.height = `${window.innerHeight}px`; // fullscreen height
			if (state[0] == 'b' || canvas.offsetWidth > worldElem.offsetWidth) { // width fix (if window is too tall the game window would be too wide, this constrains width)
				setBig(false);
				canvas.style.height = `${window.innerHeight - menubar.offsetHeight}px`; // big height
				if (canvas.offsetWidth > worldElem.offsetWidth)
					canvas.style.height = `${Math.round(worldElem.offsetWidth / canvas.offsetWidth * canvas.offsetHeight)}px`; // width fix
			} else
				setFull(false);
		}
	}

	let modData = cardboard.register('bigScreen', {
		ready: false,
		screenState: state,
		setFull,
		setBig,
		setSmall,
		update,
	});

	cardboard.on('worldStageCreated', function (world, stage) {
		canvas = document.getElementById('stage');
		worldElem = document.getElementById('world');
		chat = document.getElementById('chat');
		menu = document.getElementById('menu');

		menubar = document.createElement('div');
		canvas.insertAdjacentElement('afterend', menubar);
		menubar.id = "menubar";
		menubar.className = "row justify-content-center m-0";
		menubar.appendChild(chat.parentElement);
		menubar.appendChild(menu.parentElement);

		setTimeout(function () {
			if (stage.hUpdate)
				stage.hUpdate = joinFunction(stage.hUpdate, update, stage.hUpdate);
			else
				window.addEventListener('resize', update);

			setFull();

			modData.ready = true;
		}, 0);
	});
})();