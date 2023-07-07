$(document).ready(function() {
    $('#enableBtn').click(function(e) {
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
            requestType: 'requestEnable'
        };
        const theData = JSON.stringify(theDataObj);
        // Send the ids to the server
        $.ajax({
          url: '/user/enablePhone',
          type: 'POST',
          contentType: 'application/json',
          data: theData,
          dataType: 'json',
          success: function() {
            alert("You have enabled the phone(s)");
            // Refresh the page
            location.reload();
          },
          error: function(error) {
            alert("An error occurred when enabling a phone. Please try again");
          }
        });
    });

})