import {Select} from './Select.js';
import {domReady} from '@psys/js-utils/function.js';
import {cLog} from '@psys/js-utils/misc.js';
import {isString} from '@psys/js-utils/is.js';


export class Selects
{									
	constructor ()
	{		
		this.e = null;
		this.eTarget = null;
		this.activeSelect = null;
		
		// všechny podnabídky
		this.initStav = 'nedokonceno';
		this.instances = [];
		
		var handler_initGlob = this.initGlob.bind(this);
		document.addEventListener('click', handler_initGlob);
	}

	async initGlob (e)
	{										//cLog('e.target', e.target, this.initGlob);
		if (! await this.init(e)) {return;}
		
		await this.activeSelect.vybratAkci(e);
	}
	
	async init (e)
	{					
		if (! await this.ziskat(e)) {return false;}		
		return true;
	}
	
	async addFunc (action, sel, func, args = [])
	{				
//		console.log('pripojitFci :: this.instances', this.instances);
		var attr = this.podleAttr(sel);
		
		this.instances.forEach( (s) =>
		{																			//cLog('s[attr]', s[attr], this.addFunc);
			if (s[attr] === sel)
			{						 													//cLog('s.func', s.func, this.addFunc);									
				var fceExistuje = s.func[action].find(f => {return f.fce === func;});	//cLog('fceExistuje', fceExistuje, this.addFunc);
				if (!fceExistuje) 
				{
					s.func[action].push({fce: func, args: args});
				}
				else
				{
					console.error('pripojitFci :: fce již existuje', func);
				}
			}
		});
		
//		cLog('this.instances', this.instances, this.addFunc);
	}
	
	znovuPripojitFce ()
	{				
//		console.log('znovuPripojitFci :: this.instancesLast', this.instancesLast);
//		console.log('znovuPripojitFci :: this.instances', this.instances);
//		console.log('znovuPripojitFci :: sel', sel);
		
//		var attr = this.podleAttr(sel);
		
		this.instances.forEach( (s) =>
		{											
//			console.log('znovuPripojitFci :: s.name', s.name);
			
			var poslSel = this.instancesLast.find(p => {return p.name === s.name;});
			if (poslSel) 
			{						 					
//				console.log('znovuPripojitFci :: poslSel', poslSel);
				s.fce = poslSel.fce;
			}
		});
		
//		console.log('znovuPripojitFci :: KONEC - this.instances', this.instances);
	}
	
	async ziskat (e)
	{
		this.e = e;
		this.eTarget = e.target;	if (!this.eTarget) {return false;}	//cLog('this.eTarget', this.ziskat);
	
		var selEl = null;
	
		if ( ("selectVlastni" in this.eTarget.dataset) ) {selEl = this.eTarget} 
		else
		{	
			selEl = this.eTarget.closest('[data-select-custom=""]'); //console.log('ziskat :: this.sel', this.sel);
			if (!selEl) {return false;}
		}		
		
		this.activeSelect = this.getInstance (selEl);
		
		return true;
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
				formEl = document.querySelector('[name="'+form+'"]');
			}
			
			if (!formEl) {console.error('Custom select does not exist.'); return null;}
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
//	dejNab (name, attr = null)
//	{			
//		var attrHledat = this.podleAttr(name);
//		
//		var sel = this.instances.find(p => {return p[attrHledat] === name;});	//console.log('dejNab :: sel', sel);
//		if (sel && attr !== null) 
//		{
//			var r = sel[attr];
//		} 
//		else {r = sel;} 	//console.log('dejNab :: r', r);
//
//		return r;
//	}
	
	vybratHodnotu (sel)
	{																	//console.log('vybratHodnotu :: sel', sel);
		if (  !("selectVlastni" in sel.dataset) ) {sel = sel.closest('[data-select-custom=""]');}
								
//		var vybranySel_name = sel.dataset.name;							//console.log('vybratHodnotu :: vybranySel_name', vybranySel_name);
		var vybranaMoznost = sel.querySelector('[data-selected=""]'); 	//console.log('vybratHodnotu :: vybranaMoznost', vybranaMoznost);
		var novaHodnota = vybranaMoznost.dataset.value; 				//console.log('vybratHodnotu :: novaHodnota', novaHodnota);
		
		this.selektyAkt (sel, novaHodnota);

		return novaHodnota;
	}
	
	podleAttr (nab)
	{
		return  typeof nab === 'string'  ?  'name'  :  'el' ;
	}
	
	vypZap (nab, stav, pouzeMoznost = null)
	{
		var attr = this.podleAttr(nab);
		
		this.instances.forEach( (n) =>
		{												//console.log('vypZap :: s', s);
			if (n[attr] === nab)
			{				
				if (pouzeMoznost !== null)
				{
					pouzeMoznost.setAttribute('data-vypnuto', stav);	//console.log('vypZap :: pouzeMoznost', pouzeMoznost);
					
					var moznostiVse = this.dejMoznosti(n);
					var vybranaMoznost = moznostiVse[0]; 				//console.log('vypZap :: vybranaMoznost', vybranaMoznost);
					var prvniMoznost = moznostiVse[1]; 					//console.log('vypZap :: prvniMoznost', prvniMoznost);
		
					if (pouzeMoznost === vybranaMoznost  &&  stav === true)
					{
						this.vybrat_prohodit (pouzeMoznost, prvniMoznost);
						
						this.vybratHodnotu (n.el);	//console.log('vypZap :: this.instances', this.instances);
					}		
				}
				
				// celá nabídka
				else 
				{
					n.stav = stav;
					n.el.setAttribute('data-vypnuto', stav);
				}
	
				return;
			}
		});
	}
	
	odebratNeexistujici ()
	{											
		this.instances.forEach( (p) =>
		{													//console.log('mutObsr_odebrat :: p.el', p.el);
			var podNabExistuje = document.body.contains(p.el);
			
			if (!podNabExistuje) {this.instances = this.instances.filter(pn => pn.el !== p.el);}
		});
		
//		console.log('odebratNeexistujici :: this.instances', this.instances);
	}
	
	async pripravitNabidky()
	{			
		let uninitializedSelects = [...document.querySelectorAll('[data-select-custom]:not([data-select-custom-initialized])')];
		await Promise.all(uninitializedSelects.map(async (s) => 
		{												
			await this.#pripravitNabidku(s);
		}));
		
		this.initStav = 'dokonceno';
//		cLog('this.instances', this.instances);
	}
	
	async #pripravitNabidku(selEl)
	{				
		// Was select already prepared?			
//		var selObj = this.instances.find(obj => {return obj.el === selEl;});		//cLog('selObj', selObj, this.pripravitNabidku);
//		if (selObj) 
//		{
//			return selObj;
//		} 
		
		// uložit
		this.odebratNeexistujici ();	//console.log('pripravitNabidku 1 :: this.instances', this.instances);
		
//		cLog('selEl', selEl, this.pripravitNabidku);
		var nameAttrValue = selEl.getAttribute('name');	//cLog('nameAttrValue', nameAttrValue, this.pripravitNabidku);
		if ( !nameAttrValue ) {nameAttrValue = selEl.dataset.name;}		
		
		var selObj = new Select (nameAttrValue, selEl);
		
		this.instances.push(selObj);
//		this.instances.push({name: s.dataset.name, vybranaHodnota: vybranaHodnota, el: s, fce: []});
		selEl.dataset.selectCustomInitialized = '';
		return selObj;
	}
	
//	zavritVsechny ()
//	{																		console.log('zavritVsechny');
//		this.instances.forEach( (s) =>
//		{
//			if (this.activeSelect === s.el) {return;} //console.log('zavritVsechny :: přeskakuji právě vybraný');
//			if (s.el.dataset.rozvinuto === '0') {return;} //console.log('zavritVsechny :: přeskakuji již zavřený');
//			
//			var moznostiObal = s.el.querySelector('[data-options]');
//			var vybranaMoznost = s.el.querySelector('[data-selected-option]');						
//			
//			this.zavrit(moznostiObal);
//		});
//	}
	
//	zavritVsechny_klikMimo (e)
//	{
////		console.log('e.target', e.target);
////		console.log('e.currentTarget', e.currentTarget);
//
//		var closestSelect = e.target.closest('[data-select-custom]');		
////		console.log('closestSelect', typeof(closestSelect));
////		console.log('closestSelect.nodeType', closestSelect.nodeType);
//		
//		if ( closestSelect == null ) 
//		{
////			this.activeSelect = null;
//			this.zavritVsechny();
//		}
//	}
}











