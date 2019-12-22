/*:
* Version 1.1
* Last update 29/11/19
==============================================
	Terms of use
	- Feel free to modify and spread it within your projects
	- You can publish it in any forums or sites, but send me a private message before you do.
	- No need for credits, just don't claim it as your own, despite it being a easy to make plugin!
	- You may use it for commercial projects as well as non commercial projects.
	- This plugin comes as is, with no guarantees. I will accept bug reports and suggestions, but I don't give any specific support on it.
==============================================
* @author myenemy
* @plugindesc This plugin allows you to equip items as party members
* @help
* Notetags:<equipActor: x> or <equipActor: x y>
* It's quite a simple plugin type in the note box <equipActor: x y> where X is
* the actor's id in the database, and Y an optional parameter to activate
* the Y switch in case you want some control on who's equiped.
* Upon equiping, if actor X is in the party and it's not the one you want to
* equip with this item, actor X will banish from party before equiping it to
* another actor. Also, when you unequip this, the actor will join again as
* soon as you unequip this item (and the switch will go off).
*
*/


(function()
{
	var saveTheOriginalChangeEquip=Game_Actor.prototype.changeEquip;
	Game_Actor.prototype.changeEquip = function(slot, id)
	{
		if (id)
		{
			var match=isMatch(id);
			if (match)
			{
				if ($gameParty.members().contains($gameActors.actor(match[1]))&&$gameActors.actor(match[1])!=this)
				{
					if (match[2])
					{
						$gameSwitches.setValue(match[2], true);
					}
					
					// $gameParty.removeActor(parseInt(match[1]));
					// $gamePlayer.refresh();
					// $gameMap.refresh();
					// $gameMap.refreshTileEvents();
					// SceneManager.resume();
					// SceneManager.update();
					// SceneManager.updateScene();
					// SceneManager.renderScene();
					// SceneManager.changeScene();
					// SceneManager.initialize();
					// SceneManager._scene.start();

					saveTheOriginalChangeEquip.call(this,slot,id);
				}
			}
			else
				saveTheOriginalChangeEquip.call(this,slot,id);
		}
		else
		{
			var match = isMatch(this.equips()[slot]);
			if (match[2])
			{
				$gameSwitches.setValue(match[2], false);
			}
			$gameParty.addActor(parseInt(match[1]));

			saveTheOriginalChangeEquip.call(this,slot,id);
		}

	}	
})();

function isMatch(item)
{
	if (item)
		return item.note.match(/.*<equipactor:\s*([0-9]+)\s*([0-9]*)>.*/i);
	else return null;
}