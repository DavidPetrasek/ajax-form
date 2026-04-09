import { describe, it, expect } from 'vitest';
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

describe('AjaxForm.resetFileInputs', () => {
  it('is a function on the AjaxForm instance', () => {
    const form = document.createElement('form') ;
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

  it('does not throw when the form has no file inputs', () => {
    const form = document.createElement('form') ;
    form.append(document.createElement('input'));
    const ajaxForm = new AjaxForm(form);

    expect(() => ajaxForm.resetFileInputs()).not.toThrow();
  });
});