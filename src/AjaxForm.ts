import {cErr, cLog} from '@dpsys/js-utils/misc';
import {elCreate} from "@dpsys/js-utils/el";
import { isEmpty } from '@dpsys/js-utils/is';


export class AjaxForm
{				
    #formEl: HTMLFormElement;
    #submitCallback: (axForm: AjaxForm, formData: FormData) => void = () => {};
    
	constructor(form: HTMLFormElement)
	{
		this.#formEl = form;                 //cLog('AjaxForm :: Initialized', this.#formEl);
		this.#formEl.addEventListener('submit', this.#submit);
        this.#formEl.ajaxFormInstance = this; // Prevent multiple instances/eventListeners on the same form
	}

	#submit = async (e: SubmitEvent) =>
	{
		e.preventDefault();	                //cLog('AjaxForm :: Submit intercepted', this.#submit);
		if (!this.#isValid()) {return;}
		var formData = this.#getFormData();	//cLog('AjaxForm :: Form data collected', formData);
		if (e.submitter && !isEmpty((e.submitter as HTMLButtonElement).name)) {formData.append((e.submitter as HTMLButtonElement).name, 'true');}	// Which button was used to submit	
		await this.#removeErrors();	

		this.#submitCallback(this, formData);
	}
	
	#isValid ()
	{
		if ( !this.#formEl.checkValidity() ) {this.#formEl.reportValidity(); return false;}
	
		return true;
	}

    setSubmitCallback(clb: (axForm: AjaxForm, formData: FormData) => void)
    {
        if (typeof clb !== 'function')
        {
            throw new Error('AjaxForm :: submitCallback is not a function');
        }

        this.#submitCallback = clb;
    }

    /**
     * @deprecated submitCallback property is deprecated and will be removed in the next major release. Use setSubmitCallback() method instead.
     */
    set submitCallback(clb: (axForm: AjaxForm, formData: FormData) => void)
    {
        this.setSubmitCallback(clb);
    }
    
	/**
	 * Inserts a span element containing the error message after the input field, or at the beginning of the form to show form-level errors (field_id is the id or name of the form).
	 */
	async showErrors (errors: {field_id: string, message: string}[]): Promise<void>
	{								
		await this.#removeErrors();	
		
		errors.forEach( (err) =>
		{			
			let field_form = this.#formEl.querySelector('[id="'+err.field_id+'"]');	
			if (!field_form) 
			{
                field_form = document.querySelector('form[id="'+err.field_id+'"]');	
				if (!field_form) 
                {
                    field_form = document.querySelector('form[name="'+err.field_id+'"]');	
                    if (!field_form) 
                    {
                        cErr('AjaxForm :: Field with ID or Form with name/ID "' + err.field_id +'" was not found', null, this.showErrors);
                        return;
                    }
                }
			}
					
			let el_err = elCreate ('span', {class: 'error'}, err.message);													
			
            if (field_form.tagName === 'FORM')
            {
                field_form.insertAdjacentElement('afterbegin', el_err);
            }
            else
            {
                field_form.insertAdjacentElement('afterend', el_err);
            }

			field_form.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
		});
	}	
	
	async #removeErrors(): Promise<void>
	{
		let errs = [...this.#formEl.querySelectorAll('.error')];
		await Promise.all(errs.map(async (ch) => ch.remove()));
	}	
	
	#getFormData(): FormData
	{					
		return new FormData(this.#formEl);
	}

    getForm(): HTMLFormElement
	{					
		return this.#formEl;
	}
	
	reset = (): void =>
	{
		this.#formEl.reset();
	}

	resetFileInputs = (): void =>
	{
		this.#formEl.querySelectorAll('input[type="file"]').forEach((inp) => {(inp as HTMLInputElement).value = '';});
	}
}


