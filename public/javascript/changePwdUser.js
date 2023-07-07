$(document).ready(function() {
  const $passwordContainer = $('#passwordContainer');
  const $changePasswordButton = $('#changePasswordBtn');
  const $confirmButton = $('#confirmButton');

  $changePasswordButton.on('click', function(event) {
    event.preventDefault();
    $(this).hide();
    $passwordContainer.removeClass('d-none');
  });

  $confirmButton.on('click', function(event) {
    event.preventDefault();
    //console.log("CLicked confirm");
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();

    const theDataObj = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        requestType: 'requestUserPwd'
      };
    const theData = JSON.stringify(theDataObj);
    //console.log(theData);
    $.ajax({
      url: '/user/pwd',
      type: 'POST',
      contentType: 'application/json',
      data: theData,
      dataType: 'json',
      success: function(result) {
        $passwordContainer.addClass('d-none');
        $changePasswordButton.show();
        //console.log("succeed" + result);
        alert(result.result);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle any errors that occurred during the Ajax request
        alert('Error: ' + errorThrown);
      }
    });
  });
});
