$(document).ready(function() {
    $('#checkout').on('click', async function() {
        console.log("connect to checkout");
        try {
            const response = await fetch('/checkout');
            const data = await response.json();
            console.log(data); 
        } catch (error) {
            console.error('Error:', error);
        }
      });
    
    $('.showMore').click(function() {
        var button = $(this);
        var commentId = button.data('comment');
        var moreId = button.data('more');
       
        
        $('#'+commentId).css('display', 'none');
        $('#'+moreId).css('display', 'block');
        $(this).css('display', 'none');
    });

    $('#showQuantity').click(function() {
        
        $(this).css('display', 'none');
        $('#message').css('display', 'none');
        $('#inputQuantity').css('display', 'block');
        $('#submitQuantity').css('display', 'block');
    });

    $('#checkout').on('click', function() {
        console.log("connect to checkout");
        window.location.href = '/checkout';
        });

    $('#submitQuantity').click(function() {
        var inputData = $('#inputQuantity').val();
        if (inputData>=100){
            alert('Cannot more than 100');
        }else{
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get('id');
            console.log(inputData);
            $.ajax({
                type: "POST",
                url: "/addQuantity",
                data: {quantity: inputData,
                        itemId: itemId
                },
                success: function(result) {
                    //console.log(result);
                    if (result.message=="failed"){
                        alert("You have not login")
                        window.location.href = '/login';
                    }else if (result.message=="out"){
                        alert("Cannot add more than stock")
                    }else{
                        $('#quantity').remove();
                        var p = $('<p>').text(result);
                        
                        p.attr('id','quantity');
                        $('#add').append(p);
                    
                        $('#message').css('display','block');
                        $('#showQuantity').css('display','block');
                        $('#inputQuantity').css('display', 'none');
                        $('#submitQuantity').css('display', 'none');  
                    }
                    
                    
                }   
                    
                
            })
        }
    });







    $('#commentSubmit').click(function() {
        var inputData = $('#commentInput').val();
        var selectRating = $('#selectRating').val();
        var hidden = $('#hidden').is(':checked');
        console.log(hidden);
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        if (inputData.length<6){
            alert("input should larger than 5 characters");
        }else if (selectRating=="none"){
            alert("Please select a rating");
        }else{
            //console.log(inputData);
            //console.log(selectRating);
            //console.log(itemId);
            $.ajax({
                type: "POST",
                url: "/comment",
                data: {comment: inputData,
                        itemId: itemId,
                        rating: selectRating,
                        hidden: hidden
                    

                },
                success: function(result) {
                    console.log("HERE " + result.message);
                    if (result.message=="failed"){
                        alert("You have not login")
                        window.location.href = '/login';

                    }else{
                        
                        console.log(result.username);
                        console.log(result.comment);
                        $("#newName").html(result.username);
                        $("#newComment").html(result.comment);
                        $("#commentSubmit").css("display","none");
                        $("#whenSubmit").css("display","none");
                    }

                }   
            })
        }
    });


});
  
  
  
  
  
  
  