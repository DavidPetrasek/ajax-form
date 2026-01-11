import {AjaxForm} from './AjaxForm.js';
import {isString} from '@dpsys/js-utils/is.js';


export class AjaxForms
{		
	#instances = [];

	#initializeForm = (el) =>
	{		
		let newInstance = new AjaxForm(el);
		this.#instances.push(newInstance);
		el.dataset.ajaxFormInitialized = '';

		return newInstance;
	}
	
	/**
	 * @param {(Node|string)} form - Node | string: CSS selector or value of name attribute
	 */	
	get (form)
	{
		var formEl;
		
		if ( isString(form) ) 
		{
			formEl = document.querySelector(form);
			if (!formEl) 
			{
				formEl = document.querySelector('form[name="'+form+'"]');
			}
			
			if (!formEl) {return null;}
		}
		else
		{
			formEl = form;
		}
		
		let instance = this.#instances.find( (o) => 
		{		
			return o.el === formEl;
		});

		if (instance) {return instance;}
		else 		  {return this.#initializeForm(formEl);} // Lazy load
	}
}



