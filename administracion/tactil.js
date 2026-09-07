document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'yt2_users';
    const SESSION_KEY = 'yt2_logged_user';

    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('form-message');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        element.textContent = message;
        element.classList.remove('success', 'error');
        element.classList.add(isError ? 'error' : 'success');
    };

    const getUsers = () => {
        try {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(users) ? users : [];
        } catch (error) {
            return [];
        }
    };

    const saveUsers = (users) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    };

    const removeUserByEmail = (emailToDelete) => {
        const users = getUsers();
        const filteredUsers = users.filter(
            (user) => user.email.toLowerCase() !== emailToDelete.toLowerCase()
        );

        if (filteredUsers.length !== users.length) {
            saveUsers(filteredUsers);
            console.log(`Usuario con correo ${emailToDelete} eliminado.`);
        }
    };

    const getLoggedUser = () => {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        } catch (error) {
            return null;
        }
    };

    const setLoggedUser = (user) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    };

    const clearLoggedUser = () => {
        localStorage.removeItem(SESSION_KEY);
    };

    const updateUserUI = () => {
        const user = getLoggedUser();
        const userStatus = document.querySelector('[data-user-status]');
        const adminLink = document.querySelector('.admin-link');

        if (!userStatus) return;

        if (user) {
            userStatus.textContent = `Usuario: ${user.username}`;
            if (adminLink) adminLink.textContent = 'Salir';
            if (adminLink) adminLink.setAttribute('href', '#');
            if (adminLink) {
                adminLink.onclick = (event) => {
                    event.preventDefault();
                    clearLoggedUser();
                    window.location.href = 'administracion/login.html';
                };
            }
        } else {
            userStatus.textContent = 'Iniciar sesión';
            if (adminLink) adminLink.textContent = '👤';
            if (adminLink) {
                adminLink.setAttribute('href', 'administracion/login.html');
                adminLink.onclick = null;
            }
        }
    };

    if (registerForm && registerMessage) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('terms').checked;

            if (!fullName || !email || !username || !password || !confirmPassword) {
                showMessage(registerMessage, 'Completa todos los campos.', true);
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                showMessage(registerMessage, 'Escribe un correo electrónico válido.', true);
                return;
            }

            if (password.length < 6) {
                showMessage(registerMessage, 'La contraseña debe tener al menos 6 caracteres.', true);
                return;
            }

            if (password !== confirmPassword) {
                showMessage(registerMessage, 'Las contraseñas no coinciden.', true);
                return;
            }

            if (!termsAccepted) {
                showMessage(registerMessage, 'Debes aceptar los términos y condiciones.', true);
                return;
            }

            const users = getUsers();
            const userExists = users.some(
                (user) => user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === email.toLowerCase()
            );

            if (userExists) {
                showMessage(registerMessage, 'Ya existe un usuario con ese nombre o correo.', true);
                return;
            }

            users.push({
                fullName,
                email,
                username,
                password
            });

            saveUsers(users);
            showMessage(registerMessage, `Registro correcto. Bienvenido/a ${username}.`, false);
            registerForm.reset();

            setTimeout(() => {
                window.location.href = '../yutu-2.html';
            }, 1000);
        });
    }

    if (loginForm && loginMessage) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const identifier = document.getElementById('login-identifier').value.trim();
            const password = document.getElementById('login-password').value;

            if (!identifier || !password) {
                showMessage(loginMessage, 'Escribe tu usuario y contraseña.', true);
                return;
            }

            const users = getUsers();
            const user = users.find(
                (item) =>
                    item.username.toLowerCase() === identifier.toLowerCase() ||
                    item.email.toLowerCase() === identifier.toLowerCase()
            );

            if (!user) {
                showMessage(loginMessage, 'Usuario no encontrado.', true);
                return;
            }

            if (user.password !== password) {
                showMessage(loginMessage, 'Contraseña incorrecta.', true);
                return;
            }

            setLoggedUser({ username: user.username, email: user.email });
            showMessage(loginMessage, `Bienvenido ${user.username}.`, false);
            loginForm.reset();

            setTimeout(() => {
                window.location.href = '../yutu-2.html';
            }, 800);
        });
    }

    updateUserUI();
});
