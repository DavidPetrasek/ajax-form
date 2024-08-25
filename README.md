Install: `npm i @dpsys/ajax-form`

###
###
# Usage
This example uses Axios. Use different ajax call implementation if needed.

### Given form:
``` html
<form name="my_form" method="post">

    <input type="text" name="form[something]" required="required">
	            
    <button type="submit" name="form[submit]">Submit</button>
    
</form>
```
###
###
### Then in js:
``` javascript
import ajaxForm from '@dpsys/ajax-form';
import axios from 'axios';

ajaxForm.get('my_form').submitCallback = (formInstance, formData) =>
{
	formData.append('some_value', 54685);

	axios.post('/some-route', formData)
	.then( async (response) => 
	{							
		if (response.data.formErrors)
		{				
			formInstance.showErrors(response.data.formErrors);
		}			
		else if (response.data.success)
		{
			...

			formInstance.reset();
		}
	});
};
```

###
###
## Methods
### get(form)
`form` - existing Node or string (CSS selector or value of the name attribute)

### showErrors(errors)
Inserts a span element after the input field, containing the error message.

`errors` - Array containing objects of structure: {field_id: String, message: String}