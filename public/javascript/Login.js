const form = document.getElementById('login-form');
localStorage.setItem('previousPageUrl', document.referrer);
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email + "   " + password);
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    //wait the backend response 
    const data = await response.json();

    if (data.loginSuccess) {
        window.onload = function() {
            //navigate back to the "previous" page
            var previousPageUrl = localStorage.getItem('previousPageUrl');
            //console.log("HERE " + previousPageUrl);
            if (previousPageUrl) {
            window.location.href = previousPageUrl;
            }
        };

        alert('Login Successfully');
        window.onload();

    } else {
        alert('Incorrect password');
    }
});