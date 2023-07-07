$(document).ready(function() {
    const addPhoneBtn = $("#addPhoneBtn");
    const phoneForm = $("#addNewPhone");
    const okBtn = $("#okBtn");
  
    // Show the form when the "Add New Phone" button is clicked
    addPhoneBtn.on("click", function() {
      phoneForm.toggleClass("d-none");
      $(this).css("display","none");
    });
    
    // Handle the form submission
    okBtn.on("click", function(e) {
      e.preventDefault();
  
      // Collect the form data
      const phoneDataObj = {
        phoneTitle: $("#phoneTitle").val(),
        brand: $("#phoneBrand").val(),
        price: $("#phonePrice").val(),
        quantity: $("#phoneQuantity").val(),
        requestType: 'requestaddNewPhone'
      };
      const theData = JSON.stringify(phoneDataObj);
      // Send the AJAX POST request
      $.ajax({
        url: '/user/addPhone',
        type: 'POST',
        contentType: 'application/json',
        data: theData,
        dataType: 'json',
        success: function(response) {
          // Hide the form and display the alert
          phoneForm.addClass("d-none");
          alert("Phone added successfully!");
  
          // Clear the form fields
          phoneForm.trigger("reset");
          location.reload();
        },
        error: function(error) {
          alert("An error occurred when adding a new phone. Please try again");
        }
      });
    });
})
  