import {cLog} from '@psys/js-utils/misc.js';
import {stringTruncate} from '@psys/js-utils/string.js';
import {elCreate} from "@psys/js-utils/element/util.js";


// TODO: fileMultiple_container --> filesMultiple_container = []

export class FileUploadMultiple
{	
	fileMultiple_container = null; 
	filesMultipleAdd_funcAfter = null;
	filesMultipleRemove_funcAfter = null;
	filesMultipleDT = {};	
	
	constructor ()
	{		
		this.initFilesMultiple();
		this.setFileMultiple_container();
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
			
			let inHTML = '<span class="file-name">'+stringTruncate(file.name, 20)+'</span>';
			
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
}


