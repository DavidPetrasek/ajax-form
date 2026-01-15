[![NPM Downloads](https://img.shields.io/npm/dm/%40dpsys%2Fajax-form)](https://www.npmjs.com/package/@dpsys/ajax-form)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![ISC License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

# Ajax Form

A lightweight handler for submitting HTML forms via AJAX.

Supports CommonJS (CJS) and ES Modules (ESM).


## Installation

```bash
npm i @dpsys/ajax-form
```

###
###
## Example Usage

### Given form:
``` html
<form name="my_form" method="post">

    <input type="text" name="my_form[something]" required="required">
	            
    <button type="submit" name="my_form[submit]">Submit</button>
    
</form>
```
###
###
### Then in JS:
This example uses Axios. Feel free to use any other AJAX implementation.
``` javascript
import ajaxForm from '@dpsys/ajax-form';
import axios from 'axios';

ajaxForm('my_form').setSubmitCallback( (axForm, formData) =>
{
	axios.post('/some-route', formData)
	.then( (resp) => 
	{							
		if (resp.data.formErrors)
		{				
			axForm.showErrors(resp.data.formErrors);
		}			
		else if (resp.data.success)
		{
			// Do something...

			axForm.reset();
		}
	});
});
```


###
###
## Reference


### ajaxForm(form)

Creates and returns an AjaxForm instance for handling the specified form.

##### Parameters:
- `form`: A form element (HTMLElement), CSS selector (string), or form name (string).

##### Returns: An AjaxForm instance.

##### Throws: Error if the form is not found or invalid.
___

### AjaxForm Methods
___
#### setSubmitCallback(callback)

Sets a callback function to handle form submission.

##### Parameters:
- `callback(axForm, formData)`: Function called on submit. `axForm` is the instance, `formData` is a FormData object.
___
#### showErrors(errors)

Displays error messages by inserting `<span>` elements after input fields.

##### Parameters:
- `errors`: Array of objects with `{field_id: string, message: string}`.
___
#### reset()

Resets the form to its default values.
___