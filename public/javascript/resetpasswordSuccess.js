const form = document.getElementById('reset-form');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
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
                    const response = await fetch('/resetSuccess', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({  password, confirmedpassword }),
                        });
                        //wait the backend response
                        const data = await response.json();
        
                        if (data.resetsuccess) {
                            alert('Sign up success');
                            window.location.href = "/";
                        } else {
                            alert(data.alerts);
                            window.location.href = "/";
                        }
                }
               


            }
            
        });