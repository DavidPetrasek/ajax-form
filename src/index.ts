import {Manager} from './Manager';
import {AjaxForm} from './AjaxForm';
// import { cLog } from '@dpsys/js-utils/misc';

const axFormsInstance = new Manager();

const axForm = (formOrSelector: HTMLFormElement | string): AjaxForm | null => {
    return axFormsInstance.get(formOrSelector);
};

/**
  * @deprecated Use ajaxForm(form) instead ajaxForm.get(form)
  */
axForm.get = axFormsInstance.get.bind(axFormsInstance);

// cLog('AjaxForm :: Module loaded', axForm);

export default axForm;

