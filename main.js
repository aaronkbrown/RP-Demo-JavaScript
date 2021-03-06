
/** ===== GLOBAL VARIABLES ===== */

var nKillCount = 0;

var nHitPoints = 0;

var sFeedback = "";

var damageRoll = 0;

var sJsonPath = "enemies-01.json";

var enemyArray = [];

/** Populate enemyArray[] with monster objects found in JSON file
This is so we only have to make one single GET request to the server
upon loading script rather than making repeated requests each time
the player enters combat */
$.getJSON(sJsonPath, function(data){
  var nMonsterListSize = data.enemies.length;
  // Loop through enemies array of monster objects in JSON file
  for(i = 0; i < nMonsterListSize; i++){
    enemyArray[i] = data.enemies[i];
  }
});



/** ===== SIMPLE FUNCTIONS USED EVERYWHERE ===== */

// A simplified dice rolling function
function diceRoll(nRolled, nSides){
  var nReturn = 0;
  for(i = 0; i < nRolled; i++){
    nReturn = nReturn + Math.ceil((Math.random() * nSides));
  }
  return nReturn;
}

// A function for updating notification text
//function notifySpan(spanId, messageText){
  //var spanBlock = document.getElementById(spanId);
  //spanBlock.text(messageText);
  //spanBlock.innerHTML = '';
  //spanBlock.appendChild(document.createTextNode(messageText));
//}



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
    // retrieving stat scores
    var attackScore = this.strength;
    var defenseScore = attackTarget.defense;
    // calculating damage of attack
    //var diceResult = (Math.random() * 20);
    var diceResult = diceRoll(1, 20);
    diceResult = Math.round(diceResult * (attackScore / defenseScore));
    // Track damage result in global variable for feedback tracking
    damageRoll = diceResult;
    // deduct hitpoints from target
    attackTarget.hitpoints = attackTarget.hitpoints - diceResult;
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
  nHitPoints = 50;
}

// Initialize monster character as an actor object
monsterCharacter = new actor("", 0, 0, 0, 0);

/** THIS FUNCTION DOES NOT GET CALLED ANYMORE. It is bad practice to maintain data in the functionality layer; monster data has been migrated to an external JSON file that gets called with a different function, seen in the current createNewMonster(). This function here was originally made while hosting static files without support for AJAX get requests but is unnecessary at this point */
// Randomly generate a monster type by name
/** function monsterNameGenerate(){
  var sMonsterName;
  // Randomizer, 5 possibilities
  var nNameChance = diceRoll(1, 5);
  //var nNameChance = Math.ceil(Math.random() * 5);
  if (nNameChance === 1) {
    sMonsterName = "Goblin";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/goblin.jpg";
    mainPic.alt = "A picture of a goblin";
  } else if (nNameChance === 2){
    sMonsterName = "Orc";
    monsterCharacter.sArticle = "an";
    mainPic.src = "images/orc.png";
    mainPic.alt = "A picture of an orc";
  } else if (nNameChance === 3){
    sMonsterName = "Kobold";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/kobold.jpg";
    mainPic.alt = "A picture of a kobold";
  } else if (nNameChance === 4){
    sMonsterName = "Gnoll";
    monsterCharacter.sArticle = "a";
    mainPic.src = "images/gnoll.jpg";
    mainPic.alt = "A picture of a gnoll";
  } else {
    sMonsterName = "Ogre";
    monsterCharacter.sArticle = "an";
    mainPic.src = "images/ogre.jpg";
    mainPic.alt = "A picture of an ogre";
  }
  // Return the string
  return sMonsterName;
} */

// Random generation of monster from monster list in enemyArray that was
// populated by JSON file at the top of the script
function createNewMonster(){
  // Get size of enemyArray[] array
  var nMonsterListSize = enemyArray.length;
  // Randomly pick monster entry in array
  var nMonsterIndex = diceRoll(1, nMonsterListSize) - 1;
  // Save keystrokes
  var oMonster = enemyArray[nMonsterIndex];
  // Set monster object properties and image references
  monsterCharacter.fullName = oMonster.monsterName;
  monsterCharacter.sArticle = oMonster.monsterArticle;
  mainPic.src = oMonster.picSrc;
  mainPic.alt = oMonster.picAlt;
  monsterCharacter.hitpoints = diceRoll(oMonster.hitDice, 6);
  monsterCharacter.strength = diceRoll(oMonster.strengthDice, 6);
  monsterCharacter.defense = diceRoll(oMonster.defenseDice, 6);
  // Create encounter information in feedback text block
  $('#feedback').text("You have encountered " + oMonster.monsterArticle + " " + oMonster.monsterName + "!");
}

/**
// Function has been replaced
// Create new opponent for playerCharacter to face against
function createNewMonster(){
  monsterCharacter.fullName = monsterNameGenerator();
  monsterNameGenerator();
  monsterCharacter.hitpoints = diceRoll(5, 6);
  monsterCharacter.maxhitpoints = 40;
  monsterCharacter.strength = diceRoll(3, 6);
  monsterCharacter.defense = diceRoll(3, 6);
  $('#feedback').text("You have encounted " + monsterCharacter.sArticle + " "  + monsterCharacter.fullName + "!");
} */



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
  // For feedback tracking purposes, we create two variables for recording damage
  var nPCDam = 0;
  var nMonDam = 0;
  // call attack function from opponentOne on opponentTwo
  opponentOne.attack(opponentTwo);
  // Check if opponentTwo has been killed
  nPCDam = damageRoll;
  if(getIsDead(opponentTwo)){
    // If successfully killed
    // Feedback
    $('#feedback').text("You have damaged " + opponentTwo.fullName + " for " + nPCDam + " hitpoints, " + opponentTwo.fullName + " has been slain");
    // Make explore and rest buttons appear again, attack button disappear
    buttonFight.style.display = "block";
    buttonRest.style.display = "block";
    buttonAttack.style.display = "none";
    // Update kill count global variable and notify player
    nKillCount++;
    //notifySpan("killCount", "Kills: " + nKillCount);
    $('#killCount').text("Kills: " + nKillCount);
    mainPic.src = "images/moor.jpg";
    mainPic.alt = "A picture of wilderness";
    return;
  } else {
    // Otherwise, it is opponentTwo's turn to retaliate
    opponentTwo.attack(opponentOne);
    nMonDam = damageRoll;
    // Get current HP of player after getting hit, display total in span
    nHitPoints = playerCharacter.hitpoints;
    $('#currentHealth').text("HP: " + nHitPoints);
    // Check if opponentTwo has killed opponentOne
    if(getIsDead(opponentOne)){
      // Feedback
      $('#feedback').text("You have damaged " + opponentTwo.fullName + " for " + nPCDam + " hitpoints, " + opponentTwo.fullName + " has damaged " + opponentOne.fullName + " for " + nMonDam + " hitpoints. " + opponentTwo.fullName + " has killed you! GAME OVER");
      // Yer dead, can only start a new game, all other buttons disappear
      buttonFight.style.display = "none";
      buttonRest.style.display = "none";
      buttonAttack.style.display = "none";
      mainPic.src = "images/moor.jpg";
      mainPic.alt = "A picture of wilderness";
      return;
    } else {
      $('#feedback').text("You have damaged " + opponentTwo.fullName + " for " + nPCDam + " hitpoints, " + opponentTwo.fullName + " has damaged " + opponentOne.fullName + " for " + nMonDam + " hitpoints.");
      return;
    }
  }
}



/** ===== BUTTON PUSHING HOOKS GOES HERE ===== */

// Start on the path of a new adventure, create new player character
// Make sure the correct buttons are displaying
function startGame(){
  mainPic.src = "images/moor.jpg";
  mainPic.alt = "A picture of wilderness";
  createPC();
  buttonFight.style.display = "block";
  buttonAttack.style.display = "none";
  buttonRest.style.display = "block";
  $('#currentHealth').text("HP: " + nHitPoints);
  nKillCount = 0;
  $('#killCount').text("Kills: " + nKillCount);
  $('#feedback').text("-");
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
  nHitPoints = playerCharacter.hitpoints;
  $('#currentHealth').text("HP: " + nHitPoints);
  $('#feedback').text("Your hitpoints have been restored after a full night of rest.");
}

