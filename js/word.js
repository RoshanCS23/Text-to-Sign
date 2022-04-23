
var SpeedConstants = {
	MAX: 1000,
	MIN: 200,
	DEFAULT: 600,
	STEP: 1.1,
};

var StateEnum = {
	LISTENING: 0,
	SIGNING: 1
};

var conversation = {
	playerState: StateEnum.SIGNING,
	score: 0,
	doubleLetters: 0,
	wordIndex: 0,
	letterIndex: 0,
	word: "",
	usedWords: []
};

var config = {
	maxWordIndex: 0,
	wordLengthLimit: 0,
	delay: SpeedConstants.DEFAULT,
	autospeed: true
}


function getImageFileName(letter) {
	return "img/" + letter + ".gif";
}

function getHorizontalOffset() {
	var STAGE_SIZE = 60;
	var SLIDE_AMOUNT = 5;
	var horizontalOffset = SLIDE_AMOUNT * conversation.doubleLetters;
	return horizontalOffset % STAGE_SIZE;
}

function showLetterImage(word, letterIndex, id) {
	var letter = "_";
	if (word[letterIndex].match(/[a-z]/i)) {
		// check for double letter
		if (word[letterIndex] == word[letterIndex - 1]) {
			conversation.doubleLetters++;
		}
		letter = word[letterIndex];
	}
	document.getElementById(id + "Stage").style.textAlign = "right";
	document.getElementById(id).style.paddingRight = getHorizontalOffset() + "%";
	document.getElementById(id).src = getImageFileName(letter.toLowerCase());
}

function updateLetter() {
	if (conversation.playerState == StateEnum.LISTENING) {
		if (conversation.letterIndex < conversation.word.length) {
			showLetterImage(conversation.word, conversation.letterIndex,
				"letterImage");
			conversation.letterIndex++;
			setTimeout(updateLetter, config.delay);
		} else {
			showLetterImage("_", 0, "letterImage");
			conversation.playerState = StateEnum.SIGNING;
		}
	}
}


function clearInput() {
	conversation.doubleLetters = 0;
	showLetterImage("_", 0, "inputImage");
	document.getElementById("playerInput").value = "";
	document.getElementById("playerInput").focus();
}


function setWordLengthLimit(length_lim) {
	config.wordLengthLimit = length_lim;
	config.maxWordIndex = countAvailableWords(WORDS, length_lim);
	clearUsed();
	newWord();
}

function checkWord() {
	var isCorrect = false;
	var inputText = document.getElementById("playerInput").value;
	if (inputText.length > 0) {
		if (inputText.toLowerCase() == conversation.word.toLowerCase()) {
			isCorrect = true;
			addToScore(+1);
			if (config.autospeed) {
				onSpeedIncreaseListener();
			}
		} else {
			addToScore(-1);
			if (config.autospeed) {
				onSpeedDecreaseListener();
			}
		}
	}
	return isCorrect;
}


function onTextInputListener(event) {
	var ENTER_KEY = 13;
	var input = document.getElementById('playerInput');
	if (conversation.playerState == StateEnum.LISTENING) {
		clearInput(); //Don't interrupt word.
	} else if (event.keyCode == ENTER_KEY) {
		onSubmitListener(); //Player typed something and wants to submit.
	} else if (input.value == "") { //If player types texts and then deletes it
		clearInput();
	} else {
		showLetterImage(input.value, input.value.length - 1, "inputImage");
	}
}


function onLoadListener() {
	document.getElementById("playerInput").addEventListener("keyup",
		onTextInputListener);
	document.getElementById("autospeed").onchange = onToggleAutoSpeedListener;
	document.getElementById("playerSubmitAnswer").onclick = onSubmitListener;
	document.getElementById("faster").onclick = onSpeedIncreaseListener;
	document.getElementById("slower").onclick = onSpeedDecreaseListener;
	document.getElementById("changeLimitButton").onclick = onChangeLimitListener;
	var slider = document.getElementById("speedSlider");
	slider.max = SpeedConstants.MAX;
	slider.min = SpeedConstants.MIN;
	slider.value = SpeedConstants.DEFAULT;
	slider.onchange = onSpeedChangeListener;
	WORDS.sort(compareWordlength);
	setWordLengthLimit(5);
}

window.onload = onLoadListener;
