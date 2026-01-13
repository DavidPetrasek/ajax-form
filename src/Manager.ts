import {AjaxForm} from './AjaxForm.js';
import {isString} from '@dpsys/js-utils/is';


export class Manager
{
	/**
     * @deprecated Use ajaxForm(form) instead ajaxForm.get(form)
     * 
	 * @param formOrSelector - Form element, CSS selector or name of the form
	 */	
	get(formOrSelector:  HTMLFormElement|string): AjaxForm
	{
		let formEl: HTMLFormElement|null = null;
		
		if (isString(formOrSelector)) 
		{
            // Try CSS selector first
			formEl = document.querySelector(formOrSelector as string);
			if (!formEl)
			{
                // Try form name next
				formEl = document.querySelector('form[name="'+formOrSelector+'"]');
			}
        }
        else if (formOrSelector instanceof HTMLFormElement) {formEl = formOrSelector;}
		
		if (!formEl) 
        {
            throw new Error('AjaxForm :: Form element not found');
        }

        if (formEl.ajaxFormInstance instanceof AjaxForm) 
        {
            return formEl.ajaxFormInstance;
        }
        else
        {
            return new AjaxForm(formEl);
        }
	}
}



