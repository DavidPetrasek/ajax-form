import {fcePripravArgs} from '@psys/js-utils/function.js';
import {cLog} from '@psys/js-utils/misc.js';
import {elCreate, zamenitPrvky} from "@psys/js-utils/element/util.js";


export class Select
{									
	constructor (name, el, selectedValue = null, func = null)
	{		
		this.e = null;
		this.eTarget = null;
		this.name = name;
		
		this.el = el;
		this.el_vybranaMoznost = null;
		this.el_selectedOptions = null;
		this.el_selectedOptions_label = null;
		this.el_selectedOptions_messages = null;
		this.el_selectedOptions_POST_values = null;
		this.el_default = null;
		this.el_moznostiObal = this.el.querySelector('[data-options]');
//		this.el_moznosti = [...this.el_moznostiObal.children];
		
		this.multiple = false;
		this.selectedValue = selectedValue;		
		this.otevreno = false;
//		this.disabled =  this.isDisabled (this.el);
//		this.stav = 'vyber_neprobiha';
		this.rodOverflowHidden = null;
		
		this.POST_has = true;
		this.POST_el = null;
		
		this.init ();
		this.func = null;
		this.init_func (func);
	}	
	
	isDisabled (el)
	{										//cLog('("disabled" in el.dataset)', ("disabled" in el.dataset), this.isDisabled);
		return ("disabled" in el.dataset);
	}
	
	async init ()
	{
		if ( "multiple" in this.el.dataset ) 
		{
			this.multiple = true;
		}
		
		if (!this.multiple) 
		{
			this.el_vybranaMoznost = this.el.querySelector('[data-selected-option]');
			
			await this.init_options();
			this.POST_addHiddenField();
		}
		else
		{
			this.el_selectedOptions = this.el.querySelector('[data-selected-options]');
			this.el_selectedOptions_label = this.el_selectedOptions.querySelector('.label');
			this.el_selectedOptions_messages = this.el_selectedOptions.querySelector('[data-hidden-messages]');
			this.el_selectedOptions_POST_values = this.el_selectedOptions.querySelector('[data-hidden-post-values]');
			
			this.init_multiple_options();
			this.POST_addHiddenFields();
		}
		
		var handler_close_clickOutside =  this.close_clickOutside.bind(this);
		document.addEventListener('click', handler_close_clickOutside);
	}
	
	init_func (func)
	{
		if (func === null)
		{
			this.func = 
			{
				change: [],
				open_before: [],
				open_after: [],
				close_before: [],
				close_after: []
			};
		}
		else
		{
			this.func = func;
		}
	}
	
	funcCall (action)
	{
		this.func[action].forEach( (f) =>
		{												//console.log('pripojenaFce_vykonat :: f.args', f.args);
			var args = fcePripravArgs(this.e, f.args);	//console.log('pripojenaFce_vykonat :: args', args);
			f.fce(...args);
		});
	}
	
	init_multiple_options ()
	{
		this.update_multiple_options ();
	}	
	
	update_multiple_options ()
	{
		var selectedOptionsLabels = [];
		
		this.el_moznostiObal.querySelectorAll('[data-selected]').forEach( (selectedOpt)=>
		{
			selectedOptionsLabels.push(selectedOpt.innerHTML);
		});
		
//		cLog('selectedOptionsLabels', selectedOptionsLabels, this.init_multiple_options);
		
//		var bodyStyle = window.getComputedStyle(this.el, null).getPropertyValue('font-size');
//		var bodyFontSize = parseFloat(bodyStyle); 					//cLog ('bodyFontSize', bodyFontSize);
		
		let label_string = selectedOptionsLabels.join(', ');
		if (label_string.length > 0) {this.el_selectedOptions_label.innerHTML = label_string;}
		else 						 {this.el_selectedOptions_label.innerHTML = this.el_selectedOptions_messages.querySelector('[name="custom_select_nothing_selected_message"]').value;}
	}
	
	async init_options ()
	{				
		await this.init_optGroups();
											
		var el_selected = this.el.querySelector('[data-selected]');	//console.log('el_selected', el_selected, this.init_options);
		if (el_selected) 
		{
			if (el_selected !== this.el_vybranaMoznost.firstElementChild)
			{
				zamenitPrvky (el_selected, this.el_vybranaMoznost.firstElementChild);	
			}
		}
		else
		{
			el_selected = this.el_vybranaMoznost.firstElementChild;				//cLog('el_selected', el_selected, this.pripravitNabidku);
			el_selected.setAttribute('data-selected', '');
		}
		
		this.selectedValue = el_selected.dataset.value;
		
		// default option
		var el_default = this.el.querySelector('[data-vychozi-moznost]');
		if (el_default)
		{
			this.el_default = el_default;
		}
		else
		{
			el_selected.setAttribute('data-vychozi-moznost', '');
			this.el_default = el_selected;
		}
		
		this.options_putDefaultFirst ();
	}
	
	async init_optGroups ()
	{
		this.el.querySelectorAll('[data-optgroup]').forEach( (og, og_ind) =>
		{
			og.setAttribute('data-optgroup', og_ind);
			
			og.querySelectorAll('[data-option]').forEach( (opt) =>
			{
				opt.setAttribute('data-parent-optgroup', og_ind);
			});
		});
	}
	
	POST_addHiddenField()
	{
		if ( ("bezPost" in this.el_vybranaMoznost.dataset) )
		{
			this.POST_has = false;
			return;
		}
		
		var alreadyExists = this.el_vybranaMoznost.querySelector('input[type="hidden"]');
		if (alreadyExists)
		{
			return;
		}
		
		if (this.POST_has)
		{
			this.POST_el = elCreate ('input', {name: this.name, type: 'hidden', value: this.selectedValue});		
        	this.el_vybranaMoznost.appendChild(this.POST_el);	
		}
	}
	
	POST_addHiddenFields()
	{		
		var alreadyExists = this.el_selectedOptions_POST_values.querySelector('input[type="hidden"]');
		if (alreadyExists)
		{
			return;
		}
		
		this.el_moznostiObal.querySelectorAll('[data-option][data-selected]').forEach( (opt)=>
		{
			let el_POST = elCreate ('input', {name: this.name, type: 'hidden', value: opt.dataset.value});		
        	this.el_selectedOptions_POST_values.appendChild(el_POST);
		});	
	}
	
	async vybratAkci (e)
	{										//cLog('vybratAkci - START', null, this.vybratAkci);
		this.e = e;
		this.eTarget = e.target;
		
		if ( this.isDisabled(this.el) || ("optgroupLabel" in this.eTarget.dataset) ) 
		{
			return;
		}
		else
		{
			if ( this.eTarget.closest('[data-selected-option]')  ||  this.eTarget.closest('.sipka') )
			{																//cLog('data-selected-option', null, this.vybratAkci);
	//			if (  !("option" in this.eTarget.dataset) ) {console.error('vybratAkci :: nekliknulo se na vybranou možnost', this.eTarget);}
				
				this.eTarget = this.el_vybranaMoznost.firstElementChild;
				
				if (!this.otevreno) 
				{
					this.funcCall('open_before');
					await this.otevrit ();
					this.funcCall('open_after');
				} 
				else 
				{
	//				cLog('zavře se', null, this.vybratAkci);
					this.funcCall('close_before');
					await this.zavrit ();
					this.funcCall('close_after');
				}
			}
			
			else if ( this.eTarget.closest('[data-selected-options]')  ||  this.eTarget.closest('.sipka') )
			{																//cLog('data-selected-option', null, this.vybratAkci);
	//			if (  !("option" in this.eTarget.dataset) ) {console.error('vybratAkci :: nekliknulo se na vybranou možnost', this.eTarget);}
				
				this.eTarget = this.el_selectedOptions;
				
				if (!this.otevreno) 
				{
					this.funcCall('open_before');
					await this.otevrit ();
					this.funcCall('open_after');
				} 
				else 
				{
	//				cLog('zavře se', null, this.vybratAkci);
					this.funcCall('close_before');
					await this.zavrit ();
					this.funcCall('close_after');
				}
			}
			
			else if ( this.eTarget.closest('[data-options]') )
			{																//cLog('data-options', null, this.vybratAkci);
	//			if (  !("option" in this.eTarget.dataset) ) {console.error('vybratAkci :: nekliknulo se na možnost', this.eTarget);}
				
				this.eTarget = this.eTarget.closest('[data-option]');	if ( !this.eTarget ) {return;}
				//console.log('vybratAkci :: možnost', this.eTarget);
				
				if ( this.isDisabled(this.eTarget) ) {return;}
				
				if (this.eTarget) 
				{
					if (!this.multiple) {this.vybrat();} else {this.vybrat_multiple();}
				}
			}
		}
	}
	
	rodOverflow_vyp ()
	{
		var rodOf = this.sel.parentNode;
		var cssOf = '';
		
		while (cssOf !== 'hidden')
		{			
			cssOf = window.getComputedStyle(rodOf).getPropertyValue('overflow');
			
			if (cssOf === 'hidden')
			{
				rodOf.style.overflow = 'visible';
				this.rodOverflowHidden = rodOf;		//console.log('rodOverflow_vyp :: rodOf', rodOf);
				return;
			}
			
			rodOf = rodOf.parentNode; 
			if (rodOf === document.body) {break;}
		}
		
		this.rodOverflowHidden = null;
	}
	
	rodOverflow_zap ()
	{
		if (this.rodOverflowHidden !== null)
		{			
			this.rodOverflowHidden.style.overflow = '';
		}
	}
	
	async otevrit ()
	{		
		if (!this.multiple) {this.el_vybranaMoznost.classList.add('focus');}
		else 			    {this.el_selectedOptions.classList.add('focus');}		
		
//		await rozvinout (this.el_moznostiObal);
		
		this.otevreno = true;
		this.el.dataset.opened = 1;
	}
	
	options_putDefaultFirst ()
	{	
		var defaultOptionIsSelected = ("selected" in this.el_default.dataset); 
		
		if ( !defaultOptionIsSelected  &&  !("parentOptgroup" in this.el_default.dataset) )
		{
			this.el_moznostiObal.insertBefore(this.el_default, this.el_moznostiObal.firstElementChild);	
		}
	}
	
	async vybrat ()
	{														
		this.update( this.eTarget.dataset.value );	
			
		this.vybrat_prohodit (this.el_vybranaMoznost.firstElementChild, this.eTarget);	
	
		this.options_putDefaultFirst ();
		
		this.funcCall('change');
		
//		cLog('zavře se', null, this.vybrat);
		this.zavrit ();
	}
	
	async vybrat_multiple ()
	{		
		if (this.eTarget.hasAttribute('data-selected'))
		{
			this.eTarget.removeAttribute('data-selected');
			
			this.el_selectedOptions_POST_values.querySelector('[value="'+this.eTarget.dataset.value+'"]').remove();	
		}
		else
		{
			this.eTarget.setAttribute('data-selected', '');
			
			let el_POST = elCreate ('input', {name: this.name, type: 'hidden', value: this.eTarget.dataset.value});		
	    	this.el_selectedOptions_POST_values.appendChild(el_POST);	
		}
		
		this.funcCall('change');
		this.update_multiple_options ();
	}
	
	async update (newValue)
	{
		this.selectedValue = newValue;
		
		if (this.POST_has)
		{
			await this.update_POST (newValue);
		}
		
//		this.stav = 'vyber_dokoncen';
	}
	
	async update_POST (newValue)
	{			
		this.POST_el.value = newValue;
	}
	
	async vybrat_prohodit (puvodni, novy)
	{																	
		puvodni.removeAttribute('data-selected');	//cLog('puvodni', puvodni, this.vybrat_prohodit);
		novy.setAttribute('data-selected', '');		//cLog('novy', novy, this.vybrat_prohodit);
		zamenitPrvky (puvodni, novy);			//await pause (2000);	cLog('puvodni', puvodni, this.vybrat_prohodit);	cLog('novy', novy, this.vybrat_prohodit);
		
		if ( ("parentOptgroup" in puvodni.dataset) )
		{													
//			await pause (0);
//			cLog('puvodni.dataset.parentOptgroup', puvodni.dataset.parentOptgroup, this.vybrat_prohodit);
			
			var el_optgroup = this.el_moznostiObal.querySelector('[data-optgroup="'+puvodni.dataset.parentOptgroup+'"]');	//cLog('el_optgroup', el_optgroup, this.vybrat_prohodit);
			
			el_optgroup.appendChild(puvodni);
		}
		
		if ( !("parentOptgroup" in puvodni.dataset)  &&  puvodni.closest('[data-optgroup]') )
		{													
			this.el_moznostiObal.appendChild(puvodni);
		}	
	}
	
	dejMoznosti (name, vse = true)
	{	
		var nab = typeof name === 'string'  ?  this.dejNab (name)  :  name;
		
		var vybranaMoznost = nab.el.querySelector('[data-selected-option]');
		var moznostiObal = nab.el.querySelector('[data-options]'); //console.log('moznostiObal', this.el_moznostiObal);
		
		return vse ? [vybranaMoznost.firstElementChild, ...moznostiObal.children] : [...moznostiObal.children];
	}
	
	dejMoznost (name, moznostHod)
	{	
		var nab = typeof name === 'string'  ?  this.dejNab (name)  :  name;	//console.log('dejMoznost :: nab', nab); 
		var moznosti = this.dejMoznosti (nab);	
		var moznost = null;
		
		moznosti.forEach( (m) =>
		{												//console.log('dejMoznost :: m', m); 
			if (m.dataset.value === moznostHod)
			{											//console.log('dejMoznost :: nalezeno'); 
				moznost = m; return;
			}
		});

		return moznost;
	}
	
	async zavrit ()
	{										
		if (!this.otevreno) {return;} 	//cLog('closing');
		
//		await svinout (this.el_moznostiObal);
		if (!this.multiple) {this.el_vybranaMoznost.classList.remove('focus');}
		else 			    {this.el_selectedOptions.classList.remove('focus');}
		
		this.otevreno = false;
		this.el.dataset.opened = 0;
	}
	
	close_clickOutside (e)
	{
		var closestSelect = e.target.closest('[data-select-custom]');	//cLog('closestSelect', closestSelect);	cLog('this.el', this.el);
		if ( closestSelect !== this.el ) 
		{
			this.zavrit();
		}
	}
	
//	async byloVybrano ()
//	{
//		if (this.stav === 'vyber_dokoncen') 
//		{
//			this.stav = 'vyber_neprobiha';
//			return true;
//		}
//		
//		return false;
//	}
}









