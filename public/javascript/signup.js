const form = document.getElementById('signup-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmedpassword = document.getElementById('confirmedpassword').value;

    if(password != confirmedpassword)
    {
        alert("The password and confirmed password is different");
    }
    else{
        if(password.length <8 || confirmedpassword.length<8)
        {
            alert("The password input at least 8 characters!");
        }
        else{
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstname,lastname,email, password, confirmedpassword }),
                });
                //wait the backend response
                const data = await response.json();
        
                if (data.signupsuccess) {
                    alert('Sign up successfully');
                    window.location.href = "/";
        
                } else {
                    alert(data.alerts);
                    window.location.href = "/";
                }
        }
        
    }
    
});