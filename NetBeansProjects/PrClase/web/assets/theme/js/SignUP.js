
/**
 * Constructor del objeto Customer, que define la estructura esperada por el servidor
 * y utilizada para la deserialización XML.
 */
function Customer( id,
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
// ------------------------------------------

// --- DEFINICIÓN DE ERROR PERSONALIZADO ---

/**
 * Crea un objeto de error para el caso específico de un código 500 que
 * en realidad es un registro exitoso (mala práctica del servidor).
 */
function ServerSuccess500Error(message) {
    const error = new Error(message);
    error.name = 'ServerSuccess500Error';
    return error;
}

// ------------------------------------------

// --- FUNCIÓN PRINCIPAL DE PETICIÓN ---

/**
 * Crea una solicitud POST con datos en formato XML y procesa las respuestas HTTP.
 * @returns {undefined}
 */
function sendRequestAndProcessResponse() {
    const signUpForm = document.getElementById("signUpForm");
    
    // 1. Recolección de datos
    const valueEmail = document.getElementById("tfEmail").value.trim();
    const valuePassword = document.getElementById("tfPassword").value.trim();
    sessionStorage.setItem('customer', valueEmail);
    sessionStorage.setItem('storedPassword', valuePassword);
    
    // 2. Construcción XML
    const xmlBody = `
          <customer>
          <firstName>${document.getElementById("tfName").value.trim()}</firstName>
          <lastName>${document.getElementById("tfLastname").value.trim()}</lastName>
          <middleInitial>${document.getElementById("tfMiddlelinitial").value.trim()}</middleInitial>
          <street>${document.getElementById("tfStreet").value.trim()}</street>
          <city>${document.getElementById("tfCity").value.trim()}</city>
          <state>${document.getElementById("tfState").value.trim()}</state>
          <zip>${document.getElementById("tfZip").value.trim()}</zip>
          <phone>${document.getElementById("tfPhone").value.trim()}</phone>
          <email>${valueEmail}</email>
          <password>${valuePassword}</password>
          </customer>`.trim();

    // 3. Realizamos la petición POST
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
            // Éxito normal
            return response.text(); 
        } else if (response.status === 500){
            // Error personalizado para que el .catch lo detecte. (En caso de registro exitoso y salida de error 500)
            throw ServerSuccess500Error('500 - Registro completado, pero el servidor devolvió un error.');
        } else if (response.status === 404) {
            throw new Error('404 - Recurso no encontrado. Revise la ruta de la API.');
        } else if (response.status === 400){
            throw new Error('400 - Solicitud incorrecta. Verifique los datos.');
        } else if (response.status === 403){
            throw new Error('403 - No dispone de permisos suficientes.');
        } else if (response.status === 409){
            throw new Error('409 - El usuario introducido ya existe.');
        } else {
            // Solo se ejecuta si el código NO es 200-299, 500, 404, 400, 403, 409
            throw new Error('Ha ocurrido un error inesperado (Código: ' + response.status + '). Contacte al administrador.');
        }
    })
    .then(data => {
        // Bloque de éxito estándar (código 2xx)
        handleSuccessfulRegistration(data);
    })
    .catch(error => {
        // Manejo de errores de red o errores lanzados en el bloque .then
        
        // Comprobamos si es el error 500 personalizado.
        if (error.name === 'ServerSuccess500Error') {
            console.warn("Manejo Especial: Error 500 detectado como registro exitoso.");
            handleSuccessfulRegistration("Respuesta 500 asumida como éxito.");
        } else {
            // Es un fallo real (4xx, 500 real, red)
            console.error("Fallo final en la promesa:", error); 
            const msgBox = document.getElementById("responseMsg");
            msgBox.className = 'error';
            // Mostramos el mensaje exacto del error.
            msgBox.textContent = 'Error: ' + error.message;
            msgBox.style.display = 'block';
        }
    });
}

// --- FUNCIONES AUXILIARES ---

/**
 * Lógica común de manejo de registro exitoso (mensaje y redirección).
 * @param {string} data - El cuerpo de la respuesta o un mensaje.
 */
function handleSuccessfulRegistration(data = "Datos no disponibles") {
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
}

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
    if (msgBox) {
        msgBox.style.display = 'none';
        msgBox.className = '';
        msgBox.textContent = '';
    }
}

// --- VALIDACIONES POR PÉRDIDA DE FOCO (ONBLUR) ---
// Cada campo tiene su fución asociada al id que le corresponde en el html
function handleNameOnBlur(event) {
    try {
        const tfName = document.getElementById("tfName"); 
        const nombreRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/;
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfName.value.trim() === "")
            throw new Error("El campo Nombre debe estar informado.");
        if (!nombreRegExp.test(tfName.value.trim()))
            throw new Error("El campo Nombre no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleLastnameOnBlur(event) {
    try {
        const tfSurname = document.getElementById("tfLastname"); 
        const apellidoRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/;
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfSurname.value.trim() === "")
            throw new Error("El campo Apellido debe estar informado.");
        if (!apellidoRegExp.test(tfSurname.value.trim()))
            throw new Error("El campo Apellido no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleInitialOnBlur(event) {
    try {
        const tfInicial = document.getElementById("tfMiddlelinitial"); 
        const inicialRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]{1,2}$/;
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfInicial.value.trim() === "")
            throw new Error("El campo Inicial Primer Apellido debe estar informado.");
        if (!inicialRegExp.test(tfInicial.value.trim()))
            throw new Error("La inicial debe ser una o dos letras/puntos.");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleStreetOnBlur(event) {
    try {
        const tfCalle = document.getElementById("tfStreet"); 
        const calleRegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,'\-]{2,255}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfCalle.value.trim() === "")
            throw new Error("El campo Calle debe estar informado.");
        if (!calleRegExp.test(tfCalle.value.trim()))
            throw new Error("El campo Calle no tiene un formato válido (2-255 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleCityOnBlur(event) {
    try {
        const tfCiudad = document.getElementById("tfCity"); 
        const ciudadRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfCiudad.value.trim() === "")
            throw new Error("El campo Ciudad debe estar informado.");
        if (!ciudadRegExp.test(tfCiudad.value.trim()))
            throw new Error("El campo Ciudad no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleStateOnBlur(event) {
    try {
        const tfPais = document.getElementById("tfState"); 
        const paisRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,255}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfPais.value.trim() === "")
            throw new Error("El campo País debe estar informado.");
        if (!paisRegExp.test(tfPais.value.trim()))
            throw new Error("El campo País no tiene un formato válido (solo letras y espacios, 2-255 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleZipOnBlur(event) {
    try {
        const tfCodpostal = document.getElementById("tfZip"); 
        const codpostalRegExp = /^[a-zA-Z0-9\s.,-]{3,255}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfCodpostal.value.trim() === "")
            throw new Error("El campo Código Postal debe estar informado.");
        if (!codpostalRegExp.test(tfCodpostal.value.trim()))
            throw new Error("El campo Código Postal no tiene un formato válido (mínimo 3 caracteres).");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handlePhoneOnBlur(event) {
    try {
        const tfTelf = document.getElementById("tfPhone"); 
        const telfRegExp = /^\d{9}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfTelf.value.trim() === "")
            throw new Error("El campo Teléfono debe estar informado.");
        if (!telfRegExp.test(tfTelf.value.trim()))
            throw new Error("El Teléfono debe ser de exactamente 9 dígitos.");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleEmailOnBlur(event) {
    try {
        const tfEmail = document.getElementById("tfEmail"); 
        const emailRegExp = /^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfEmail.value.trim() === "")
            throw new Error("El campo Correo Electrónico debe estar informado.");
        if (!emailRegExp.test(tfEmail.value.trim()))
            throw new Error("El Correo Electrónico no tiene un formato válido.");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handlePasswordOnBlur(event) {
    try {
        const tfPassword = document.getElementById("tfPassword"); 
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/;
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfPassword.value === "")
            throw new Error("El campo Contraseña debe estar informado.");
        if (!passwordRegExp.test(tfPassword.value))
            throw new Error("La Contraseña no es válida: min. 8 caracteres, 1 mayús, 1 minús, 1 número, 1 car. especial.");
        handleRepeatPasswordOnBlur({ preventDefault: () => {}, stopPropagation: () => {} });
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}
function handleRepeatPasswordOnBlur(event) {
    try {
        const tfPassword = document.getElementById("tfPassword"); 
        const tfRPassword = document.getElementById("rpassword");
        event.preventDefault(); event.stopPropagation();
        clearMessage();
        if (tfRPassword.value === "")
            throw new Error("Debe repetir la contraseña.");
        if (tfPassword.value !== tfRPassword.value)
            throw new Error("Las contraseñas no coinciden.");
        return true; 
    } catch (error) { 
        displayError(error.message); 
        return false; 
    }
}

// --- VALIDACIÓN Y ENVÍO DEL FORMULARIO ---

function handleSignUpClick(event) {
    event.preventDefault();
    event.stopPropagation();
    clearMessage(); 
    let isValid = true;
    // Ejecutamos TODAS las validaciones
    // Nota: La ejecución en cadena (isValid = isValid && ...) garantiza que 
    // todas las funciones de validación se llamen, y si alguna falla, isValid 
    // será false por lo que mostrará un mensaje de error.
    isValid = isValid && handleNameOnBlur(event);
    isValid = isValid && handleLastnameOnBlur(event);
    isValid = isValid && handleInitialOnBlur(event);
    isValid = isValid && handleStreetOnBlur(event);
    isValid = isValid && handleCityOnBlur(event);
    isValid = isValid && handleStateOnBlur(event);
    isValid = isValid && handleZipOnBlur(event);
    isValid = isValid && handlePhoneOnBlur(event);
    isValid = isValid && handleEmailOnBlur(event);
    isValid = isValid && handlePasswordOnBlur(event); 
    isValid = isValid && handleRepeatPasswordOnBlur(event); 
    if (isValid) {
        sendRequestAndProcessResponse();
    } else {
        displayError("Por favor, revise y corrija todos los campos del formulario.");
    }
}

/* Redirige al index*/
function redirectToIndex(event) {
    window.location.href = 'index.html';
}

/* Asignamos eventos al cargar la página*/
window.onload = function(){
    // --- Event Listeners para validación ONBLUR (IDs CORREGIDOS) ---
    document.getElementById("tfName").addEventListener("blur", handleNameOnBlur);
    document.getElementById("tfLastname").addEventListener("blur", handleLastnameOnBlur);
    document.getElementById("tfMiddlelinitial").addEventListener("blur", handleInitialOnBlur); 
    document.getElementById("tfStreet").addEventListener("blur", handleStreetOnBlur);
    document.getElementById("tfCity").addEventListener("blur", handleCityOnBlur); 
    document.getElementById("tfState").addEventListener("blur", handleStateOnBlur); 
    document.getElementById("tfZip").addEventListener("blur", handleZipOnBlur); 
    document.getElementById("tfPhone").addEventListener("blur", handlePhoneOnBlur); 
    document.getElementById("tfEmail").addEventListener("blur", handleEmailOnBlur); 
    document.getElementById("tfPassword").addEventListener("blur", handlePasswordOnBlur); 
    document.getElementById("rpassword").addEventListener("blur", handleRepeatPasswordOnBlur); 
    // --- Lógica de Botón de Registro ---
    const registerBtn = document.getElementById("registerBtn");
    if(registerBtn) {
        registerBtn.addEventListener("click", handleSignUpClick);
    }
    // --- Lógica de Estilos ---
    loadSavedStyle(); 
    const styleSwitcherBtn = document.getElementById("styleSwitcherBtn");
    if (styleSwitcherBtn) {
        styleSwitcherBtn.addEventListener("click", switchStyle);
    }
};

// --- CAMBIO DE ESTILOS ---

/**
 * Carga el estilo guardado en localStorage o activa el Estilo Claro por defecto.
 */
function loadSavedStyle() {
    const savedStyleTitle = localStorage.getItem('activeStyle') || "Estilo Claro";
    const allStyles = document.querySelectorAll('link[title]'); // No hemos visto en clase "Queryselector" pero no econtraba otra manera de hacerlo. Quizás en el html con un combo en ve de un switcher y en el javascript codificar el comportamiento
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
 * Cambia al siguiente estilo de la lista y lo guarda en localStorage 
 * (no en sessionstorage ya que este sólo guarda información de la sesión) 
 * nosotros queremos que persista la elección del usuario.
 */
function switchStyle() {
    const allStyles = Array.from(document.querySelectorAll('link[title]'));
    const switcherButton = document.getElementById("styleSwitcherBtn");
    let activeIndex = allStyles.findIndex(s => !s.disabled);
    const nextIndex = (activeIndex + 1) % allStyles.length; 
    const nextStyle = allStyles[nextIndex];
    allStyles.forEach(s => {
        s.disabled = true;
    });
    if (nextStyle) {
        nextStyle.disabled = false;
        const nextTitle = nextStyle.title;
        if (switcherButton) {
             switcherButton.textContent = `Cambiar Estilo: ${nextTitle}`;
        }
        localStorage.setItem('activeStyle', nextTitle);
    }
};