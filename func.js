import {cLog} from '@psys/js-utils/misc.js';

export async function formData_appendObject (formData, object)
{
	for ( var key in object ) 
	{
	    formData.append(key, object[key]);
	}
}

export function vstupNastavitHodnotu (name, hod, viceHodIndex = null, rod = document)
{
	if (viceHodIndex) 
	{																					
		var vst = rod.getElementsByName(name)[ viceHodIndex ];	
	}
	else
	{
		var vst = rod.querySelector('[name="'+name+'"]');
	}
	
	if (!vst) {return;}
	vst.value = hod;
}

export function disableAllInputs (parent, state)
{
	parent.querySelectorAll('input, select, canvas').forEach( (i) =>
	{														
//		cLog('i', i, vstupyVypZap);
							
		if ( ("disabled" in i.dataset) ) 
		{										//cLog('disabled', disabled, vstupyVypZap);
			i.dataset.disabled = state;
		}
		else
		{
//			cLog('state', state, vstupyVypZap);
			
			if (state)	
			{
				i.setAttribute('disabled', '');	//cLog('vypíná se', i, vstupyVypZap);
			}
			else		
			{
				i.removeAttribute('disabled');	//cLog('zapíná se', i, vstupyVypZap);
			}
		}
	} );
}