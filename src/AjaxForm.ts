import {cErr, isEmpty} from '@dpsys/js-utils/misc';
import {elCreate} from "@dpsys/js-utils/el";


export class AjaxForm
{
    #formEl: HTMLFormElement;
    #submitCallback: (axForm: AjaxForm, formData: FormData) => void = () => {};

    constructor(form: HTMLFormElement)
    {
        this.#formEl = form;
        this.#formEl.addEventListener('submit', this.#submit);
        this.#formEl.ajaxFormInstance = this; // Prevent multiple instances/eventListeners on the same form
    }

    #submit = (e: SubmitEvent) =>
    {
        e.preventDefault();
        if (!this.#isValid())
        {
            return;
        }

        var formData = this.#getFormData();
        
        // Which button was used to submit
        if (e.submitter && !isEmpty((e.submitter as HTMLButtonElement).name))
        {
            formData.append((e.submitter as HTMLButtonElement).name, 'true');
        }

        this.#removeErrors();
        this.#submitCallback(this, formData);
    }

    #isValid()
    {
        if (!this.#formEl.checkValidity())
        {
            this.#formEl.reportValidity();
            return false;
        }

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
     * @deprecated submitCallback property is deprecated and will be removed in version 2.0.0. Use setSubmitCallback() method instead.
     */
    set submitCallback(clb: (axForm: AjaxForm, formData: FormData) => void)
    {
        this.setSubmitCallback(clb);
    }

    /**
     * Inserts a span element containing the error message after the input field, or at the beginning of the form to show form-level errors (field_id is the id or name of the form).
     * 
     * @deprecated Asynchronous signature returning Promise<void> is deprecated and will become synchronous (returning void) in version 2.0.0.
     */
    async showErrors(errors: {field_id: string, message: string}[]): Promise<void>
    {
        this.#removeErrors();

        let isFirstIt = true;

        for (const err of errors)
        {
            // Field inside this form
            let field_form: Element | null = this.#formEl.querySelector('[id="' + err.field_id + '"]');

            // Field outside this form
            if (!field_form && this.#formEl.id)
            {
                field_form = document.querySelector('[id="' + err.field_id + '"][form="' + this.#formEl.id + '"]');
            }

            // Form-level error
            if (!field_form)
            {
                field_form = document.querySelector('form[id="' + err.field_id + '"]');
                if (!field_form)
                {
                    field_form = document.querySelector('form[name="' + err.field_id + '"]');
                    if (!field_form)
                    {
                        cErr('AjaxForm :: Field with ID or Form with name/ID "' + err.field_id + '" was not found', null, this.showErrors);
                        continue;
                    }
                }
            }

            const el_err = elCreate('span', {class: 'error'}, err.message);

            if (field_form.tagName === 'FORM')
            {
                field_form.insertAdjacentElement('afterbegin', el_err);
            }
            else
            {
                field_form.insertAdjacentElement('afterend', el_err);
            }

            if (isFirstIt)
            {
                field_form.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
                isFirstIt = false;
            }
        }
    }

    #removeErrors(): void
    {
        const errs: Element[] = [...this.#formEl.querySelectorAll('.error')];

        // Field/s outside this form
        if (this.#formEl.id)
        {
            const externalFields = document.querySelectorAll(`[form="${this.#formEl.id}"]`);
            for (const el of externalFields)
            {
                const nextEl = el.nextElementSibling;
                if (nextEl && nextEl.classList.contains('error'))
                {
                    errs.push(nextEl);
                }
            }
        }

        for (const ch of errs)
        {
            ch.remove();
        }
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
        this.#formEl.querySelectorAll('input[type="file"]').forEach((inp) =>
        {
            (inp as HTMLInputElement).value = '';
        });
    }
}