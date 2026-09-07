document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const messageBox = document.getElementById('form-message');

    if (!form || !messageBox) return;

    const STORAGE_KEY = 'yt2_users';

    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('success', 'error');
        messageBox.classList.add(isError ? 'error' : 'success');
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

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('terms').checked;

        if (!fullName || !email || !username || !password || !confirmPassword) {
            showMessage('Completa todos los campos.', true);
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showMessage('Escribe un correo electrónico válido.', true);
            return;
        }

        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres.', true);
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden.', true);
            return;
        }

        if (!termsAccepted) {
            showMessage('Debes aceptar los términos y condiciones.', true);
            return;
        }

        const users = getUsers();
        const userExists = users.some(
            (user) => user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === email.toLowerCase()
        );

        if (userExists) {
            showMessage('Ya existe un usuario con ese nombre o correo.', true);
            return;
        }

        users.push({
            fullName,
            email,
            username,
            password
        });

        saveUsers(users);
        showMessage(`Registro correcto. Bienvenido/a ${username}.`, false);
        form.reset();
    });
});
