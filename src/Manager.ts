import { cErr } from '@dpsys/js-utils/misc';
import {AjaxForm} from './AjaxForm.js';
import {isString} from '@dpsys/js-utils/is';


export class Manager
{
	/**
     * @deprecated Use ajaxForm(form) instead ajaxForm.get(form)
     * 
	 * @param formOrSelector - Form element, CSS selector or name of the form
	 */	
	get(formOrSelector:  HTMLFormElement|string): AjaxForm|null
	{
		let formEl: HTMLFormElement|null;
		
		if (isString(formOrSelector)) 
		{
			formEl = document.querySelector(formOrSelector as string);
			if (!formEl)
			{
				formEl = document.querySelector('form[name="'+formOrSelector+'"]');
			}
        }
        else {formEl = formOrSelector as HTMLFormElement;}
		
		if (!formEl) 
        {
            cErr('AjaxForm :: Form element not found', formOrSelector, this.get); 
            return null;
        }

		return new AjaxForm(formEl);
	}
}



