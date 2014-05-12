

/** ===== SIMPLE FUNCTIONS USED EVERYWHERE ===== */

// A simplified dice rolling function
function diceRoll(nRolled, nSides){
  var nReturn = 0;
  for(i = 0; i < nRolled; i++){
    nReturn = nReturn + Math.ceil((Math.random() * nSides));
  }
  return nReturn;
}

/** ===== DOM OBJECTS USED REPEATEDLY ===== */

var buttonFight = document.getElementById("lookForFight");

var buttonAttack = document.getElementById("attackButton");

var buttonRest = document.getElementById("rest");

var mainPic = document.getElementById("mainPic");



/** ===== ACTOR OBJECTS AND FUNCTIONALITY ===== */

// global object that is player's avatar
var playerCharacter;

// global object that is monster
var monsterCharacter;

// Create an actor object
function actor(fullName, hitpoints, maxhitpoints, strength, defense) {
  // Stats!
  this.fullName = fullName;
  this.hitpoints = hitpoints;
  this.maxhitpoints = maxhitpoints;
  this.strength = strength;
  this.defense = defense;

  // Each actor can attack a target
  this.attack = function(attackTarget) {
    alert("attack() is starting");
    // retrieving stat scores
    var attackScore = this.strength;
    var defenseScore = attackTarget.defense;
    alert("strength of attack is " + attackScore + " and defense is " + defenseScore);
    // calculating damage of attack
    //var diceResult = (Math.random() * 20);
    var diceResult = diceRoll(1, 20);
    diceResult = Math.round(diceResult * (attackScore / defenseScore));
    alert("Damage dice roll is " + diceResult);
    // deduct hitpoints from target
    attackTarget.hitpoints = attackTarget.hitpoints - diceResult;
    alert(attackTarget.fullName + " has been damaged for " + diceResult + " damage!");
  }

  // A rest action
  this.rejuvenate = function() {
    // Restore hitpoints
    this.hitpoints = maxhitpoints;
  }
}

// Initialize new player character
function createPC() {
  // Ask for player's character name
  var sName = prompt("What is your name?");
  // global playerCharacter is a new actor object
  playerCharacter = new actor(sName, 50, 50, 15, 15);
  /** alert(playerCharacter.fullName + " " + playerCharacter.hitpoints + " " + playerCharacter.strength + " " + playerCharacter.defense); */
}

// Initialize monster character as an actor object
monsterCharacter = new actor("", 0, 0, 0, 0);

// Randomly generate a monster type by name
function monsterNameGenerate(){
  var sMonsterName;
  // Randomizer, 5 possibilities
  var nNameChance = diceRoll(1, 5);
  //var nNameChance = Math.ceil(Math.random() * 5);
  if (nNameChance === 1) {
    sMonsterName = "Goblin";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/goblin.jpg";
  } else if (nNameChance === 2){
    sMonsterName = "Orc";
    monsterCharacter.sArticle = "an";
    mainPic.src = "images/orc.png";
  } else if (nNameChance === 3){
    sMonsterName = "Kobold";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/kobold.jpg";
  } else if (nNameChance === 4){
    sMonsterName = "Gnoll";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/gnoll.jpg";
  } else {
    sMonsterName = "Ogre";
    monsterCharacter.sArticle = "an";
    mainPic.src = "images/ogre.jpg";
  }
  // Return the string
  return sMonsterName;
}

// Create new opponent for playerCharacter to face against
function createNewMonster(){
  monsterCharacter.fullName = monsterNameGenerate();
  monsterCharacter.hitpoints = diceRoll(5, 6);
  monsterCharacter.maxhitpoints = 40;
  monsterCharacter.strength = diceRoll(3, 6);
  monsterCharacter.defense = diceRoll(3, 6);
  alert("You have encountered " + monsterCharacter.sArticle + " " + monsterCharacter.fullName + "!");
}



/** ===== COMBAT FUNCTIONS ===== */

// Check if target is dead
function getIsDead(deadTarget) {
  // retrieve current hitpoints of target
  var hpLeft = deadTarget.hitpoints;
  // check if current hitpoints are in the positive
  if(hpLeft > 0) {
    // Still got a pulse!
    return false;
  } else {
    // Deader than disco
    return true;
  }
}

// A full attack round
function attackCycle(opponentOne, opponentTwo){
  alert("attackCycle() starting, opponentOne is " + opponentOne.fullName + " and opponentTwo is " + opponentTwo.fullName);
  // call attack function from opponentOne on opponentTwo
  opponentOne.attack(opponentTwo);
  // Check if opponentTwo has been killed
  if(getIsDead(opponentTwo)){
    // If successfully killed
    alert("You have slain " + opponentTwo.fullName);
    // Make explore and rest buttons appear again, attack button disappear
    buttonFight.style.display = "block";
    buttonRest.style.display = "block";
    buttonAttack.style.display = "none";
    mainPic.src = "images/moor.jpg";
    return;
  } else {
    // Otherwise, it is opponentTwo's turn to retaliate
    opponentTwo.attack(opponentOne);
    // Check if opponentTwo has killed opponentOne
    if(getIsDead(opponentOne)){
      alert(opponentTwo.fullName + " has killed you! GAME OVER");
      // Yer dead, can only start a new game, all other buttons disappear
      buttonFight.style.display = "none";
      buttonRest.style.display = "none";
      buttonAttack.style.display = "none";
      mainPic.src = "images/moor.jpg";
      return;
    } else {
      return;
    }
  }
}



/** ===== BUTTON PUSHING HOOKS GOES HERE ===== */

// Start on the path of a new adventure, create new player character
// Make sure the correct buttons are displaying
function startGame(){
  mainPic.src = "images/moor.jpg";
  createPC();
  buttonFight.style.display = "block";
  buttonAttack.style.display = "none";
  buttonRest.style.display = "block";
}

// Create a monster to fight, enter combat
// Make sure the correct buttons are displaying
function lookForFight(){
  createNewMonster();
  buttonFight.style.display = "none";
  buttonAttack.style.display = "block";
  buttonRest.style.display = "none";
}

// One round of combat
function attackButton(){
  attackCycle(playerCharacter, monsterCharacter);
}

// Find an inn and restore HP to full
function restAndRestore(){
  playerCharacter.rejuvenate();
}

