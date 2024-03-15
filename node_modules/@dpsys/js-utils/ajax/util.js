import {elCreate} from '../element/util.js';
import {pause, cLog} from '../misc.js';


export async function pageInteractionDisable (id, loaderShowAfterMs)
{
	// cLog('id', id, pageInteractionDisable);
	let serverPracujeEl = elCreate ('div', {id: 'ajax_pageInteractionDisabled_'+id});
	document.body.appendChild(serverPracujeEl);
	pause(loaderShowAfterMs);
	serverPracujeEl.classList.add('show');
	
	return serverPracujeEl;
}

export async function pageInteractionEnable (id)
{
	// cLog('id', id, pageInteractionEnable);
	let  serverPracujeEl = document.getElementById('ajax_pageInteractionDisabled_'+id);
		serverPracujeEl.classList.remove('show');
		await pause(450);
		serverPracujeEl.remove();	
}






