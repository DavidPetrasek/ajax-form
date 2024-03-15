import {pauza} from '../fce.js';


export function prehratPrechody (el, prechody)
{
	return new Promise(resolve =>
	{
   		var it = 0;
		var opacity = [0];
		var pr;
	
		(async function foo()
		{									pr = prechody[it];
			if (pr.text)
			{
				el.innerHTML = pr.text;
			
				await zmenitPruhlednost (el, true, opacity); 	//console.log ('je vidět: ' + opacity[0]);
				if (pr.pauza) {await pauza(pr.pauza);}								//console.log ('pauza');
				if (!pr.pouzeZesilit) {await zmenitPruhlednost (el, false, opacity);} //console.log ('není vidět: ' + opacity[0]);
			}
			else
			{
				await pauza(pr.pauza); //console.log ('pouze pauza: ' + prechody[it].pauza);
			}		    

			++it; //console.log ('opakovani: '+it);
			if		(it < prechody.length) 	{foo();}
			else if (it === prechody.length) 	{resolve(true);}
		}
		)();
	})
}


export function zmenitPruhlednost(el, smer, opacity)
{
	return new Promise(resolve =>
	{		   
		var interval = setInterval( () =>
		{
			if (smer) {opacity[0] = opacity[0] + 0.05;}
			else
			{
					 opacity[0] = opacity[0] - 0.05;
				if ( opacity[0] < 0 ) {opacity[0] = 0;}
			}
		   
    		el.style.opacity = opacity[0]; //console.log ('opacity: '+opacity);  
    	                  
    		if ( opacity[0] >= 1  ||  opacity[0] === 0 )
			{
				clearInterval(interval); resolve(true);
			} 
		}
    	, 20);
	})
}