document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const imageUploadModal = document.getElementById('image-upload-modal');
    const closeButtons = document.querySelectorAll('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    //const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const changeImagesBtn = document.getElementById('change-images');
    const logoUpload = document.getElementById('logo-upload');
    const heroUpload = document.getElementById('hero-upload');
    const logoPreview = document.getElementById('logo-preview');
    const heroPreview = document.getElementById('hero-preview');
    const saveLogo = document.getElementById('save-logo');
    const saveHero = document.getElementById('save-hero');
    const closeUploadModal = document.getElementById('close-upload-modal');
    const logoImg = document.getElementById('logo-img');
    const heroImg = document.getElementById('hero-img');

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
        if (e.target === imageUploadModal) {
            closeModal(imageUploadModal);
        }
    });

    // Form Submission
    // loginForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const email = document.getElementById('login-email').value;
    //     const password = document.getElementById('login-password').value;
        
    //     // Here you would typically send this data to your server
    //     console.log('Login attempt:', { email, password });
        
    //     // For demo purposes, we'll just show an alert
    //     alert(`Login successful! Welcome back, ${email}`);
    //     closeModal(loginModal);
    //     loginForm.reset();
    // });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Here you would typically send this data to your server
        console.log('Registration:', { name, email, password });
        
        // For demo purposes, we'll just show an alert
        alert(`Registration successful! Welcome to Safe-walk, ${name}!`);
        closeModal(registerModal);
        registerForm.reset();
    });

    // Image Upload Preview


   


    // Store user data in localStorage (for demo purposes)
    function saveUserToLocalStorage(user) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    function checkUserCredentials(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => user.email === email && user.password === password);
    }

    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission
    
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        window.location.href = "./Safety_Dashboard.html";
    
        /*try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
    
            const result = await response.json();
            result.ok=true;
            result.success=true;
    
            if (response.ok && result.success) {
                console.log("ok");
                window.location.href = "/Safety_Dashboard.html";
            } else {
                alert(result.message || "Login failed.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while logging in.");
        }*/
    });
});