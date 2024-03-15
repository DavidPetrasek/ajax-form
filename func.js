import {cLog} from '@dpsys/js-utils/misc.js';

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

export function getFileNames(fileInp)
{                                           //console.log('el', el);		console.log('el.files', el.files);
	var fileNames_arr = [];
	var fileNames_str = ''; 
	var separator = ', ';
	
	for (var i = 0; i < fileInp.files.length; ++i)
	{
		var fileName = fileInp.files.item(i).name.split('\\').pop();  
	
		fileNames_arr.push(fileName);
		fileNames_str += (i === 0 ? '' : separator) + fileName;
	}
	
//    console.log('fileNames_arr', fileNames_arr);
//    console.log('fileNames_str', fileNames_str);
	
	return {arr: fileNames_arr, str:fileNames_str};
}