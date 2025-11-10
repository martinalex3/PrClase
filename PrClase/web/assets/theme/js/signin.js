function Customer(  id, 
                    firstName, 
                    lastName, 
                    middleInitial, 
                    street, 
                    city, 
                    state,
                    zip,
                    phone,
                    email,
                    password) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleInitial = middleInitial;
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.phone = phone;
    this.email = email;
    this.password = password;
}
// FUNCIONES DE SIGN-IN (Necesitan su propio contexto de formulario, pero se mantienen aquí para completar el archivo)

function handleSignInOnClick(event) {
    try {
        // Obtenemos los objetos para los elementos del form
        const tfEmail = document.getElementById("tfEmail"); //Referencia al email
        const tfPassword = document.getElementById("tfPassword"); //Referencia a la contraseña
        const signInForm = document.getElementById("signInForm"); //Referencia al formulario

        // Expresión regular para validar el email
        const emailRegExp =
            new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

        // Detenemos la propagación de eventos y la acción por defecto del formulario
        event.preventDefault();
        event.stopPropagation();
        // Validar que email y password están informados
        if (tfEmail.value.trim() === "" || tfPassword.value.trim() === "")
            throw new Error("El correo electrónico y la contraseña deben de estar informados.");
        // Validar que email y password cumplen longitud
        if (tfEmail.value.length > 255)
            throw new Error("El correo electrónico no puede tener más de 255 caracteres.");
        if (tfPassword.value.length > 255)
            throw new Error("La contraseña no puede tener más de 255 caracteres.");
        // Validar formato de email
        if (!emailRegExp.exec(tfEmail.value.trim()))
            throw new Error("El correo electrónico no tiene un formato válido, inténtelo de nuevo.");
        
        // Si pasa todas las validaciones, llama a la función que envía los datos
        sendSignInRequestAndProcessResponse(); // Cambiado a un nombre específico para evitar conflictos
    } catch (error) {
        // Muestra de errores.
        const msgBox = document.getElementById("responseMsg");
        msgBox.className = 'error';
        msgBox.textContent = 'Error: ' + error.message;
        msgBox.style.display = 'block';
    }
}

function sendSignInRequestAndProcessResponse() {
    // Obtenemos referencias 
    const signInForm = document.getElementById("signInForm");
    const msgBox = document.getElementById("responseMsg");
    const tfEmail = document.getElementById("tfEmail");       
    const tfPassword = document.getElementById("tfPassword"); 

    // Obtenemos los valores de los campos
    const valueTfEmail = tfEmail.value.trim();
    const valueTfPassword = tfPassword.value.trim();
            //Realizamos la petición usando el API Fetch
            fetch(signInForm.action +
                    `${encodeURIComponent(valueTfEmail)}/${encodeURIComponent(valueTfPassword)}`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/xml'
                      }
                }).then(response => {
                    //Procesado de respuesta error 401
                    if (response.status===401){
                        return response.text().then(text => {
                        throw new Error('Credenciales incorrectas, por favor, inténtelo de nuevo.');
                        });
                     }
                    //Procesado de respuesta error 500
                    else if (response.status===500){
                      return response.text().then(text => {
                        throw new Error('Error del servidor! Por favor inténtelo mas tarde o acuda al centro de atención al usuario.');
                        });
                      }
                    //Procesado de respuesta otro error
                    else if (!response.ok) {
                        return response.text().then(text => {
                        throw new Error(text || 'Error inesperado! Sentimos las molestias');
                        });
                      }
                    return response;
                    })
                    //Procesado de respuesta OK 
                    .then(data => {
                    msgBox.className = 'success';
                    msgBox.textContent = 'Sesión del usuario iniciada con éxito! Redirigiendo...';
                    msgBox.style.display = 'block';
                    
                    //Coger los datos y enviarlos a una sesion
                    storeResponseXMLData(data);
                    //Coger los datos del customer
                    const customerXML=`
                            <customer>
                                <city>${sessionStorage.getItem("customer.city")}</city>
                                <email>${sessionStorage.getItem("customer.email")}</email>
                                <firstName>${sessionStorage.getItem("customer.firstName")}</firstName>
                                <id>${sessionStorage.getItem("customer.id")}</id>
                                <lastName>${sessionStorage.getItem("customer.lastName")}</lastName>
                                <middelInitial>${sessionStorage.getItem("customer.middleInitial")}</middelInitial>
                                <password>${valueTfPassword}</password>
                                <phone>${sessionStorage.getItem("customer.phone")}</phone>
                                <state>${sessionStorage.getItem("customer.state")}</state>
                                <street>${sessionStorage.getItem("customer.street")}</street>
                                <zip>${sessionStorage.getItem("customer.zip")}</zip>
                            </customer>
                            `;

                    // Redirigir automáticamente a principalpr.html después de 1 segundo
                    setTimeout(() => {
                    window.location.href = 'principalpr.html';
                    }, 1000);
                })  
                    
                    //Procesado de errores
                    .catch(error => {
                        msgBox.className = 'error';
                        msgBox.textContent = 'Error: ' + error.message;
                        msgBox.style.display = 'block';
                    }
                );
          }
// --- LÓGICA DE CARGA EN principalpr.html (Para mostrar el nombre) ---         
function handleCancelOnClick() {
    window.location.href = 'index.html';
}
//Guardado de nombre en la siguiente pagina (principalpr.html)
function loadUserName() {
    const nombre = sessionStorage.getItem('userName');
    const apellido = sessionStorage.getItem('userSurname');
    const displayElement = document.getElementById('userNameDisplay');

    if (nombre && apellido && displayElement) {
        displayElement.textContent = `Bienvenido, ${nombre} ${apellido}`;
    } else if (displayElement) {
        displayElement.textContent = 'Usuario Invitado';
    }
}

window.addEventListener('load', function() {
    // Si estamos en principalpr.html, cargamos el nombre
    if (document.getElementById('userNameDisplay')) {
        loadUserName();
    }
});
            function storeResponseXMLData (xmlString){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const get = (tag) => {
        const el = xmlDoc.getElementsByTagName(tag)[0];
        return el ? el.textContent : "";
    };
    const customer = new Customer(
        get("id"),
        get("firstName"),
        get("lastName"),
        get("middleInitial"),
        get("street"),
        get("city"),
        get("state"),
        get("zip"),
        get("phone"),
        get("email"),
        get("password")
    );
                // Guardamos los datos en la sesion
                sessionStorage.setItem("customer.id", customer.id);
                sessionStorage.setItem("customer.firstName", customer.firstName);
                sessionStorage.setItem("customer.lastName", customer.lastName);
                sessionStorage.setItem("customer.middleInitial", customer.middleInitial);
                sessionStorage.setItem("customer.street", customer.street);
                sessionStorage.setItem("customer.city", customer.city);
                sessionStorage.setItem("customer.state", customer.state);
                sessionStorage.setItem("customer.zip", customer.zip);
                sessionStorage.setItem("customer.phone", customer.phone);
                sessionStorage.setItem("customer.email", customer.email);
                sessionStorage.setItem("customer.password", customer.password);
            }


