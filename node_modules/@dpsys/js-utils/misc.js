import { elCreate } from './element/util';


export function maintenanceModeNotifier (axios)
{
//	cLog('APP_MAINTENANCE_MODE_STATE', APP_MAINTENANCE_MODE_STATE, maintenanceModeNotifier);
	
	if (APP_MAINTENANCE_MODE_STATE === 'is_not_planned') 
	{
		var checkInterval_minutes = 5;
	}
	else if (APP_MAINTENANCE_MODE_STATE.message_notify_before) 
	{					   		  
		var checkInterval_minutes = 1;
	}
	else if (APP_MAINTENANCE_MODE_STATE.user_was_logged_out) 
	{					   		  
		setTimeout(() => 
		{			
			axios.post('/maintenance/ajax/check', {})
			.then( async function (response) 
			{
				location.reload();	
			});
		}, 15000);
	}	
	
	var currentIteration = 1; 
	
	var interval = setInterval(async function()
	{		
		if (currentIteration % checkInterval_minutes === 0) 
		{	
			axios.post('/maintenance/ajax/check', {})
			.then( async function (response) 
			{
//				cLog('response', response, maintenanceModeNotifier);
				
				if (response.data.message_notify_before) 
				{			
					checkInterval_minutes = 1;
					flashMessage(response.data.message_notify_before, 9000, 'notice');
				}
				else if (response.data.user_was_logged_out) 
				{		
					location.reload();
				}
			});
		}
		++currentIteration;
	}
	, 60000);  // Repeat every minute
}

export function emToPx (ems)
{
	var bodyStyle = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
	var bodyFontSize = parseFloat(bodyStyle); 					//cLog ('bodyFontSize', bodyFontSize);
		
	return ems * bodyFontSize;
}
export function pxToEm (px)
{
	var bodyStyle = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
	var bodyFontSize = parseFloat(bodyStyle); 					//cLog ('bodyFontSize', bodyFontSize);
		
	return px / bodyFontSize;
}

export function createEnum(values) 
{
	const enumObject = {};
	
	for (const val of values)
	{
		enumObject[val] = val;
	}
	
	return Object.freeze(enumObject);
}

export function rot13_decode(a) 
{
    return a.replace(/[a-zA-Z]/g, function(c){
      return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    })
}

export function cLog (popis, hod = null, fce = null)
{
	if (fce !== null) {popis = fce.name+' :: '+popis;}
	
	console.log (popis, hod);
}

export function cErr(popis, hod = null, fce = null)
{
	if (fce !== null) {popis = fce.name+' :: '+popis;}
	
	console.error(popis, hod);
}

export function flashMessage (zprava = '', trvani = 1500, cssClass = '')
{
	var elAttry = {role: 'alert', class: 'flash-message '+cssClass}; 
	var el = elCreate ('p', elAttry, zprava);
	document.body.appendChild(el);
	
	var odpocet = setTimeout( ()=>
	{
		el.remove();
	}, trvani);
}

export async function redirect (kam, afterMiliseconds = 0)
{														
	await pause(afterMiliseconds);
	
	if (kam === '') //aktuální url
	{
		location.reload();
	}
	else
	{
		location.href = kam;
	}
}

export function pause (ms) { return new Promise(res => setTimeout(res, ms)); }

export function time (format = 'sekundy') 
{
	if (format === 'sekundy')
	{
		return Math.floor(new Date().getTime() / 1000);	
	}
	if (format === 'milisekundy')
	{
		return new Date().getTime();	
	}
}


