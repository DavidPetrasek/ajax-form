import {cLog, isString} from '../../miscellaneous.js';
import {string_truncate} from '../../string.js';
import { elCreate } from "../../elements/func.js";
import {disableAllInputs} from "./func.js";


// TODO: fileMultiple_container --> filesMultiple_container = []

export class Form
{								
	constructor (form)
	{																	//cLog('Form (constructor)');
		if (isString(form)) {form = document.querySelector (form);}
		
		this.el = form;								//cLog('Form (constructor) :: form', form);
		this.fileMultiple_container = null; 
		this.filesMultipleAdd_funcAfter = null;
		this.filesMultipleRemove_funcAfter = null;
		this.filesMultipleDT = {};		
		
		// INIT
		this.initFilesMultiple();
		this.disableHiddenFields();
		this.setFileMultiple_container();
		
		this.mutationObserver_hiddenFields = new MutationObserver(this.callback_mutationObserver_hiddenFields);
		this.mutationObserver_hiddenFields.observe(this.el, 
		{
			subtree: true,
			attributes: true,
  			attributeFilter: ['class'],
  			attributeOldValue: true
  		});
	}
	
	setFileMultiple_container = (el = null) =>
	{			
		if (el === null)
		{
//			let fileUploadMulti = inpm.closest('.file-upload-multiple');	//cLog('fileUploadMulti', fileUploadMulti, this.filesMultipleAdd);
//			osInstance_selectedFiles.elements().viewport.appendChild(selectedFile);
			
			this.fileMultiple_container = this.el.querySelector('.selected-files');
		}
		else
		{
			this.fileMultiple_container = el;
		}
	}
	
	callback_mutationObserver_hiddenFields = (mutationList, observer) =>
	{
	    for (const mutation of mutationList) 
	    {
			if (!mutation.oldValue) {continue;}
//			cLog('mutation', mutation, this.callback_mutationObserver_hiddenFields);
			
		    if (mutation.oldValue.includes('none') && !mutation.target.classList.contains('none')) 
		    {										
				disableAllInputs(mutation.target, false);
		    }
		    else if (!mutation.oldValue.includes('none') && mutation.target.classList.contains('none')) 
		    {										
				disableAllInputs(mutation.target, true);
		    }
		}
	}
	
	disableHiddenFields = () =>
	{		
		this.el.querySelectorAll('.none').forEach( (chNone) =>
		{														
			disableAllInputs(chNone, true);
		});
	}
	
	initFilesMultiple = () =>
	{
		this.el.querySelectorAll('input[type="file"][multiple]').forEach( (inpm) => 
		{										
//			 cLog('inpm', inpm, this.initFilesMultiple);			
//			var inpID = inpm.id;	cLog('inpID', inpID, this.initFilesMultiple);

			this.filesMultipleDT[inpm.id] = new DataTransfer();
												
			inpm.addEventListener('change', this.filesMultipleAdd);
		});
		
//		 cLog('this.filesMultipleDT', this.filesMultipleDT);
	}
	
	filesMultipleAdd = (e) =>
	{		
		let inpm = e.target;
		
//		cLog('inpEl.files (PŘED)', inpm.files, this.initFilesMultiple);
//		cLog ('this.filesMultipleDT[inpm.id] (PŘED)', this.filesMultipleDT[inpm.id], this.initFilesMultiple);
			
		// Add files to DataTransfer of this input
		for (let file of inpm.files) 
		{
			this.filesMultipleDT[inpm.id].items.add(file);
			
			// Visual update			
			let fileDelete = elCreate('span', {class: 'file-delete'}, '<span>+</span>');
			fileDelete.addEventListener('click', this.filesMultipleRemove);
			
			let fileNameShow = elCreate('span', {class: 'file-name-show'}, '<i class="fa-solid fa-eye"></i>');
			fileNameShow.addEventListener('click', this.fileNameShowHide);
			fileNameShow.addEventListener('mouseenter', this.fileNameShowHide);
			fileNameShow.addEventListener('mouseleave', this.fileNameShowHide);
			
			let inHTML = '<span class="file-name">'+string_truncate(file.name, 20)+'</span>';
			
			let selectedFile = elCreate('span', {class: 'selected-file'}, inHTML);
			selectedFile.appendChild(fileNameShow);
			selectedFile.appendChild(fileDelete);
			
//			let fileUploadMulti = inpm.closest('.file-upload-multiple');	//cLog('fileUploadMulti', fileUploadMulti, this.filesMultipleAdd);
			this.fileMultiple_container.appendChild(selectedFile);
		}
		
		// Update input files
		inpm.files = this.filesMultipleDT[inpm.id].files;			
				
//		cLog('inpEl.files (PO)', inpm.files, this.initFilesMultiple);
//		cLog ('this.filesMultipleDT[inpm.id] (PO)', this.filesMultipleDT[inpm.id], this.initFilesMultiple);
		
		if (this.filesMultipleAdd_funcAfter !== null)
		{
			this.filesMultipleAdd_funcAfter();
		}
	}
	
	fileNameShowHide = (e) =>
	{
		let selectedFile = e.target.closest('.selected-file');
		
		if (!selectedFile.classList.contains('show')) 
		{
			selectedFile.classList.add('show');
		}	
		else
		{
			selectedFile.classList.remove('show');
		}	
	}
	
	filesMultipleRemove = (e) =>
	{		
		let fileUploadMultiple = e.target.closest('.file-upload-multiple');
		
		let inpm = fileUploadMultiple.querySelector('input[type="file"][multiple]');		//cLog('inpm.id', inpm.id, this.filesMultipleRemove);
		
		let fileName = e.target.closest('.selected-file').querySelector('.file-name').innerHTML;	//cLog('fileName', fileName, this.filesMultipleRemove);
		
//		cLog('this.filesMultipleDT', this.filesMultipleDT, this.filesMultipleRemove);
		
    	for (let i=0; i < this.filesMultipleDT[inpm.id].items.length; i++) 
    	{
      		if (fileName === this.filesMultipleDT[inpm.id].items[i].getAsFile().name) 
      		{
//				  cLog('odebírá se', fileName, this.filesMultipleRemove);
				  
	        	this.filesMultipleDT[inpm.id].items.remove(i);
    		}
    	}
    	
    	// Update input files
		inpm.files = this.filesMultipleDT[inpm.id].files;
		
//		cLog('inpEl.files (PO)', inpm.files, this.filesMultipleRemove);
//		cLog ('this.filesMultipleDT[inpm.id] (PO)', this.filesMultipleDT[inpm.id], this.filesMultipleRemove);
		
		// Visual update
		e.target.closest('.selected-file').remove();
		
		if (this.filesMultipleRemove_funcAfter !== null)
		{
			this.filesMultipleRemove_funcAfter();
		}
	}
	
	
	isValid ()
	{		
		if ( !this.el.checkValidity() ) {this.el.reportValidity(); return false;}
	
		return true;
	}	
	
	showErrors (chyby)
	{								
		this.removeErrors();	
		
		chyby.forEach( (ch) =>
		{			
			let field = this.el.querySelector('[id="'+ch.field_id+'"]');	
			
			if (!field) 
			{
				field = this.el;
				var placement = 'afterbegin';
			}
			else
			{
				var placement = 'afterend';
			}
					
			let el_err = elCreate ('span', {class: 'error'}, ch.message);
													
			field.insertAdjacentElement(placement, el_err);
			field.classList.add('form-input-error');
			field.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
		});
	}	
	
	removeErrors ()
	{
		this.el.querySelectorAll('[class="error"]').forEach((ch)=>ch.remove());
		this.el.querySelectorAll('input[class="form-input-error"]').forEach((ch)=>ch.classList.remove('form-input-error'));	
	}
	
	
	async allowFields ()
	{		
		// Allow fields, so they can appear in FormData
		this.el.querySelectorAll('input, select, canvas, textarea').forEach( (i) =>
		{														
			if (i.hasAttribute('disabled')) 
			{
				i.removeAttribute('disabled');
				i.setAttribute('data-form-before-sent-disabled', '');
			}	
			
			if (i.hasAttribute('required')) 
			{
				i.removeAttribute('required');
				i.setAttribute('data-form-before-sent-required', '');
			}
		});
	}
	
	beforeSend ()
	{
		this.removeErrors();
	}
	
	afterSend ()
	{		
		// Set attributes to state before this form was sent
		this.el.querySelectorAll('input, select, canvas, textarea').forEach( (i) =>
		{						
			if (i.hasAttribute('data-form-before-sent-disabled')) 
			{
				i.removeAttribute('data-form-before-sent-disabled');
				i.setAttribute('disabled', '');
			}	
			
			if (i.hasAttribute('data-form-before-sent-required')) 
			{
				i.removeAttribute('data-form-before-sent-required');
				i.setAttribute('required', '');
			}
		});
	}
	
	
	async getFormData ()
	{			
		await this.allowFields();
		
		return new FormData(this.el);
	}
	
	getFileNames (inp)
	{                                           //console.log('el', el);		console.log('el.files', el.files);
	    var fileNames_arr = [];
	    var fileNames_str = ''; 
	    var separator = ', ';
	    
	    for (var i = 0; i < inp.files.length; ++i)
	    {
	        var fileName = inp.files.item(i).name.split('\\').pop();  
	  
	        fileNames_arr.push(fileName);
	        fileNames_str += (i === 0 ? '' : separator) + fileName;
	    }
	    
	//    console.log('fileNames_arr', fileNames_arr);
	//    console.log('fileNames_str', fileNames_str);
	    
	    return {arr: fileNames_arr, str:fileNames_str};
	}
	
	
	clearFields ()
	{		
		for (let key in this.filesMultipleDT) 
		{
  			this.filesMultipleDT[key] = new DataTransfer();
		}
		
		if (this.fileMultiple_container !== null) {this.fileMultiple_container.innerHTML = '';}
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
	
//	process (checkValidity = true)
//	{		
//		var formData = this.getFormData (checkValidity);	if (!formData) {return false;}
//		
//		var formFields = {};
//		
//		for (let [name, value] of formData) 
//		{
//	  		formFields[name] = value;
//		}
//			
//		return formFields;
//	}
}


