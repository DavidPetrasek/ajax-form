import {AjaxForm} from './AjaxForm.js';
import {cLog} from '@psys/js-utils/misc.js';
import {isString} from '@psys/js-utils/is.js';


export class AjaxForms
{		
	#instances = [];

	// initializeForms = async () =>
	// {		
	// 	let uninitializedForms = [...document.querySelectorAll('form:not([data-form-initialized])')];
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
		el.dataset.formInitialized = '';

		return newInstance;
	}
	
	/**
	 * @param {(Node|string)} form - Node | string: querySelector or content of name attribute
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
			
			if (!formEl) {console.error('Form does not exist.'); return null;}
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



