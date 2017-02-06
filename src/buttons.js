var rendererState = 1,
	gameState = "play",
	losState = 1,
	level = '01',
	fade = document.getElementById("fade");

function exit() {
	if (rendererState == 3) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;
		child.kill();
		ipcRenderer.send('pid-message', null);
		rendererState = 4;
		resetConsole();

		setTimeout(function() {
			rendererState = 1;
			endGame();
			started = false;

			visiblitityChange();
			menu.visible = true;
		}, 500);
	}

}

function play() {
	if (rendererState == 3) {
		if (gameState == "play") {
			document.getElementById('playSvg').src = 'assets/play.svg';
			document.getElementById('playDescription').innerHTML = 'Play';
			gameState = "pause";
			child.stdin.write(`1${level}11\n`);
		} else {
			document.getElementById('playSvg').src = 'assets/pause.svg';
			document.getElementById('playDescription').innerHTML = 'Pause';
			gameState = "play";
			child.stdin.write(`2${level}11\n`);
		}
	}
}

function restart() {
	if (rendererState == 3) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;
		resetConsole();

		setTimeout(function() {
			losState = 1;
			document.getElementById('losImg').src = `assets/los1.png`;

			child.stdin.write(`2${level}12\n`);
			endGame();
			loadGame();
		}, 500);
	}
}

function los() {
	fade.style.zIndex = 10;
	fade.style.opacity = 1;
	setTimeout(function() {
		losState >= 2 ? losState = 0 : losState++;
		fade.style.zIndex = -10;
		fade.style.opacity = 0;
		document.getElementById('losImg').src = `assets/los${losState}.png`;
	}, 500);
}

function startStory() {
	if (rendererState == 1) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;

		setTimeout(function() {
			rendererState = 2;
			visiblitityChange();
			menu.visible = false;
			loadStory();
		}, 500);
	}
}

function loadChild() {
	if (rendererState != 3) {
		child = spawn('./src/ipc/codechar/bin/main');
		ipcRenderer.send('pid-message', child.pid);
		fade.style.zIndex = 10;
		fade.style.opacity = 1;

		child.stdout.on('data', (data) => {
			protobuf.load('./src/ipc/proto/state.proto', function(err, root) {
				setArrays(data, root.lookup("IPC.State"));
			});
		});
	}
}

function startGame() {
	if (rendererState != 3) {
		child.stdin.write(`2${level}12\n`);
		losState = 1;
		document.getElementById('losImg').src = `assets/los1.png`;

		setTimeout(function() {
			if (rendererState == 2)
				stage.removeChild(story);
			rendererState = 3;
			visiblitityChange();
			menu.visible = false;
			loadGame();
			setTimeout(fadeIn, 500);
		}, 500);
	}

}

function visiblitityChange() {
	if (rendererState == 1) {

		document.getElementById('slide-in').style.visibility = 'visible';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'visible';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 2) {

		document.getElementById('slide-in').style.visibility = 'hidden';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 3) {

		document.getElementById('slide-in').style.visibility = 'hidden';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'visible';

	}
}

function resetConsole() {
	userConsole.style.opacity = 0;
	userConsole.style.width = "25%";
	setTimeout(function() {userConsole.style.zIndex = -75}, 200);
	userConsole.innerHTML = "<ul id='messages'></ul>";
	consoleMessages = document.getElementById('messages');
}