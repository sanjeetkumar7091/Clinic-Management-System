try {
  var auth = firebase.auth();
  var db = firebase.firestore();
} catch (e) {
  // Variables already declared or firebase not loaded yet
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');
  const showRegisterLink = document.getElementById('show-register');

  // Toggle between login and register forms
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginError.textContent = '';
        registerError.textContent = '';
        registerSuccess.textContent = '';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginError.textContent = '';
        registerError.textContent = '';
        registerSuccess.textContent = '';
      }
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
          loginError.textContent = 'User role not found. Contact admin.';
          await auth.signOut();
          return;
        }
        const userData = userDoc.data();

        // Automatically redirect based on user role
        if (userData.role === 'doctor') {
          window.location.href = 'doctor.html';
        } else if (userData.role === 'receptionist') {
          window.location.href = 'receptionist.html';
        } else if (userData.role === 'patient') {
          window.location.href = 'patient.html';
        } else {
          loginError.textContent = 'Invalid user role.';
          await auth.signOut();
        }

      } catch (error) {
        loginError.textContent = error.message;
      }
    });
  }

  // Login as Doctor button submission
  const loginDoctorBtn = document.getElementById('login-doctor-btn');
  if (loginDoctorBtn) {
    loginDoctorBtn.addEventListener('click', async () => {
      loginError.textContent = '';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        loginError.textContent = 'Please enter email and password.';
        return;
      }

      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
          loginError.textContent = 'User role not found. Contact admin.';
          await auth.signOut();
          return;
        }
        const userData = userDoc.data();

        // Check if user is doctor
        if (userData.role === 'doctor') {
          window.location.href = 'doctor.html';
        } else {
          loginError.textContent = 'You are not a doctor.';
          await auth.signOut();
        }
      } catch (error) {
        loginError.textContent = error.message;
      }
    });
  }

  // Login as Receptionist button submission
  const loginReceptionistBtn = document.getElementById('login-receptionist-btn');
  if (loginReceptionistBtn) {
    loginReceptionistBtn.addEventListener('click', async () => {
      loginError.textContent = '';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        loginError.textContent = 'Please enter email and password.';
        return;
      }

      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
          loginError.textContent = 'User role not found. Contact admin.';
          await auth.signOut();
          return;
        }
        const userData = userDoc.data();

        // Check if user is receptionist
        if (userData.role === 'receptionist') {
          window.location.href = 'receptionist.html';
        } else {
          loginError.textContent = 'You are not a receptionist.';
          await auth.signOut();
        }
      } catch (error) {
        loginError.textContent = error.message;
      }
    });
  }

  // Register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.textContent = '';
      registerSuccess.textContent = '';

      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;

      if (password !== confirmPassword) {
        registerError.textContent = 'Passwords do not match.';
        return;
      }

      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save user role in Firestore (default to receptionist)
        await db.collection('users').doc(user.uid).set({
          role: 'receptionist',
          email: email,
          createdAt: new Date()
        });

        registerSuccess.textContent = 'Registration successful! You can now log in.';
        registerForm.reset();

        // Switch back to login form
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
      } catch (error) {
        registerError.textContent = error.message;
      }
    });
  }

  // Logout button handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'index.html'; // Redirect to main page after logout
    });
  }

  // Post-login page buttons
  const doctorPageBtn = document.getElementById('doctor-page-btn');
  const receptionistPageBtn = document.getElementById('receptionist-page-btn');
  const patientPageBtn = document.getElementById('patient-page-btn');

  if (doctorPageBtn) {
    doctorPageBtn.addEventListener('click', () => {
      if (window.loggedInUserRole === 'doctor') {
        window.location.href = 'doctor.html';
      } else {
        alert('Access denied: You are not a doctor.');
      }
    });
  }

  if (receptionistPageBtn) {
    receptionistPageBtn.addEventListener('click', () => {
      if (window.loggedInUserRole === 'receptionist') {
        window.location.href = 'receptionist.html';
      } else {
        alert('Access denied: You are not a receptionist.');
      }
    });
  }

  if (patientPageBtn) {
    patientPageBtn.addEventListener('click', () => {
      if (window.loggedInUserRole === 'patient') {
        window.location.href = 'patient.html';
      } else {
        alert('Access denied: You are not a patient.');
      }
    });
  }

  // On doctor.html, receptionist.html or patient.html, check auth state and redirect if not logged in
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
      return;
    }
    // Optionally, verify role matches page
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await auth.signOut();
      if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
      return;
    }
    const userData = userDoc.data();
    if (window.location.pathname.endsWith('doctor.html') && userData.role !== 'doctor') {
      await auth.signOut();
      if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
    }
    if (window.location.pathname.endsWith('receptionist.html') && userData.role !== 'receptionist') {
      await auth.signOut();
      if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
    }
    if (window.location.pathname.endsWith('patient.html') && userData.role !== 'patient') {
      await auth.signOut();
      if (!window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
    }
  });
});
