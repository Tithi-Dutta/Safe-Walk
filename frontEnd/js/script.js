document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // API URL - use HTTPS
    const API_URL = 'https://localhost:5000';

    // Add better error handling to the fetch requests
    fetch(`${API_URL}/api/test`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log('API connection test:', data))
        .catch(error => {
            console.error('API connection test failed:', error);
            // Show a helpful message to the user about certificate issues
            if (error.message.includes('Failed to fetch')) {
                console.warn('If you see certificate errors, please visit https://localhost:5000 directly in your browser first and accept the certificate warning.');
            }
        });

    // Mobile Navigation Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Modal Functions
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            closeModal(modal);
        });
    }

    // Open Login Modal
    loginBtn.addEventListener('click', () => {
        openModal(loginModal);
    });

    // Open Register Modal
    registerBtn.addEventListener('click', () => {
        openModal(registerModal);
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Switch between login and register
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // Register Form Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById('register-name').value;
        const age = document.getElementById('register-age').value;
        const email = document.getElementById('register-email').value;
        const contactNo = document.getElementById('register-contact').value;
        const emergencyContact = document.getElementById('register-emergency').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Submitting registration form...');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    age,
                    email,
                    contactNo,
                    emergencyContact,
                    password
                })
            });

            console.log('Registration response status:', response.status);
            const data = await response.json();
            console.log('Registration response data:', data);

            if (data.success) {
                alert(`Registration successful! Welcome to Safe-walk, ${fullName}!`);
                closeModal(registerModal);
                registerForm.reset();
                openModal(loginModal); // Redirect to login
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });

    // Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        console.log('Submitting login form...');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);

            if (data.success) {
                // Save token to localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                alert(`Login successful! Welcome back, ${data.user.fullName}!`);
                closeModal(loginModal);

                // Redirect to dashboard
                window.location.href = './Safety_Dashboard.html';
            } else {
                alert(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    // Check if user is already logged in
    function checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // User is already logged in
            // You can modify the UI accordingly
            loginBtn.textContent = 'DASHBOARD';
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = './Safety_Dashboard.html';
            });

            registerBtn.textContent = 'LOGOUT';
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
                window.location.reload();
            });
        }
    }

    // Call the function to check auth status when page loads
    checkAuthStatus();
});