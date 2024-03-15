import { cLog, flashMessage } from '../misc.js';


export function showFlashMessages (APP_FLASHES)
{
    	// cLog('_APP_FLASHES', APP_FLASHES);
	
	for (let [typ, zpravy] of Object.entries(APP_FLASHES)) 
	{
//		cLog('zpravy', zpravy);	
//		zpravy.push('awfawfawfawf');		
   		flashMessage(zpravy.join('<br>'), 5000, typ);
	}
}