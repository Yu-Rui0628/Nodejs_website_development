$(document).ready(function() {
    $('#removeBtn').click(function(e) {
        e.preventDefault();
        // Get all checked checkboxes
        const checkedPhones = $('.phone-checkbox:checked');
        //console.log(checkedPhones);

        // Extract the ids of the checked phones
        const phoneIds = checkedPhones.map(function() {
          return $(this).val();
        }).get();
        //console.log(JSON.stringify(phoneIds));

        const theDataObj = {
            phoneIds: phoneIds,
            requestType: 'requestDelete'
        };
        const theData = JSON.stringify(theDataObj);
        // Send the ids to the server
        $.ajax({
          url: '/user/removePhone',
          type: 'POST',
          contentType: 'application/json',
          data: theData,
          dataType: 'json',
          success: function() {
            alert("You have removed the phone(s)");
            // Refresh the page
            location.reload();
          },
          error: function(error) {
            alert("An error occurred when removing a phone. Please try again");
          }
        });
    });
})