var excelTabla=[];
var btnDatos = document.getElementById('btnDatos');
var btnValidar = document.getElementById('btnValidar');

var input = document.getElementById('input');
var btnAlert = document.getElementById('btnAlert');
btnDatos.addEventListener("click", function () {
    var tabla = document.getElementById('example');
    tabla.innerHTML="";
    obtenerDatosDeExcel();
   
});
btnValidar.addEventListener("click", function () {
  
    ListarTabla();
});


btnAlert.addEventListener("click", function () {
  
    handleFileSelect(input);
});
function handleFileSelect(evt) {
    //Get the files from Upload control
    var files = evt.target.files;
    var i, f;
    //Loop through files
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (evt) {
            var data = evt.target.result;

            var result;
			/* convert from workbook to array of arrays */
			workbook = XLSX.read(data, {type: 'binary'});
			var first_sheet_name = workbook.SheetNames[0];

			// var first_worksheet = data.Sheets[data.SheetNames[0]];
		

			
            var data = XLSX.utils.sheet_to_json(first_sheet_name, {header:1});
            alert(result[0].Column1);
        };
        reader.readAsArrayBuffer(f);
    }
}

function ListarTabla() {
    var tabla = document.getElementById('example');
    tabla.innerHTML="";
    var con = '';


	var contenido = excelTabla;
    var html = "";
    for (var i = 0; i < excelTabla.length; i++) {
        html += "<tr>";
        html += "<td>" + excelTabla[i].Correos + "</td>";
		html += "<td>" + validateEmail(excelTabla[i].Correos) + "</td>";
        html += "</tr>";

	}

    tabla.innerHTML = html;

    contenido=[];
    //var jsonData = contenido;
    //debugger



	
	
}

function obtenerDatosDeExcel() {

/* set up XMLHttpRequest */
	var url = "correos.xlsx";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";

	oReq.onload = function(e) {
	var arraybuffer = oReq.response;

	/* convert data to binary string */
	var data = new Uint8Array(arraybuffer);
	var arr = new Array();
	for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
	var bstr = arr.join("");

	/* Call XLSX */
	
	var workbook = XLSX.read(bstr, {type:"binary"});

	/* DO SOMETHING WITH workbook HERE */
	var first_sheet_name = workbook.SheetNames[0];
	/* Get worksheet */
	var worksheet = workbook.Sheets[first_sheet_name];
	

	

	excelTabla = XLSX.utils.sheet_to_json(worksheet, {
				raw: true
			});
				
	console.table(excelTabla);
	}

	oReq.send();
}


function validateEmail(email){
	// Extraer el nombre de la persona o dueño del correo. 
	// Entonces por ejemplo tenemos a csuazo@biobiochile.cl --- entonces el nombre seria csuazo. el nombre puede estar antes o despues del arroba. "@". 													
													

	// Tengo varias condicion la primera es eliminar los numeros del nombre y 
	// los puntos "." reemplazar por un espacio. 
    // Segunda condicion es si en el nombre que esta antes del arroba esta las siguientes palabras "info" "contacto" "ventas", automaticamente usar como nombre la informacion despues el arroba "@" 
    //por ejempo correo : contacto@gonzales.com -- el nombre seria gonzales. 
	// Y todos los resultados expresados en csv, separados por comas.
	let emailRecibido = email;
	
    var emailValido = "";
    
    emailValido = emailRecibido.split("@")[0];
    emailValido = emailValido.replace(/[0-9]/g,"");
    emailValido = emailValido.replace(/\./g," ");
    if(emailValido=="info" || emailValido=="ventas" || emailValido=="contacto"){
		emailValido = emailRecibido.split("@")[1];
		emailValido = emailValido.split(".")[0];
        emailValido = "<b>"+emailValido+"</b>";

    }
        
    
    return emailValido;
	
}