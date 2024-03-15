export async function pripravSoubory (file, zaNazev = '')
{												//cLog('file', file, pripravSoubory);
	var data = [];
		
	for (let f=0; f < file.files.length ; f++)
	{												//console.log(file.files[f]);
		var nazev = file.files[f].name.split('\\').pop();
		var pripona = nazev.split('.').pop();
		var soubor =
		{
			nazev: nazev + zaNazev,
			pripona: pripona,
			base64: await toBase64(file.files[f])
		}
//		console.log(soubor);
	
		data.push(soubor); //console.log(data);
	}

	return data;
}

const toBase64 = file => new Promise((resolve, reject) =>
{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const base64FromUrl = async (url) => 
{
  const data = await fetch(url);					//cLog('data', data, base64FromUrl);
  const blob = await data.blob();
//  const blob = new Blob([data], {type: 'image/gif'});
  
  return new Promise((resolve) => 
  {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
    var base64data = reader.result; 
    base64data = base64data;  //.split(',')[1]
      resolve(base64data);
    }
  });
}

export async function downloadStream (data, headers)
{																
    var contentDisposition = headers['content-disposition'];				//cLog('contentDisposition', contentDisposition, downloadStream);
//    var matches = /"([^"]*)"/.exec(contentDisposition);						cLog('matches', matches, downloadStream);
//    var filename =  matches[1];												cLog('filename', filename, downloadStream);
	var filename = contentDispositionGetFileName (contentDisposition);
//    var pripona = filename.split('.').pop();
    var mimeType = headers['content-type'];
	
	// vytvořit odkaz
//	const content = base64ToArrayBuffer(blob_base64);
	var blob = new Blob([data], { type: mimeType });
	
    var link = document.createElement('a');
    const blobUrl = window.URL.createObjectURL(blob);
    link.href = blobUrl;
    link.download = filename;

	// stáhnout
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // clean up Url
    window.URL.revokeObjectURL(blobUrl);
}

function contentDispositionGetFileName (contentDisposition)
{
    var filename = '';

    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) 
    {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(contentDisposition);	//cLog('matches', matches, contentDispositionGetFileName);
        if (matches != null && matches[1]) 
        { 
          filename = matches[1].replace(/['"]/g, '');
        }
    }
    
    return filename;
}

export function print (data, dataType, outputType)
{		
	if 		(dataType === 'base64') {var content = base64ToArrayBuffer(data);}
	else if (dataType  === 'blob')   {var content = data;}
	
 	const blob = new Blob([content], { type: outputType });
 	const url = window.URL.createObjectURL(blob);			//cLog ('url', url, vytisknout_);
	
	print_(url).then(()=>
	{
		window.URL.revokeObjectURL(url);	//cLog ('revokeObjectURL', '', vytisknout_);
	});
}

function print_ (cestaRel) // relativní cesta nebo url objektu
{		
	return new Promise( (resolve) =>
	{
								
	//	var w = window.open(G_URL_INDEX+cestaRel);		cLog ('w', w, vytisknout);
	//	w.print();
		let pdfFrame = document.body.appendChild(document.createElement('iframe'));
	    pdfFrame.style.display = 'none';
	    pdfFrame.onload = ( () =>
	    { 
			void pdfFrame.contentWindow.print();	//cLog ('vytisknuto', '', vytisknout);
			resolve(true);
		});
	    pdfFrame.src = cestaRel; 
    });   
}

export function base64ToArrayBuffer (data)
{
    const bString = atob(data);
    const bLength = bString.length;
    let bytes = new Uint8Array(bLength);
    for (let i = 0; i < bLength; i++) {
        const ascii = bString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

export var priponaMimeTyp = 
{
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'png': 'image/png',
	'pdf': 'application/pdf',
	'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

export function mimeTypPodlePripony (pripona)
{
	if (priponaMimeTyp.hasOwnProperty(pripona)) 
	{
    	return priponaMimeTyp[pripona];
    }
    else
    {
		cLog('mimeTyp není definován');
		return false;	
	}
}

export async function souborExistuje (url) 
{	
	return (await fetch(url, {method: "HEAD"})).ok;
	
//	return new Promise( async (resolve) =>
//	{
//		try 
//		{
//														//cLog('souborExistuje ??', null, souborExistuje);
//        	var r = await fetch(url, {method: "HEAD"});	//cLog('r', r, souborExistuje); 
//        	if (r.ok) 	{resolve(true);}
//        	else		{resolve(false);}
//	    } 
//	    catch(err) 
//	    {
////			cLog('souborn neexistuje', err, souborExistuje);
//			resolve(false);
//	    }
//	})
}

//export function souborExistuje(url)
//{
//    return new Promise( (resolve) => 
//    {
//        var http = new XMLHttpRequest();
//        http.open('HEAD', url);
//        http.onreadystatechange = () =>
//        {
//            if (http.readyState === 4) 
//            {
//                resolve(http.status === 200);
//            }
//        };
//        http.send();
//    });
//}