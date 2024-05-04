export function isStrictMode ()
{
	var strict = (function() { return !this; })();

	if (strict) {console.log ( "strict mode enabled, strict is " + strict );} 
	else 		{console.log ( "strict mode not defined, strict is " + strict );}
}

export function isEmpty (val)
{
	return isArrayStringEmpty(val) || isObjectEmpty (val);
}

export function isArrayStringEmpty (arr)
{
	return arr.length === 0;
}

export function isObjectEmpty (obj)
{
	return obj
		&& Object.keys(obj).length === 0
		&& Object.getPrototypeOf(obj) === Object.prototype;
}

export function isIterable (el)
{
  return Symbol.iterator in Object(el);
}

export function isString (myVar)
{
  return (typeof myVar === 'string' || myVar instanceof String);
}

export function isTouchDevice ()
{
	return window.matchMedia("(pointer: coarse)").matches;
}