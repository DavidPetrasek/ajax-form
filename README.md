Install: `npm i @dpsys/ajax-form`
Submit any issues here: https://github.com/DavidPetrasek/ajax-form/issues

# Usage
This example uses Axios. Use different ajax call implementation if needed.

### Given form:
```
<form name="my_form" method="post">

    <input type="text" name="form[something]" required="required">
	            
    <button type="submit" name="form[submit]">Submit</button>
    
</form>
```
###
###
### Then in js:
```
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