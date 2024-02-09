//import {vytvorElem, elPreteka, reflow} from './fce.js';
import {cLog, isString} from '../../miscellaneous.js';
import {Form} from './Form.js';
import {domReady} from '../../function.js';
import {selects} from './Select/init.js';


export class Forms
{													
	constructor ()
	{												
		this.instances = [];
		
		domReady(this.initializeForms);
	}

	initializeForms = async () =>
	{		
		let uninitializedForms = [...document.querySelectorAll('form:not([data-form-initialized])')];
		await Promise.all(uninitializedForms.map(async (el) => 
		{												
			await this.#initializeForm(el);
		}));
		
		await selects.pripravitNabidky();
//		cLog ('this.instances', this.instances, this.initializeForms);
	}

	#initializeForm = async (el) =>
	{		
		this.instances.push(new Form(el));
		el.dataset.formInitialized = '';
	}
	
	/**
	 * @param {(Node|string)} form - Node | string: querySelector, name
	 */	
	getInstance (form)
	{
		var formEl;
		
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
		
		return this.instances.find( (o) => 
		{		
			return o.el === formEl;
		});
	}
}



