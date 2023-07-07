const form = document.getElementById('reset-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const response = await fetch('/resetvalidation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    //wait the backend response 
    const data = await response.json();

    if (data.resetSuccess) {
        alert(data.alerts);
    } else {
        alert(data.alerts);
    }
});