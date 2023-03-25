// App global variables

let data = [];
let flippedCards = [];
let matchedCards = [];
let couples = [];
let time = 0;

// DOM accessings
const startButton = document.querySelector('button');

// App Auxiliary Functions

// 1) Function to fetch api from disney api
const fetchData = async url => {
	const response = await fetch(url);
	const data = await response.json();
	return data.data;
};

// 2) Function to generate random numbers
function generateRandomNumbers() {
	const arr = [];
	while (arr.length < 10) {
		let randomNum = Math.floor(Math.random() * 50);
		if (arr.indexOf(randomNum) === -1) arr.push(randomNum);
	}
	return arr;
}

// 3) Function to select 10 shuffled characters couples
function generate10ShuffeledCouples(data) {
	const randomNumbers = generateRandomNumbers();
	const selectedCharacters = randomNumbers.map(index => data[index]);
	return [...selectedCharacters, ...selectedCharacters].sort(
		() => Math.random - 0.5
	);
}

// 4) Function to display the 20 cards into the DOM
function renderCards(couples) {
	const cardsHtml = couples
		.map(
			char => `
			<div class="card" >
  				<div class="front">
   					 <h1>?</h1>
 				</div>
  				<div class="back">
   					 <img src="${char.imageUrl}" alt="${char.name}" width = 100px height = 100px>
 				</div>
			</div>`
		)
		.join('');
	document.querySelector('#gameBoard').innerHTML = cardsHtml;
}

// 5) Function to check the move of the user
function checkMove(card) {
	// If we try to select card that selected before and matched
	if (matchedCards.includes(card)) {
		alert('Invalid move !');
		return;
	}
	// add the checked card to the array
	flippedCards.push(card);
	// flip card
	card.classList.add('flipped');
	// Check if we have 2 checked cards in flippedCards
	if (flippedCards.length === 2) checkMatch(flippedCards[0], flippedCards[1]);
}

// 6) Function to check if there is a match move
function checkMatch(first, second) {
	// disable card clicks while checking for match
	document.querySelectorAll('.card').forEach(card => {
		card.style.pointerEvents = 'none';
	});

	// Check logic
	const card1 = first.querySelector('.back img').alt;
	const card2 = second.querySelector('.back img').alt;

	// Match case
	if (card1 === card2) {
		// add the matched pair to the matched cards array
		matchedCards.push(first, second);
		// Alert
		alertMatch(card1);
		// remove from them the listeners of checkMove
		first.removeEventListener('click', checkMove);
		second.removeEventListener('click', checkMove);

		// Check if the user end the game
		if (matchedCards.length === 20) {
			alert('כל הכבוד, הצלחתם !');
		}
	} else {
		// flip cards back over
		setTimeout(() => {
			alert('טעיתם! לא נורא, נסו שוב!');
			first.classList.remove('flipped');
			second.classList.remove('flipped');
			// enable card clicks after flipping back over
			document.querySelectorAll('.card').forEach(card => {
				card.style.pointerEvents = 'auto';
			});
		}, 500);
	}
	// Fault case
	flippedCards = [];
}

// 7) Function to Alert to the user after match
function alertMatch(characterName) {
	const c = couples.find(c => c.name === characterName);
	res = 'הצלחתם כל הכבוד!' + '\n';
	res += 'Character name : \n' + characterName + '\n';
	res += 'Films: \n' + displayProp(c.films) + '\n';
	res += 'Tv Shows: \n' + displayProp(c.tvShows) + '\n';
	res += 'Video Games: \n' + displayProp(c.videoGame) + '\n';
	res += 'Attractions: \n' + displayProp(c.parkAttractions) + '\n';
	alert(res);
}

// 8) Function to display specific property of character card
function displayProp(prop) {
	// Check if dont have values
	if (prop.length === 0) {
		return 'Dont have';
	} else {
		let length = prop.length;
		let res = `[`;
		for (let i = 0; i < length - 1; i++) res += `${prop[i]}, `;
		res += `${prop[length - 1]}]`;
		return res;
	}
}

// App Main Functions

// 1) Function to initialize the game cores
async function init() {
	data = await fetchData('https://api.disneyapi.dev/characters');
	console.log(data);
	startButton.addEventListener('click', () => {
		// Alerting to the user start play
		alert('בהצלחה !');
		// set the time when the game started
		// time = await getTime();
		couples = generate10ShuffeledCouples(data);
		renderCards(couples);
		// add event listeners to each card
		const cards = document.querySelectorAll('.card');
		cards.forEach(card => {
			card.addEventListener('click', () => {
				checkMove(card);
			});
		});
	});
}

init();
