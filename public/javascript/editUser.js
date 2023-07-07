$(document).ready(function() {
    $('#editButton').on('click',  function(event) {
        event.preventDefault();
        if ($('#editForm').css('display') === 'none') {
            // Show the input fields and change the button text to "Save"
            $('#editForm').show();
            $('#userInfo').hide();
            $('#editButton').text('Save');
          } else {
            // Save the new information and change the button text to "Edit"
            const Ufirstname = $('#firstname');
            const Ulastname = $('#lastname');
            const Uemail = $('#email');
        
            Ufirstname.text($('#input-firstname').val());
            Ulastname.text($('#input-lastname').val());
            Uemail.text($('#input-email').val());
        
            //console.log(Ufirstname.text());
            //console.log(Ulastname.text());
            //console.log(Uemail.text());

            $('#editForm').hide();
            $('#userInfo').show();
            $('#editButton').text('Edit');
            
            const theDataObj = {
                firstname: Ufirstname.text(),
                lastname: Ulastname.text(),
                email: Uemail.text(),
                requestType: 'requestUser'
              };
            const theData = JSON.stringify(theDataObj);

            $.ajax({
                url: '/user',
                type: 'POST',
                contentType: 'application/json',
                data: theData,
                dataType: 'json',
                success: function (response) {
                    console.log('User updated:', response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error updating user:', errorThrown);
                },
                complete: function () {
                    console.log('Request completed');
                },
            });
        }
        
    });
});