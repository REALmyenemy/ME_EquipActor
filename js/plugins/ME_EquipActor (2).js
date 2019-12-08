//==============================================================
// ME_EquipActors.js
//==============================================================

/*:
* Version 1.0
* Last update 22/03/19
==============================================
	Terminos de uso:
	- Puedes modificarlo y redifundirlo en tus proyectos.
	- Puedes publicarlo en otros foros y demás, pero mandame un mensaje privado antes o enlaza a la url de Universo Maker donde posteo esto.
	- No necesito créditos aunque los acepto. Simplemente no digas que lo has hecho tú, aunque sea sencillisimo.
	- Puedes usarlo comercialmente o no comercialmente sin avisarme.
	- Este plugin viene tal y como está. Aceptaré un bug report, pero no doy soporte sobre él.
==============================================
* @author myenemy
* @plugindesc Este plugin deja equiparte objetos como compañeros de party
* @help
* Notetags: <equipActor: x> o <equipActor: x y>
* Es un plugin muy simple: pones <equipActor: x y> donde X es el número del actor
* en la base de datos y Y un parámetro opcional, por si quieres activar un
* interruptor cada vez que se equipe este objeto.
* Pones la etiqueta en notas del item. Da igual si es arma o armadura.
* Si el actor X está en el grupo y no es el que se intenta equipar el objeto,
* el actor X desaparecerá a la vez que el item se equipe. Por contraparte, cuando
* el item se desequipe, el actor volverá a agregarse.
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
					
					$gameParty.removeActor(parseInt(match[1]));
					

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