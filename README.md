Install: `npm i @dpsys/ajax-form`

###
###
# Example Usage

### Given form:
``` html
<form name="my_form" method="post">

    <input type="text" name="form[something]" required="required">
	            
    <button type="submit" name="form[submit]">Submit</button>
    
</form>
```
###
###
### Then in JS:
This example uses Axios. Use different ajax call implementation if needed.
``` javascript
import ajaxForm from '@dpsys/ajax-form';
import axios from 'axios';

ajaxForm('my_form').setSubmitCallback( (axForm, formData) =>
{
	formData.append('some_value', 54685);

	axios.post('/some-route', formData)
	.then( async (response) => 
	{							
		if (response.data.formErrors)
		{				
			axForm.showErrors(response.data.formErrors);
		}			
		else if (response.data.success)
		{
			...

			axForm.reset();
		}
	});
});
```

###
###
### ajaxForm(form)
`form` - Form element, CSS selector or name of the form

## Methods
### showErrors(errors)
Inserts a span element after the input field, containing the error message.

`errors` - Array containing objects of structure: {field_id: String, message: String}