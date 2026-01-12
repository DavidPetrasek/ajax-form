import {cErr} from '@dpsys/js-utils/misc';
import {elCreate} from "@dpsys/js-utils/el";


export class AjaxForm
{				
    el: HTMLFormElement;
    submitCallback: (formInstance: AjaxForm, formData: FormData) => void = () => {};
    
	constructor(form: HTMLFormElement)
	{
		this.el = form;
		this.el.addEventListener('submit', this.#submit);
	}

	#submit = async (e: Event) =>
	{
		e.preventDefault();	
		if (!this.#isValid()) {return;}
		var formData = this.#getFormData();	
		if (e.submitter) {formData.append(e.submitter.name, true);}	// Which button was used to submit	
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
	 */
	async showErrors (errors: {field_id: string, message: string}[]): Promise<void>
	{								
		await this.#removeErrors();	
		
		errors.forEach( (err) =>
		{			
			let field = this.el.querySelector('[id="'+err.field_id+'"]');	
			if (!field) 
			{
				cErr('AjaxForm :: Field ID not found:', err.field_id, this.showErrors);
				return;
			}
					
			let el_err = elCreate ('span', {class: 'ajax_form_error'}, err.message);													
			field.insertAdjacentElement('afterend', el_err);

			field.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
		});
	}	
	
	async #removeErrors(): Promise<void>
	{
		let errs = [...this.el.querySelectorAll('.ajax_form_error')];
		await Promise.all(errs.map(async (ch) => ch.remove()));
	}	
	
	#getFormData(): FormData
	{					
		return new FormData(this.el);
	}	
	
	reset = (): void =>
	{
		this.el.reset();
	}
}


