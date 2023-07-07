
var maximum = 10000;

$(document).ready(function() {
    var data = localStorage.getItem('searchData');

    localStorage.clear();
    localStorage.setItem('searchData', data);

    $('#searchButton').on('click', function(event) {
        event.preventDefault();
        var inputData = $("#searchInput").val();
       
        var brandData = localStorage.getItem('brandData');
        var maximumData = localStorage.getItem('maximumData');
        if (brandData == null){
            brandData = "";
        }
        if (maximumData == null){
            maximumData = 10000;
        }

        $.ajax({
            type: "GET",
            url: "search/searchData?search="+inputData+"&"+"brand="+brandData+"&"+"maximum="+maximumData,

            success: function(searchList) {
                //console.log(searchList);
                var tbody = $('#resultBody');
                tbody.empty();
                searchList.forEach(phone =>{
                    var newRow = $('<tr>').attr('id', phone._id).click(function(){
                        window.location.href='/item?id='+phone._id;
                    });

                    var imgurl = $('<img>').attr('src', phone.image);
                    imgurl.addClass('img-thumbnail');
                    newRow.append($('<td>').append(imgurl));
                    newRow.append($('<td>').text(phone.title));
                    newRow.append($('<td>').text(phone.brand));
                    newRow.append($('<td>').text(phone.price));
                    newRow.append($('<td>').text(phone.stock));
                    tbody.append(newRow);
                })
                localStorage.setItem('searchData', inputData);
            },
            error: function(error) {
              console.log("Error transferring data");
            }
          });
    });


    $('#checkout').on('click', function(event) {
   
        event.preventDefault(); 
        window.location.href = '/checkout'; 
      });


    $('#selectBrand').change(function() {
        var brandData = $("#selectBrand").val();

        //console.log(selectData);
        var searchData = localStorage.getItem('searchData');
        var maximumData = localStorage.getItem('maximumData');
        if (maximumData == null){
            maximumData = 10000;
        }
        if (searchData == null){
            searchData = "";
        }
        
        $.ajax({
            type: "GET",
            url: "search/searchData?search="+searchData+"&"+"brand="+brandData+"&"+"maximum="+maximumData,

            success: function(searchList) {
                console.log(searchList);
                var tbody = $('#resultBody');
                tbody.empty();
                searchList.forEach(phone =>{
                    var newRow = $('<tr>').attr('id', phone._id).click(function(){
                        window.location.href='/item?id='+phone._id;
                    });
                    var imgurl = $('<img>').attr('src', phone.image);
                    imgurl.addClass('img-thumbnail');
                    newRow.append($('<td>').append(imgurl));
                    newRow.append($('<td>').text(phone.title));
                    newRow.append($('<td>').text(phone.brand));
                    newRow.append($('<td>').text(phone.price));
                    newRow.append($('<td>').text(phone.stock));
                    tbody.append(newRow);
                })
                localStorage.setItem('brandData', brandData);

            },
            error: function(error) {
              console.log("Error transferring data");
            }
        });
       
    });
   
    $('#setMaximum').on('click', function(){
        var searchData = localStorage.getItem('searchData');
        var brandData = localStorage.getItem('brandData');
        //console.log(brandData);
        if (brandData==null ){
            brandData="";

        }
        if (searchData == null){
            searchData = "";
        }
        $.ajax({
            type: "GET",
            url: "search/searchData?search="+searchData+"&"+"brand="+brandData+"&"+"maximum="+maximum,

            success: function(searchList) {
                console.log(searchList);
                var tbody = $('#resultBody');
                tbody.empty();
                searchList.forEach(phone =>{
                    var newRow = $('<tr>').attr('id', phone._id).click(function(){
                        window.location.href='/item?id='+phone._id;
                    });
                    var imgurl = $('<img>').attr('src', phone.image);
                    imgurl.addClass('img-thumbnail');
                    newRow.append($('<td>').append(imgurl));
                    newRow.append($('<td>').text(phone.title));
                    newRow.append($('<td>').text(phone.brand));
                    newRow.append($('<td>').text(phone.price));
                    newRow.append($('<td>').text(phone.stock));
                    tbody.append(newRow);
                })
                localStorage.setItem('maximumData', maximum);
            },
            error: function(error) {
            console.log("Error transferring data");
            }
        });
    })
});

function updateValue(value) {
    $("#slideValue").html(value);
    document.getElementById('sliderValue').innerHTML = value;
    //console.log("Slider value:", value);
    maximum = value;
    
}

//display the filter information on UI
document.addEventListener("DOMContentLoaded", function() {
    var searchData = new URLSearchParams(window.location.search).get("search");
    var brandData = new URLSearchParams(window.location.search).get("brand");
    var maximumData = new URLSearchParams(window.location.search).get("maximum");
    var selectBrand = document.getElementById("selectBrand");
    var searchInput = document.getElementById('searchInput');
    var sliderValue = document.getElementById('sliderValue');
    var checkout = document.getElementById('checkout');

    if (searchData==null || searchData==""){
        searchInput.setAttribute('placeholder', "Search")
    }else{
        searchInput.setAttribute('placeholder', searchData);
    }
    if (brandData==null ){
        selectBrand.value = "";
    }else{
        selectBrand.value = brandData; 
    }

    if (maximumData==null ){
        sliderValue.innerHTML = 1000;
    }else{
        sliderValue.innerHTML = maximumData; 
    }
    
});
                  