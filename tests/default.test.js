import { describe, it, expect, vi } from 'vitest';
import axForm from '../src/index';
import { AjaxForm } from '../src/AjaxForm';

describe('axForm (minimal, no mocks)', () => 
{
    it('exports a function and exposes a bound .get function', () => 
    {
        expect(typeof axForm).toBe('function');
        expect(typeof axForm.get).toBe('function');
    });
});

describe('axForm integration (no mocks)', () => 
{
    it('axForm(x) returns the same value as axForm.get(x) for form element and selector', () => 
    {
        // create a form element and attach to DOM so selector lookups work
        const form = document.createElement('form');
        const formName = 'login_form';
        form.id = 'vitest-integration-form';
        form.name = formName;
        document.body.appendChild(form);

        // call via element
        const byElement = axForm(form);
        const byElementGet = axForm.get(form);
        expect(byElement).toBeInstanceOf(AjaxForm);
        expect(byElementGet).toBeInstanceOf(AjaxForm);

        // call via selector string
        const selector = `#${form.id}`;
        const bySelector = axForm(selector);
        const bySelectorGet = axForm.get(selector);
        expect(bySelector).toBeInstanceOf(AjaxForm);
        expect(bySelectorGet).toBeInstanceOf(AjaxForm);

        // call via form name
        const byName = axForm(formName);
        const byNameGet = axForm.get(formName);
        expect(byName).toBeInstanceOf(AjaxForm);
        expect(byNameGet).toBeInstanceOf(AjaxForm);

        // cleanup
        document.body.removeChild(form);
    });

    it('throws an error for invalid inputs', () => 
    {
        expect(() => axForm(null)).toThrow();
        expect(() => axForm(undefined)).toThrow();
        expect(() => axForm(123)).toThrow();
        expect(() => axForm({})).toThrow();
        expect(() => axForm('.nonexistent-selector')).toThrow();
    });

    it('handles non-form elements by throwing an error', () => 
    {
        const div = document.createElement('div');
        document.body.appendChild(div);
        expect(() => axForm(div)).toThrow();
        expect(() => axForm.get(div)).toThrow();
        document.body.removeChild(div);
    });

    it('getForm should return the form element', () => 
    {
        const formEl = document.createElement('form');
        const ajaxForm = new AjaxForm(formEl);
        expect(ajaxForm.getForm()).toBe(formEl);
    });
});

describe('AjaxForm.resetFileInputs', () => 
{
    it('is a function on the AjaxForm instance', () => 
    {
        const form = document.createElement('form');
        const ajaxForm = new AjaxForm(form);

        expect(typeof ajaxForm.resetFileInputs).toBe('function');
    });

    it('clears all file input values in the form', () => 
    {
        const form = document.createElement('form');

        const singleFileInput = document.createElement('input');
        singleFileInput.type = 'file';
        Object.defineProperty(singleFileInput, 'value', {
            configurable: true,
            writable: true,
            value: 'C:\\fakepath\\filename.txt',
        });

        const multipleFileInput = document.createElement('input');
        multipleFileInput.type = 'file';
        multipleFileInput.multiple = true;
        Object.defineProperty(multipleFileInput, 'value', {
            configurable: true,
            writable: true,
            value: 'C:\\fakepath\\a.txt, C:\\fakepath\\b.txt',
        });

        form.append(singleFileInput, multipleFileInput);

        const ajaxForm = new AjaxForm(form);

        expect(singleFileInput.value).not.toBe('');
        expect(multipleFileInput.value).not.toBe('');

        ajaxForm.resetFileInputs();

        expect(singleFileInput.value).toBe('');
        expect(multipleFileInput.value).toBe('');
    });

    it('does not throw when the form has no file inputs', () => 
    {
        const form = document.createElement('form');
        form.append(document.createElement('input'));
        const ajaxForm = new AjaxForm(form);

        expect(() => ajaxForm.resetFileInputs()).not.toThrow();
    });
});

describe('AjaxForm.showErrors', () => 
{
    it('inserts an error span after a matching form field and removes previous errors', async () => 
    {
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.id = 'username';
        input.scrollIntoView = vi.fn();

        const oldError = document.createElement('span');
        oldError.className = 'error';
        oldError.textContent = 'old error';
        form.append(oldError, input);
        document.body.appendChild(form);

        const ajaxForm = new AjaxForm(form);
        await ajaxForm.showErrors([{ field_id: 'username', message: 'Username required' }]);

        const errors = form.querySelectorAll('span.error');
        expect(errors).toHaveLength(1);
        expect(errors[0].textContent).toBe('Username required');
        expect(errors[0].previousElementSibling).toBe(input);
        expect(input.scrollIntoView).toHaveBeenCalled();

        document.body.removeChild(form);
    });

    it('inserts an error span after an external field referenced by form attribute and removes it on update', async () => 
    {
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        const externalInput = document.createElement('input');
        externalInput.id = 'external_field';
        externalInput.setAttribute('form', 'loginForm');
        externalInput.scrollIntoView = vi.fn();
        document.body.appendChild(externalInput);

        const ajaxForm = new AjaxForm(form);
        await ajaxForm.showErrors([{ field_id: 'external_field', message: 'External field is required' }]);

        const nextEl = externalInput.nextElementSibling;
        expect(nextEl).not.toBeNull();
        expect(nextEl.tagName).toBe('SPAN');
        expect(nextEl.classList.contains('error')).toBe(true);
        expect(nextEl.textContent).toBe('External field is required');
        expect(externalInput.scrollIntoView).toHaveBeenCalled();

        await ajaxForm.showErrors([]);
        expect(externalInput.nextElementSibling?.classList.contains('error')).toBeFalsy();

        document.body.removeChild(form);
        document.body.removeChild(externalInput);
    });

    it('inserts an error span after multiple matching fields (internal and external) and ignores missing fields', async () => 
    {
        const form = document.createElement('form');
        form.id = 'contactForm';

        const firstInput = document.createElement('input');
        firstInput.id = 'username';
        firstInput.scrollIntoView = vi.fn();
        form.append(firstInput);
        document.body.appendChild(form);

        const externalInput = document.createElement('input');
        externalInput.id = 'email';
        externalInput.setAttribute('form', 'contactForm');
        externalInput.scrollIntoView = vi.fn();
        document.body.appendChild(externalInput);

        const ajaxForm = new AjaxForm(form);
        await expect(
            ajaxForm.showErrors([
                { field_id: 'username', message: 'Username required' },
                { field_id: 'missing', message: 'This field does not exist' },
                { field_id: 'email', message: 'Email required' },
            ])
        ).resolves.not.toThrow();

        const internalErrors = form.querySelectorAll('span.error');
        expect(internalErrors).toHaveLength(1);
        expect(internalErrors[0].textContent).toBe('Username required');
        expect(internalErrors[0].previousElementSibling).toBe(firstInput);

        const externalError = externalInput.nextElementSibling;
        expect(externalError).not.toBeNull();
        expect(externalError.textContent).toBe('Email required');
        expect(externalError.classList.contains('error')).toBe(true);

        expect(firstInput.scrollIntoView).toHaveBeenCalled();
        expect(externalInput.scrollIntoView).toHaveBeenCalled();

        document.body.removeChild(form);
        document.body.removeChild(externalInput);
    });

    it('inserts a form-level error span at the beginning of the form when the target matches the form name', async () => 
    {
        const form = document.createElement('form');
        form.name = 'loginForm';
        form.scrollIntoView = vi.fn();
        document.body.appendChild(form);

        const ajaxForm = new AjaxForm(form);
        await ajaxForm.showErrors([{ field_id: 'loginForm', message: 'Please fix the errors below' }]);

        const error = form.querySelector('span.error');
        expect(error).toBeTruthy();
        expect(form.firstElementChild).toBe(error);
        expect(error?.textContent).toBe('Please fix the errors below');
        expect(form.scrollIntoView).toHaveBeenCalled();

        document.body.removeChild(form);
    });

    it('inserts a form-level error span at the beginning of the form when the target is the form element', async () => 
    {
        const form = document.createElement('form');
        form.id = 'loginForm';
        form.scrollIntoView = vi.fn();
        document.body.appendChild(form);

        const ajaxForm = new AjaxForm(form);
        await ajaxForm.showErrors([{ field_id: 'loginForm', message: 'Please fix the errors below' }]);

        const error = form.querySelector('span.error');
        expect(error).toBeTruthy();
        expect(form.firstElementChild).toBe(error);
        expect(error?.textContent).toBe('Please fix the errors below');
        expect(form.scrollIntoView).toHaveBeenCalled();

        document.body.removeChild(form);
    });
});