import {AjaxForm} from './AjaxForm.js';
import {cLog} from '@dpsys/js-utils/misc.js';
import {isString} from '@dpsys/js-utils/is.js';


export class AjaxForms
{		
	#instances = [];

	// initializeForms = async () =>
	// {		
	// 	let uninitializedForms = [...document.querySelectorAll('form:not([data-ajax-form-initialized])')];
	// 	await Promise.all(uninitializedForms.map(async (el) => 
	// 	{												
	// 		await this.#initializeForm(el);
	// 	}));
//		cLog ('this.instances', this.instances, this.initializeForms);
	// }

	#initializeForm = (el) =>
	{		
		let newInstance = new AjaxForm(el);
		this.#instances.push(newInstance);
		el.dataset.ajaxFormInitialized = '';  //TODO: tento data atribut asi není třeba -> stačí prohledat existující instance? (to už se děje níže ve fci get?)

		return newInstance;
	}
	
	/**
	 * @param {(Node|string)} form - Node | string: CSS selector or value of name attribute
	 */	
	get (form)
	{
		var formEl;			//cLog ('form', form, this.getForm);
		
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



