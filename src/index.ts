import {Manager} from './Manager';
import {AjaxForm} from './AjaxForm';

const manager = new Manager();

const ajaxForm = (formOrSelector: HTMLFormElement | string): AjaxForm | null => {
    return manager.get(formOrSelector);
};

/**
  * @deprecated Use ajaxForm(form) instead ajaxForm.get(form)
  */
ajaxForm.get = manager.get.bind(manager);

export default ajaxForm;