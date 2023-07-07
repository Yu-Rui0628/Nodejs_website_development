$(document).ready(function() {
    $('#disableBtn').click(function(e) {
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
            requestType: 'requestDisable'
        };
        const theData = JSON.stringify(theDataObj);
        // Send the ids to the server
        $.ajax({
          url: '/user/disablePhone',
          type: 'POST',
          contentType: 'application/json',
          data: theData,
          dataType: 'json',
          success: function() {
            alert("You have disabled the phone(s)");
            // Refresh the page
            location.reload();
          },
          error: function(error) {
            alert("An error occurred when disabling a phone. Please try again");
          }
        });
      });

})