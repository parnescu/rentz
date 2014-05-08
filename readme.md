# Rentz


This web application was made as an learning exercise for new javascript technologies using the TDD approach. It's meant to be a companion app for the card game called ['Rentz'](http://ro.wikipedia.org/wiki/Rentz).
You can find this application running live [here](http://rentz.herokuapp.com).


## Getting started

- clone this repo
- go to terminal and navigate to 'rentz' folder
- input `npm install && npm start`
- open a new browser and navigate to `localhost:3000`
- for the tests suite go to `localhost:3000/tests`


## Using the app

- `create a new user` (go to 'Profile' and login/register your account)
- `add your players` (previously created players will be saved to the database)
- `start new game`


## Playing the game

A game can only be played if there are a minimum of three or maximum of six players.
After starting a new game, you will be propted to select the players you want to participate, continuing prompts you to arrange the players in the order you want. After that, the game will commence.
You are now prompted to choose the type of round you want to play, and can choose from a variety of 7 types:

- `red priest`:	the player that receives the red priest card (K) is awarded -150 points;
- `dames`:		players that receive any of the four queens (Q) are awarded -50 points for each card;
- `whist`:		this round plays out like a normal game of whist, for each 'hand' the player gets he's awarded +10 points;
- `broke`:		for each 'hand' the player gets he's awarded -10 points;
- `rentz`:		each player is awarded the maximum of +50 points * the number he finished the round (in a 3 player game first gets +150p, 2nd gets +100p, last gets +50p)
- `diamonds`:	each player is awarded -10p for each card of diamonds that receives throughout the round
- `totals`:		players are awarded points for each rule of the previous games (-150p if you have the red priest, -50p for each queen etc.)


## Technologies used

### Front-end:
- backbonejs
- vanillajs
- requirejs
- jasmine (for testing)
- html5 camera (works with webcams and mobile)

### Back-end:
- nodejs with express
- mongoDB
- heroku

## To do list:

1. design
	1. game details screen
	2. <s>end game/winner screen</s>
2. build with phonegap
3. add gruntjs task for source compilation