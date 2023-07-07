

document.addEventListener("DOMContentLoaded", async () => {
    const tables = document.querySelector("#main-table tbody");
    const backbtn = document.getElementById("back");
    const changebtn = document.getElementById("remove");
    const confirmbtn = document.getElementById("confirm");
    var TotalPrice = 0;

    function showprice(items) {
        var total_price = document.getElementById("total_price");
        let total_p = 0;
        for (let i = 0; i < items.length; i++) {
            total_p = total_p + items[i]["price"] * items[i]["quantity"];
        }
        total_p = total_p.toFixed(2);
        let result = "Total Price: " + total_p;
        total_price.innerHTML = result;
    }

    function showlist(items) {
        console.log("THE FK IS" + items);
        tables.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
            const row = document.createElement("tr");
            row.id = "row" + (i + 1);
            const checkbox = document.createElement("td");
            const name = document.createElement("td");
            const price = document.createElement("td");
            const quantity = document.createElement("td");

            var checkbox_input = document.createElement("input");
            checkbox_input.type = "checkbox";
            checkbox_input.id = "checkbox" + (i + 1);

            var phone_name = items[i].name;

            var phone_price = items[i].price;

            var quantity_num = document.createElement("input");
            quantity_num.type = "number";
            quantity_num.value = items[i].quantity;
            quantity_num.min = 0;
            quantity_num.max = items[i].stock;
            quantity_num.id = "quantity" + i;
            quantity_num.addEventListener("input", function (e) {
                items[i].quantity = this.value;
                let arrString = JSON.stringify(items);
                sessionStorage.setItem("myArray", arrString);
                showprice(items);
            });

            checkbox.appendChild(checkbox_input);

            name.textContent = phone_name;
            price.textContent = phone_price;
            quantity.appendChild(quantity_num);

            row.appendChild(checkbox);
            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(quantity);

            tables.appendChild(row);
        }
        showprice(items);
    }

    function selectAllCheckboxes(items) {
        let Remove_collection = [];
        for (let i = 0; i < items.length; i++) {
            const checkboxes = document.getElementById("checkbox" + (i + 1));

            if (checkboxes.checked) {
                Remove_collection.push(i);
            }
        }
        return Remove_collection;
    }

    function removeSelection(lists, items) {
        for (let i = lists.length - 1; i >= 0; i--) {
            items.splice(lists[i], 1);
        }
        let arrString = JSON.stringify(items);
        sessionStorage.setItem("myArray", arrString);
        console.log("The list is" + arrString);
        return items;
    }

    backbtn.addEventListener("click", () => {
        window.location.href = "/";
    });

    changebtn.addEventListener("click", async () => {
        let removeSession = [];
        let items = JSON.parse(sessionStorage.getItem("myArray"));
        let selectedlists = selectAllCheckboxes(items);
        for (let i = 0; i < selectedlists.length; i++){
            removeSession.push(items[selectedlists[i]]);
        }
        console.log("The session moved is " + JSON.stringify(removeSession));

        const response = await fetch('/checkout', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({removeSession}),
        });
        //wait the backend response 
        const data = await response.json();
        console.dir("The updated session" + data, { depth: null });
        items = removeSelection(selectedlists, items);

        showlist(items)
    });
    confirmbtn.addEventListener("click", async function () {
        let items = JSON.parse(sessionStorage.getItem("myArray"));

        try {
            const response = await fetch("/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(items),
            });

            // wait for the backend response
            const data = await response.json();

            alert("Transcation succesfully");
            window.location.href = "/";
        } catch (error) {
            console.error("Error:", error);
        }
    });

    try {
        var itemsElement = document.getElementById('itemsData');
        var items = JSON.parse(itemsElement.value);
        
        let arrString = JSON.stringify(items);
        sessionStorage.setItem("myArray", arrString);
        showlist(items);
    } catch (error) {
        console.log("Error in fetching items:", error);
    }
});