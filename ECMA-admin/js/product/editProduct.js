import { getDatabase, ref, get, child, push, set, update } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const dbRef = ref(getDatabase());
const db = getDatabase();
const id = params.id

const name = document.querySelector('#name');
const cate = document.querySelector('#cate');
const price = document.querySelector('#price');
const detail = document.querySelector('#detail');
const image = document.querySelector('#image');
const btnEdit = document.querySelector('#btnEdit');


get(child(dbRef, `Products/${id}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            get(child(dbRef, `Categories`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        let dataCate = snapshot.val()
                        for(let id in dataCate) {
                            let cat = dataCate[id];
                            cate.innerHTML += `<option value="${id}" ${id === data.cate_id ? 'selected': ''}>${cat.name}</option>`;
                        }
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            name.value = data.name
            price.value = data.price
            detail.value = data.detail
            image.src = data.image
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });

btnEdit.onclick = (e) => {
    e.preventDefault();

    const postListRef = ref(db, 'Products/' + id);

    update(postListRef, {
        cate_id: cate.value,
        detail: detail.value,
        name: name.value,
        price: price.value
    })
    
    alert('Sửa thành công')
}