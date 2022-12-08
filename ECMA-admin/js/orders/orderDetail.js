import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const getId = params.id
const dbRef = ref(getDatabase());
const listDetail = document.querySelector('#listDetail');

let data;
const renderDetail = () => {
    get(child(dbRef, `order_details`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            showDetail(data)
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}   

renderDetail()

function showDetail(data) {
    let output = []
    for (let prd in data) {
        console.log(data[prd].order_id);
        if(getId == data[prd].order_id) {
            output += `
                <tr>
                    <th scope="row">${data[prd].name}</th>
                    <td>
                        <img src="${data[prd].image}" width="150">
                    </td>
                    <td>${data[prd].quantity}</td>
                    <td>$${data[prd].price}</td>
                    <td>$${data[prd].price * data[prd].quantity}</td>
                </tr>`;
        }
    }
    listDetail.innerHTML = output;
}