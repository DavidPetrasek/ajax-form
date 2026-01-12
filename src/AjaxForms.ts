import { cErr } from '@dpsys/js-utils/misc';
import {AjaxForm} from './AjaxForm.js';
import {isString} from '@dpsys/js-utils/is';


export class AjaxForms
{		
	#instances: AjaxForm[] = [];

	#initializeForm = (el: HTMLFormElement) : AjaxForm =>
	{		
		let newInstance : AjaxForm = new AjaxForm(el);
		this.#instances.push(newInstance);

		return newInstance;
	}
	
	/**
	 * @param formOrSelector - Form element, CSS selector or value of name attribute of the form
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

		let instance: AjaxForm | undefined = this.#instances.find( (o: AjaxForm) => 
		{		
			return o.el === formEl;
		});

		if (instance) {return instance;}
		else 		  {return this.#initializeForm(formEl);} // Lazy load
	}
}



