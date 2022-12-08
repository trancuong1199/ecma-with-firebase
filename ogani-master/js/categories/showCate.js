import { getDatabase, ref, get, child, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const dbRef = ref(getDatabase());
let data;
const listCate = document.querySelector('#listCate');
const renderOrder = () => {
    get(child(dbRef, `Categories`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            console.log(data);
            showCate(data)
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}   

renderOrder()


function showCate(data) {
    let output = []
    for (let prd in data) {
        output += `<li><a href="shop-grid.html?id=${prd}">${data[prd].name}</a></li>`;
    }
    listCate.innerHTML = output;
}
