import { elCreate } from "./util";


export function formAddHiddenInput (form, data) 
{
    if (typeof form === 'string') 
    {
        form = document.querySelector(form);
	}

	Object.entries(data).forEach(entry => 
	{
  		const [key, value] = entry;
  		
		var inp = elCreate ('input', {type: 'hidden', name: key, 'value': value});		

        form.appendChild(inp);
    });
}

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

export function form_setDisabledStateAllInputs (parent, state)
{
	parent.querySelectorAll('input, select, canvas').forEach( (i) =>
	{																					
		if ( ("disabled" in i.dataset) ) 
		{									
			i.dataset.disabled = state;
		}
		else
		{
			if (state)	
			{
				i.setAttribute('disabled', '');
			}
			else		
			{
				i.removeAttribute('disabled');
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