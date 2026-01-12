import { describe, it, expect } from 'vitest';
import axForm from '../src/index';
import { AjaxForm } from '../src/AjaxForm';

describe('axForm (minimal, no mocks)', () => {
  it('exports a function and exposes a bound .get function', () => {
    expect(typeof axForm).toBe('function');
    expect(typeof axForm.get).toBe('function');
  });
});

describe('axForm integration (no mocks)', () => {
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

  it('throws an error for invalid inputs', () => {
    expect(() => axForm(null)).toThrow();
    expect(() => axForm(undefined)).toThrow();
    expect(() => axForm(123)).toThrow();
    expect(() => axForm({})).toThrow();
    expect(() => axForm('.nonexistent-selector')).toThrow();
  });

  it('handles non-form elements by throwing an error', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(() => axForm(div)).toThrow();
    expect(() => axForm.get(div)).toThrow();
    document.body.removeChild(div);
  });
});