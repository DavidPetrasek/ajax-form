import {cErr} from '@dpsys/js-utils/misc.js';
import {isString} from '@dpsys/js-utils/is.js';
import {elCreate} from "@dpsys/js-utils/element/util.js";
import { isEmpty } from '@dpsys/js-utils/is';


export class AjaxForm
{								
	constructor (form)
	{
		if (isString(form)) {form = document.querySelector (form);}
		
		this.el = form;
		this.el.addEventListener('submit', this.#submit);
	}

	#submit = async (e) =>
	{
		e.preventDefault();	
		if (!this.#isValid()) {return;}	
		var formData = this.#getFormData();	
		if (e.submitter && !isEmpty(e.submitter.name)) {formData.append(e.submitter.name, true);}	// Know which button was used to submit	
		await this.#removeErrors();	

		this.submitCallback(this, formData);
	}
	
	#isValid ()
	{		
		if ( !this.el.checkValidity() ) {this.el.reportValidity(); return false;}
	
		return true;
	}	
	
	/**
	 * Inserts a span element after the input field, containing the error message.
	 * 
	 * @param Array errors - contaning objects of structure {field_id: String, message: String}
	 */
	async showErrors (errors)
	{								
		await this.#removeErrors();	
		
		errors.forEach( (err) =>
		{			
			let field = this.el.querySelector('[id="'+err.field_id+'"]');	
			if (!field) 
			{
				cErr('Field ID not found:', err.field_id, this.showErrors);
				return;
			}
					
			let el_err = elCreate ('span', {class: 'error'}, err.message);													
			field.insertAdjacentElement('afterend', el_err);

			field.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
		});
	}	
	
	async #removeErrors ()
	{
		let errs = [...this.el.querySelectorAll('.error')];
		await Promise.all(errs.map(async (ch) => ch.remove()));
	}	
	
	#getFormData()
	{					
		return new FormData(this.el);
	}	
	
	reset = () =>
	{
		this.el.reset();
	}
}


