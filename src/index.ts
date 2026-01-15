import { AjaxForm } from './AjaxForm';
import { getAjaxForm } from './manager';

type AjaxFormCallable = ((formOrSelector: HTMLFormElement | string) => AjaxForm | null) & 
{
  /** @deprecated Use ajaxForm(form) instead: ajaxForm.get(form) */
  get: (formOrSelector: HTMLFormElement | string) => AjaxForm | null;
};

const ajaxForm: AjaxFormCallable = (formOrSelector: HTMLFormElement | string) => getAjaxForm(formOrSelector);

// expose deprecated alias that calls the same function
ajaxForm.get = ajaxForm;

export default ajaxForm;