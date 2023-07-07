$(document).ready(function() {


    $('#checkout').on('click', function(event) {
   
      event.preventDefault(); 
      window.location.href = '/checkout'; 
    });

    
    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        var inputData = $("#searchInput").val();
        localStorage.setItem('searchData', inputData);
        window.location.href = '/search?search='+inputData;
        $.ajax({
            type: "GET",
            url: "search?search="+inputData,
            success: function(searchList) {

            },
            error: function(error) {
              console.log("Error transferring data");
            }
        });
    })
});