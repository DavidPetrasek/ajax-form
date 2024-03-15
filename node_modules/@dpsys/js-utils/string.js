

export function stringTruncate (input, length) 
{
   if (input.length > length) 
   {
      return input.substring(0, length) + '...';
   }
   return input;
}

export function stringToBool (stringValue)
{
	switch(stringValue?.toLowerCase()?.trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
        case undefined:
          return false;

        default: 
          return JSON.parse(stringValue);
    }
}

/**
 * Formats a phone number as the user types it. 
 * Inserts spaces after the 3rd and 7th digits.
*/
export function formatTelephoneRealTime (e) 
{
	if (e.keyCode != 8 && e.keyCode != 46) // if the key pressed was a delete or backspace
	{
		if (e.target.value.length == 3 && !e.target.value.includes(' ')) { e.target.value += ' '; }
		if (e.target.value.length == 7 && e.target.value.match(/[' ']/g).length < 2) { e.target.value += ' '; }
	}
}