/**
 * Crea una solicitud POST con datos en formato XML (objeto Customer) 
 * y procesa las respuestas HTTP OK y ERROR usando FETCH
 * @returns {undefined}
 */
function sendRequestAndProcessResponse() {
    const signUpForm = document.getElementById("signUpForm");
    const msgBox = document.getElementById("responseMsg");

    // Construimos el objeto Customer con los datos del formulario
    const customer = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        inicial: document.getElementById("inicial").value.trim(),
        calle: document.getElementById("calle").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim(),
        pais: document.getElementById("pais").value.trim(),
        codpostal: document.getElementById("codpostal").value.trim(),
        telf: document.getElementById("telf").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    // Construcción XML
    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<customer>
<nombre>${customer.nombre}</nombre>
<apellido>${customer.apellido}</apellido>
<inicial>${customer.inicial}</inicial>
<calle>${customer.calle}</calle>
<ciudad>${customer.ciudad}</ciudad>
<pais>${customer.pais}</pais>
<codpostal>${customer.codpostal}</codpostal>
<telf>${customer.telf}</telf>
<email>${customer.email}</email>
<password>${customer.password}</password>
</customer>`.trim();

    // Guardamos el email y la contraseña temporalmente
    sessionStorage.setItem('storedEmail', customer.email);
    sessionStorage.setItem('storedPassword', customer.password);
    
    // Realizamos la petición 
    fetch(signUpForm.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml'
        },
        body: xmlBody
    })
 
    .then(response => {
        // Manejo de códigos de estado HTTP (CODIGOS OK Y DE ERROR)
        if (response.status >= 200 && response.status < 300) {
            // ✅ CORRECCIÓN FINAL: Consumimos el cuerpo de la respuesta
            return response.text(); 
        } else if (response.status === 404) {
            throw new Error('404 - Recurso no encontrado. Revise la ruta de la API.');
        } else if (response.status === 400){
            throw new Error('400 - Solicitud incorrecta. Verifique los datos.');
        } else if (response.status === 403){
            throw new Error('403 - No dispone de permisos suficientes.');
        } else if (response.status === 409){
            throw new Error('409 - El usuario introducido ya existe.');
        } else if (response.status === 500){
            throw new Error('500 - Error del servidor. Por favor, inténtelo más tarde.');
        } else {
            // Este throw solo se ejecuta si el código NO es 200-299, 404, 400, 403, 409, 500
            throw new Error('Ha ocurrido un error inesperado (Código: ' + response.status + '). Contacte al administrador.');
        }
    })
    .then(data => {
        
        
        console.log("¡Éxito de Registro! Datos de respuesta:", data);

        const msgBox = document.getElementById("responseMsg");
        msgBox.className = 'success';
        msgBox.textContent = 'Usuario registrado con éxito.';
        msgBox.style.display = 'block';

        // Intentamos la redirección
        setTimeout(() => {
            console.log("Redirigiendo a page2.html...");
            window.location.href = 'page2.html'; 
        }, 1500);

        document.getElementById("signUpForm").reset(); 
    })
    .catch(error => {
        // Manejo de errores de red o errores lanzados en el bloque .then
        console.error("Fallo final en la promesa:", error); // Log para diagnóstico
        const msgBox = document.getElementById("responseMsg");
        msgBox.className = 'error';
        // Mostramos el mensaje exacto del error.
        msgBox.textContent = 'Error: ' + error.message;
        msgBox.style.display = 'block';
    });
}
// --- FUNCIONES AUXILIARES (Sin cambios, pero necesarias) --------------------------------------

/**
 * Función para mostrar un error en la caja de mensajes
 * @param {string} message - El mensaje de error
 */
function displayError(message) {
    const msgBox = document.getElementById("responseMsg");
    msgBox.className = 'error';
    msgBox.textContent = 'Error: ' + message;
    msgBox.style.display = 'block';
}

/**
 * Funcion para limpiar la caja de mensajes
 */
function clearMessage() {
    const msgBox = document.getElementById("responseMsg");
    if (msgBox.className === 'error') {
        msgBox.style.display = 'none';
        msgBox.className = '';
        msgBox.textContent = '';
    }
}

// --- VALIDACIONES POR PÉRDIDA DE FOCO (ONBLUR) - Usando throw Error para displayError ---

function handleNameOnBlur(event) {
    try {
        const tfName = document.getElementById("nombre");
        const nombreRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/;
        
        event.preventDefault(); event.stopPropagation();
        clearMessage();

        if (tfName.value.trim() === "")
            throw new Error("El campo nombre debe estar informado.");
        if (!nombreRegExp.test(tfName.value.trim()))
            throw new Error("El campo nombre no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
        
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleSurnameOnBlur(event) {
    try {
        const tfSurname = document.getElementById("apellido");
        const apellidoRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/;
        
        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfSurname.value.trim() === "")
            throw new Error("El campo apellido debe estar informado.");
        if (!apellidoRegExp.test(tfSurname.value.trim()))
            throw new Error("El campo apellido no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleInicialOnBlur(event) {
    try {
        const tfInicial = document.getElementById("inicial");
        const inicialRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]{1,2}$/;

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfInicial.value.trim() === "")
            throw new Error("El campo inicial debe estar informado.");
        if (!inicialRegExp.test(tfInicial.value.trim()))
            throw new Error("La inicial debe ser una o dos letras/puntos.");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleStreetOnBlur(event) {
    try {
        const tfCalle = document.getElementById("calle");
        const calleRegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,'\-]{2,255}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfCalle.value.trim() === "")
            throw new Error("El campo calle debe estar informado.");
        if (!calleRegExp.test(tfCalle.value.trim()))
            throw new Error("El campo calle no tiene un formato válido (2-255 caracteres).");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleCiudadOnBlur(event) {
    try {
        const tfCiudad = document.getElementById("ciudad");
        const ciudadRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfCiudad.value.trim() === "")
            throw new Error("El campo ciudad debe estar informado.");
        if (!ciudadRegExp.test(tfCiudad.value.trim()))
            throw new Error("El campo ciudad no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handlePaisOnBlur(event) {
    try {
        const tfPais = document.getElementById("pais");
        const paisRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfPais.value.trim() === "")
            throw new Error("El campo país debe estar informado.");
        if (!paisRegExp.test(tfPais.value.trim()))
            throw new Error("El campo país no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleCoPostalOnBlur(event) {
    try {
        const tfCodpostal = document.getElementById("codpostal");
        const codpostalRegExp = /^[a-zA-Z0-9\s.,-]{3,255}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfCodpostal.value.trim() === "")
            throw new Error("El campo código postal debe estar informado.");
        if (!codpostalRegExp.test(tfCodpostal.value.trim()))
            throw new Error("El campo código postal no tiene un formato válido (mínimo 3 caracteres).");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleTelfOnBlur(event) {
    try {
        const tfTelf = document.getElementById("telf");
        const telfRegExp = /^\d{9}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfTelf.value.trim() === "")
            throw new Error("El campo teléfono debe estar informado.");
        if (!telfRegExp.test(tfTelf.value.trim()))
            throw new Error("El teléfono debe ser de exactamente 9 dígitos.");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleEmailOnBlur(event) {
    try {
        const tfEmail = document.getElementById("email");
        const emailRegExp = /^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfEmail.value.trim() === "")
            throw new Error("El campo correo electrónico debe estar informado.");
        if (!emailRegExp.test(tfEmail.value.trim()))
            throw new Error("El correo electrónico no tiene un formato válido.");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handlePasswordOnBlur(event) {
    try {
        const tfPassword = document.getElementById("password");
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/;

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfPassword.value === "")
            throw new Error("El campo contraseña debe estar informado.");
        if (!passwordRegExp.test(tfPassword.value))
            throw new Error("La contraseña no es válida: min. 8 caracteres, 1 mayús, 1 minús, 1 número, 1 car. especial.");
        
        // Llamada a la validación de la repetición para actualizar si es necesario 
        // No devolvemos el resultado de esta llamada, solo la disparamos
        handleRepeatPasswordOnBlur({ preventDefault: () => {}, stopPropagation: () => {} });
        
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

function handleRepeatPasswordOnBlur(event) {
    try {
        const tfPassword = document.getElementById("password");
        const tfRPassword = document.getElementById("rpassword");

        event.preventDefault(); event.stopPropagation();
        clearMessage();
    
        if (tfRPassword.value === "")
            throw new Error("Debe repetir la contraseña.");
        if (tfPassword.value !== tfRPassword.value)
            throw new Error("Las contraseñas no coinciden.");
    
        return true; // Éxito
    } catch (error) { 
        displayError(error.message); 
        return false; // Falla
    }
}

// --- VALIDACIÓN POR CLICK Y ENVÍO DE FORMULARIO (CLICK EN REGÍSTRATE) 

function handleSignUpClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Limpiar el mensaje de error para empezar con la validación limpia
    clearMessage(); 

    let isValid = true;
    
    // Almacena el resultado de cada validación.
    isValid = isValid && handleNameOnBlur(event);
    isValid = isValid && handleSurnameOnBlur(event);
    isValid = isValid && handleInicialOnBlur(event);
    isValid = isValid && handleStreetOnBlur(event);
    isValid = isValid && handleCiudadOnBlur(event);
    isValid = isValid && handlePaisOnBlur(event);
    isValid = isValid && handleCoPostalOnBlur(event);
    isValid = isValid && handleTelfOnBlur(event);
    isValid = isValid && handleEmailOnBlur(event);
    isValid = isValid && handlePasswordOnBlur(event); 
    isValid = isValid && handleRepeatPasswordOnBlur(event); 
                        
    if (isValid) {
        // Si todas las validaciones son exitosas, llama a la función para enviar datos
        sendRequestAndProcessResponse();
    } else {
        // Si no es válido, mostramos el mensaje genérico. 
        // Los errores específicos de campo ya se han mostrado.
        displayError("Por favor, revise y corrija todos los campos del formulario.");
    }
}

/* Redirige al index*/
function redirectToIndex(event) {
    window.location.href = 'index.html';
}

/* Asignamos eventos al cargar la página*/
window.onload = function(){
    // --- Event Listeners Originales Corregidos ---
    document.getElementById("nombre").addEventListener("blur", handleNameOnBlur);
    document.getElementById("apellido").addEventListener("blur", handleSurnameOnBlur);
    document.getElementById("inicial").addEventListener("blur", handleInicialOnBlur); 
    document.getElementById("calle").addEventListener("blur", handleStreetOnBlur);
    document.getElementById("ciudad").addEventListener("blur", handleCiudadOnBlur); 
    document.getElementById("pais").addEventListener("blur", handlePaisOnBlur); 
    document.getElementById("codpostal").addEventListener("blur", handleCoPostalOnBlur); 
    document.getElementById("telf").addEventListener("blur", handleTelfOnBlur); 
    document.getElementById("email").addEventListener("blur", handleEmailOnBlur); 
    document.getElementById("password").addEventListener("blur", handlePasswordOnBlur); 
    // Se usa el nombre de función correcto: handleRepeatPasswordOnBlur
    document.getElementById("rpassword").addEventListener("blur", handleRepeatPasswordOnBlur); 

    // --- Lógica de Cambio de Estilo Añadida ---
    loadSavedStyle(); 
    const styleSwitcherBtn = document.getElementById("styleSwitcherBtn");
    if (styleSwitcherBtn) {
        styleSwitcherBtn.addEventListener("click", switchStyle);
    }
}

// ---CAMBIO DE ESTILOS --------------------------------------------------------------------------------------

/**
 * Carga el estilo guardado en localStorage o activa el Estilo Claro por defecto.
 */
function loadSavedStyle() {
    const savedStyleTitle = localStorage.getItem('activeStyle') || "Estilo Claro";
    const allStyles = document.querySelectorAll('link[title]');
    const switcherButton = document.getElementById("styleSwitcherBtn");

    allStyles.forEach(link => {
        link.disabled = (link.title !== savedStyleTitle);
        if (link.title === savedStyleTitle && switcherButton) {
            switcherButton.textContent = `Cambiar Estilo: ${savedStyleTitle}`;
        }
    });

    if (switcherButton && switcherButton.textContent === 'Cargando tu Estilo...') {
        switcherButton.textContent = `Cambiar Estilo: Estilo Claro`;
    }
}

/**
 * Cambia al siguiente estilo de la lista y lo guarda en localStorage. 
 */
function switchStyle() {
    const allStyles = Array.from(document.querySelectorAll('link[title]'));
    const switcherButton = document.getElementById("styleSwitcherBtn");
    let activeIndex = allStyles.findIndex(s => !s.disabled);

    // Determinar el índice del siguiente estilo
    const nextIndex = (activeIndex + 1) % allStyles.length; 
    const nextStyle = allStyles[nextIndex];

    // Deshabilitar todos
    allStyles.forEach(s => {
        s.disabled = true;
    });

    // Habilitar el siguiente
    if (nextStyle) {
        nextStyle.disabled = false;
        const nextTitle = nextStyle.title;
        
        // Actualizar botón y guardar estado
        if (switcherButton) {
             switcherButton.textContent = `Cambiar Estilo: ${nextTitle}`;
        }
        localStorage.setItem('activeStyle', nextTitle);
    }
};


/*INICIO JAVASCRIPT SIGN-IN (ALEX)*/

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
                        msgBox.textContent = 'Sesión del usuario iniciada con éxito!';
                        msgBox.style.display = 'block';
                    })
                    //Procesado de errores
                    .catch(error => {
                        msgBox.className = 'error';
                        msgBox.textContent = 'Error: ' + error.message;
                        msgBox.style.display = 'block';
                    }
                );
          }
       
      // --- LÓGICA DE LOGIN (sendLoginRequestAndProcessResponse) --- (Alex revisa el codigo, este redirige al main y ademas guarda los datos del 

/**
 * Gestiona la petición de Login (signIn)
 * Procesa la respuesta XML del servidor y guarda los datos como STRINGS separados.
 * @returns {undefined}
 */
/*function sendLoginRequestAndProcessResponse() {
    const signInForm = document.getElementById("signInForm");
    const msgBox = document.getElementById("responseMsg");
    clearMessage(); // Limpiar mensajes previos

    const email = document.getElementById("tfEmail").value.trim();
    const password = document.getElementById("tfPassword").value.trim();
    
    // Construye la URL de login (asumo GET con parámetros)
    const url = signInForm.action + "?email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
    
    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/xml' // Indicamos que esperamos XML
        }
    })
    .then(response => {
        // Manejo de códigos de estado HTTP y estilo de notificación
        if (response.status >= 200 && response.status < 300) {
            // CLAVE: DEVOLVER EL TEXTO XML COMPLETO
            return response.text(); 
        } else if (response.status === 401) {
            throw new Error('Credenciales inválidas. Correo o contraseña incorrectos.');
        } else if (response.status === 404) {
            throw new Error('404 - Recurso no encontrado. Revise la ruta de la API.');
        } else {
            throw new Error('Error al iniciar sesión (Código: ' + response.status + ').');
        }
    })
    .then(xmlText => {
        // CLAVE: ANALIZAR EL XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        
        // Extraer los datos del XML (Asumo etiquetas <nombre> y <apellido>)
        const nombreNode = xmlDoc.getElementsByTagName("nombre")[0];
        const apellidoNode = xmlDoc.getElementsByTagName("apellido")[0];
        
        if (!nombreNode || !apellidoNode) {
            // Error en la estructura del XML
            throw new Error("Respuesta de servidor incompleta (falta nombre/apellido en el XML).");
        }

        const nombre = nombreNode.textContent;
        const apellido = apellidoNode.textContent;

        // ✅ 1. GUARDAR DATOS DEL USUARIO COMO STRINGS SEPARADOS
        sessionStorage.setItem('userName', nombre);
        sessionStorage.setItem('userSurname', apellido);
        
        // 2. Mostrar mensaje de éxito
        msgBox.className = 'success';
        msgBox.textContent = '¡Inicio de sesión exitoso! Redirigiendo a principalpr...';
        msgBox.style.display = 'block';

        // 3. Redirección a principalpr.html
        setTimeout(() => {
            window.location.href = 'principalpr.html'; 
        }, 1000);

    })
    .catch(error => {
        // Mostrar mensaje de error (mismo estilo que signUp)
        msgBox.className = 'error';
        msgBox.textContent = 'Error: ' + error.message; 
        msgBox.style.display = 'block';
        console.error("Fallo de Login:", error);
    });
}


// --- LÓGICA DE CARGA EN principalpr.html (Para mostrar el nombre) ---

/**
 * Carga el nombre y apellido guardados en sessionStorage y los muestra.
 */
function loadUserName() {
    // ✅ RECUPERAR DATOS COMO STRINGS SEPARADOS
    const nombre = sessionStorage.getItem('userName');
    const apellido = sessionStorage.getItem('userSurname');
    const displayElement = document.getElementById('userNameDisplay');

    if (nombre && apellido && displayElement) {
        // Muestra Nombre y Apellido
        displayElement.textContent = `Bienvenido, ${nombre} ${apellido}`;
    } else if (displayElement) {
         // Si no hay sesión, muestra mensaje
         displayElement.textContent = 'Usuario Invitado'; 
         // Si deseas forzar el login si no hay sesión:
         // window.location.href = 'page2.html'; 
    }
}


// --- INICIALIZACIÓN GLOBAL ---

window.addEventListener('load', function() {
    // Si estamos en principalpr.html, cargamos el nombre
    if (document.getElementById('userNameDisplay')) {
        loadUserName();
    }
    // ... (otras inicializaciones como el enfoque de campo) ...
});

// Nota: Asegúrate de que las funciones clearMessage() y displayError() también estén en comp.js
// y que el botón de login en page2.html llame a sendLoginRequestAndProcessResponse()*/
      /* @returns {undefined}
      */   
          
function handleCancelOnClick() {
    window.location.href = 'index.html';
}


/*INICIO JAVASCRIPT CHANGE PASSWORD (KENNETH)*/

const API_URL = 'http://localhost:8080/CRUDBankServerSide/webresources/customer';

// Obtiene el userId desde localStorage (para mantener logueado al usuario de antes)
function getUserId() {
  return localStorage.getItem('userId');
}


// FUNCIONES DE VALIDACIones

// Valida que la contraseña cumpla los requisitos
function validarRequisitosPassword(password) {
  const errores = [];
  
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (password.length > 255) {
    errores.push('La contraseña no puede exceder 255 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una minúscula');
  }
  
  return errores;
}

// Muestra un mensaje de error debajo del campo
function mostrarError(campoId, mensaje) {
  const errorSpan = document.getElementById(`error-${campoId}`);
  if (errorSpan) {
    errorSpan.textContent = mensaje;
    errorSpan.style.display = 'block';
  }
}

// Oculta el mensaje de error
function ocultarError(campoId) {
  const errorSpan = document.getElementById(`error-${campoId}`);
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
}

// Verifica la contraseña actual contra el servidor
async function verificarPasswordActual(password) {
  // Obtiene el ID del usuario
  const userId = getUserId();
  
  // Si no hay usuario logueado muestra un error en consola y devuelve false
  if (!userId) {
    console.error('No hay usuario logueado');
    return false;
  }
  
  try {
    // Realiza un POST al endpoint de verificación de contraseña del usuario
    const response = await fetch(`${API_URL}/users/${userId}/verify-password`, {
      method: 'POST', // Método HTTP utilizado
      headers: {
        // Indica que se está enviando y esperando contenido en formato JSON
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Envía el password como cuerpo de la petición en formato JSON
      body: JSON.stringify({ password: password })
    });
    
    // Devuelve true si la respuesta del servidor fue exitosa y false si no fue exitosa
    return response.ok;
  } catch (error) {
    // Si ocurre un error en la petición como que el servidor no responde, lo muestra en consola
    console.error('Error al verificar contraseña:', error);
    return false; // Devuelve false para indicar que la verificación falló
  }
}



// EVENTOS DE VALIDACIÓN AL PERDER FOCO


// Campo ee contraseña actual
document.getElementById('campoactual').addEventListener('blur', async function() {
  const password = this.value.trim();
  
  if (password === '') {
    mostrarError('actual', 'Este campo es obligatorio');
    return;
  }
  
  // Verificar contra el servidor
  const esValida = await verificarPasswordActual(password);
  
  if (!esValida) {
    mostrarError('actual', 'La contraseña actual es incorrecta');
  } else {
    ocultarError('actual');
  }
});

// Campo de nueva contraseña
document.getElementById('camponueva').addEventListener('blur', function() {
  const password = this.value.trim();
  const confirmar = document.getElementById('camporepetir').value.trim();
  
  if (password === '') {
    mostrarError('nueva', 'Este campo es obligatorio');
    return;
  }
  
  // Validar requisitos de contraseña
  const errores = validarRequisitosPassword(password);
  
  if (errores.length > 0) {
    mostrarError('nueva', errores.join('. '));
    return;
  }
  
  ocultarError('nueva');
  
  // Si el campo confirmar ya tiene valor se verifica coincidencia
  if (confirmar !== '') {
    if (password !== confirmar) {
      mostrarError('confirmar', 'Las contraseñas no coinciden');
    } else {
      ocultarError('confirmar');
    }
  }
});

// Camp de confirmar nueva contraseña
document.getElementById('camporepetir').addEventListener('blur', function() {
  const confirmar = this.value.trim();
  const nueva = document.getElementById('camponueva').value.trim();
  
  if (confirmar === '') {
    mostrarError('confirmar', 'Este campo es obligatorio');
    return;
  }
  
  if (confirmar !== nueva) {
    mostrarError('confirmar', 'Las contraseñas no coinciden');
  } else {
    ocultarError('confirmar');
  }
});


// FUNCIONALIDAD DE MOSTRAR/OCULTAR CONTRASEÑA

document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = '🙈';
    } else {
      input.type = 'password';
      this.textContent = '👁️';
    }
  });
});


// BOTÓN BORRAR

document.getElementById('btn-limpiar-campos').addEventListener('click', function() {
  // Limpiar todos los campos
  document.getElementById('campoactual').value = '';
  document.getElementById('camponueva').value = '';
  document.getElementById('camporepetir').value = '';
  
  // Ocultar todos los errores
  ocultarError('actual');
  ocultarError('nueva');
  ocultarError('confirmar');
  
  // Enfocar el primer campo
  document.getElementById('campoactual').focus();
});


// BOTÓN CANCELAR

document.getElementById('btn-cancelar-cambio').addEventListener('click', function() {
  // Redirigir a la página principal
  window.location.href = 'index.html'; // Ajusta según tu página principal
});


// BOTÓN PÁGINA INICIO

document.getElementById('btn-pagina-inicio').addEventListener('click', function() {
  window.location.href = 'index.html'; // Ajusta según tu página principal
});


// BOTÓN LOGOUT

document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
  // Limpiar datos de sesión
  localStorage.removeItem('userId');
  localStorage.removeItem('userToken');
  
  // Redirigir a página de login
  window.location.href = 'page2.html'; // Ajusta según tu página de login
});


// ENVÍO DEL FORMULARIO (CONFIRMAR)

document.getElementById('form-cambio').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const actual = document.getElementById('campoactual').value.trim();
  const nueva = document.getElementById('camponueva').value.trim();
  const confirmar = document.getElementById('camporepetir').value.trim();
  
  let hayErrores = false;
  
  // Valida que todos los campos esten llenos
  if (actual === '') {
    mostrarError('actual', 'Este campo es obligatorio');
    hayErrores = true;
  }
  
  if (nueva === '') {
    mostrarError('nueva', 'Este campo es obligatorio');
    hayErrores = true;
  }
  
  if (confirmar === '') {
    mostrarError('confirmar', 'Este campo es obligatorio');
    hayErrores = true;
  }
  
  if (hayErrores) return;
  
  // Validar requisitos de la nueva contraseña que hemos puesto
  const errores = validarRequisitosPassword(nueva);
  if (errores.length > 0) {
    mostrarError('nueva', errores.join('. '));
    return;
  }
  
  // Validar que las contraseñas sean las mismas
  if (nueva !== confirmar) {
    mostrarError('confirmar', 'Las contraseñas no coinciden');
    return;
  }
  
  // Verificar contraseña actual
  const passwordActualValida = await verificarPasswordActual(actual);
  if (!passwordActualValida) {
    mostrarError('actual', 'La contraseña actual es incorrecta');
    return;
  }
  
  // Si todo está bien se llama al servicio PUT
  await cambiarPasswordEnServidor(actual, nueva);
});


// LLAMADA AL SERVICIO RESTful (PUT)

async function cambiarPasswordEnServidor(passwordActual, passwordNueva) {
  const userId = getUserId();
  
  if (!userId) {
    alert('Error: No se encontró el usuario logueado');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users/${userId}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordActual,
        newPassword: passwordNueva
      })
    });
    
    if (response.ok) {
      // se muestra modal de confirmación
      mostrarModalConfirmacion();
    } else {
      const errorData = await response.json();
      alert('Error al cambiar la contraseña: ' + (errorData.message || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    alert('Error de conexión con el servidor. Por favor, inténtelo más tarde.');
  }
}


// MODAL DE CONFIRMACIÓN

function mostrarModalConfirmacion() {
  const modal = document.getElementById('modal-confirmacion');
  modal.style.display = 'flex';
}

document.getElementById('btn-modal-ok').addEventListener('click', function() {
  // Cerrar modal y se redirige a la página principal
  document.getElementById('modal-confirmacion').style.display = 'none';
  window.location.href = 'index.html'; // Ajusta según tu página principal
});


// INICIALIZACIÓN AL CARGAR LA PÁGINA

window.addEventListener('load', function() {
  // Enfocar el primer campo al cargar
  const campoActual = document.getElementById('campoactual');
  if (campoActual) {
      campoActual.focus();
  }
  
  // Verificar que haya un usuario logueado
  const userId = getUserId();
  if (!userId) {
    // Si esta página es de cambio de contraseña, se redirige al login.
    // Asumo que 'page2.html' es la página de login.
    // Solo se debe hacer esta alerta/redirección si el usuario está en la página de cambio de contraseña.
    // Si estás en la página de registro, esta lógica es irrelevante.
    // alert('Debe iniciar sesión para acceder a esta página');
    // window.location.href = 'page2.html'; 
  }
});