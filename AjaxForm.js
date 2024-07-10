import {cErr, cLog} from '@dpsys/js-utils/misc.js';
import {isString} from '@dpsys/js-utils/is.js';
import {stringTruncate} from '@dpsys/js-utils/string.js';
import {elCreate} from "@dpsys/js-utils/element/util.js";


export class AjaxForm
{								
	constructor (form)
	{																	//cLog('Form (constructor)');
		if (isString(form)) {form = document.querySelector (form);}
		
		this.el = form;								//cLog('Form (constructor) :: form', form);	
		
		// this.disableHiddenFields();
		this.el.addEventListener('submit', this.#submit);
		// this.mutationObserver_hiddenFields = new MutationObserver(this.callback_mutationObserver_hiddenFields);
		// this.mutationObserver_hiddenFields.observe(this.el, 
		// {
		// 	subtree: true,
		// 	attributes: true,
  		// 	attributeFilter: ['class'],
  		// 	attributeOldValue: true
  		// });
	}

	#submit = async (e) =>
	{
		e.preventDefault();	
		if (!this.#isValid()) {return;}	
		// await this.allowFields();
		var formData = this.#getFormData();			
		await this.#removeErrors();
		// this.restoreFields();	

		this.submitCallback(this, formData);
	}
	
// 	callback_mutationObserver_hiddenFields = (mutationList, observer) =>
// 	{
// 	    for (const mutation of mutationList) 
// 	    {
// 			if (!mutation.oldValue) {continue;}
// //			cLog('mutation', mutation, this.callback_mutationObserver_hiddenFields);
			
// 		    if (mutation.oldValue.includes('none') && !mutation.target.classList.contains('none')) 
// 		    {										
// 				disableAllInputs(mutation.target, false);
// 		    }
// 		    else if (!mutation.oldValue.includes('none') && mutation.target.classList.contains('none')) 
// 		    {										
// 				disableAllInputs(mutation.target, true);
// 		    }
// 		}
// 	}
	
	// disableHiddenFields = () =>
	// {		
	// 	this.el.querySelectorAll('.none').forEach( (chNone) =>
	// 	{														
	// 		disableAllInputs(chNone, true);
	// 	});
	// }	
	
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
	
	
	// async allowFields()
	// {		
	// 	// Allow fields, so they can appear in FormData		
	// 	let fields = [...this.el.querySelectorAll('input, select, canvas, textarea')];
	// 	await Promise.all(fields.map(async (i) => 
	// 	{												
	// 		if (i.hasAttribute('disabled')) 
	// 		{
	// 			i.removeAttribute('disabled');
	// 			i.setAttribute('data-form-before-sent-disabled', '');
	
		// 		if (i.hasAttribute('required')) 
		// 		{
		// 			i.removeAttribute('required');
		// 			i.setAttribute('data-form-before-sent-required', '');
		// 		}
	// 		}	
	// 	}));
	// }
	
	// restoreFields()
	// {		
	// 	// Set attributes to state before this form was sent
	// 	this.el.querySelectorAll('input, select, canvas, textarea').forEach( (i) =>
	// 	{						
	// 		if (i.hasAttribute('data-form-before-sent-disabled')) 
	// 		{
	// 			i.removeAttribute('data-form-before-sent-disabled');
	// 			i.setAttribute('disabled', '');
	// 		}	
			
	// 		if (i.hasAttribute('data-form-before-sent-required')) 
	// 		{
	// 			i.removeAttribute('data-form-before-sent-required');
	// 			i.setAttribute('required', '');
	// 		}
	// 	});
	// }
	
	
	#getFormData()
	{					
		return new FormData(this.el);
	}	
	
	reset = () =>
	{		
		// for (let key in this.filesMultipleDT) 
		// {
  		// 	this.filesMultipleDT[key] = new DataTransfer();
		// }
		
		// if (this.fileMultiple_container !== null) {this.fileMultiple_container.innerHTML = '';}
//		this.el.querySelectorAll('input[type="file"][multiple]').forEach( (inpm) => 
//		{										
//			inpm.closest('.file-upload-multiple').querySelector('.selected-files').innerHTML = '';
//		});
		
		this.el.reset();				
//		[...this.el.elements].forEach( (inp) => 
//		{					
//			if (inp.name.includes('_token')) {return;}	
//			
//			else if ( inp.type === 'file'  &&  inp.hasAttribute('multiple') )
//			{
//				inp.files = this.dataTransfer.files;	cLog('inp.files', inp.files, this.clearFields);
//			}
//			
//			else
//			{
//				inp.value = '';	
//			}
//		});
	}
}


