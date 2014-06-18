# RP-Demo-JavaScript


This is a small JavaScript-based adventure game that runs in the browser. I began this project originally to have some fun playing with object oriented programming in JavaScript while in school. It recalls the older text-based adventure games of years ago, but utilizing a rudimentary point-and-click button interface in HTML rather than a command prompt.

# How it works

To install, simply clone the files from the repo to your local machine, then open the index.html file in a browser. The files can also be uploaded to a web host and played online, though there is currently no way to interact with other players.

The interface should be pretty straightforward, if a little visually plain at the moment. Click the Start New Game button and you will be prompted for a character name. Afterward, you are ready to go.

# Under the hood

There are two major objects tracked throughout the game: the player and the opponent. Both are based on the actor object, possessing attribute stats such as hit points, attack strength, defense, etc. and combat functions. Different action functions (such as attacking) are called depending on which button is pressed by the player. After each action taken by the player, the script checks the status of the game and hides or unhides different buttons (and thus which functions can be called by the user) depending on conditions (e.g. the attack button is hidden when either the player or opponent is reduced to 0 or less hit points, this being "defeated").

# Future additions

As this was originally begun as a learning tool, the game has not yet been balanced for "fun." Some other things that would be nice to add:

1. A rudimentary "economy": Enemies should drop gold that the player can collect at the end of each combat encounter, permitting the ability to pay to spend the night at the inn (and thus not be able to restore hit points for free)
2. Experience points and a leveling system: By defeating more enemies, the player should get stronger, and thus be able to fight tougher monsters that can be generated from higher level encounter lists, perhaps even including boss type enemies
3. Upgradeable equipment: Purchaseable armor, weapons, etc. also related to the first point about an in-game economy
4. Other combat actions: Flee, use items, maybe even implement a rudimentary magic system like casting spells? Also allow some enemies to get the jump on the player on occasion (why should the player always be the first to attack?)
5. User interface: Needs to look fancier
