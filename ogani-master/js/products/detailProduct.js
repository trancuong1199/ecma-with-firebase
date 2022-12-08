import { getDatabase, ref, get, child, push } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const getId = params.id

const dbRef = ref(getDatabase());
const name = document.querySelector('#name');
const price = document.querySelector('.product__details__price');
const detail = document.querySelector('#detail');
const image = document.querySelector('.product__details__pic__item--large');
const btnAdd = document.querySelector('.btnAdd');
const qty = document.querySelector('#qty');

get(child(dbRef, `Products/${getId}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            name.innerText = data.name
            price.innerText = '$' + data.price
            detail.innerText = data.detail
            image.src = data.image

            btnAdd.onclick = () => {
                let cart = JSON.parse(localStorage.getItem('cart'))

                if(cart) {
                    let check = cart.find((item) => item.id === getId)
                    if(check) {
                        check.quantity += Number(qty.value)
                    } else {
                        cart.push({
                            id: getId,
                            name: data.name,
                            price: data.price,
                            image: data.image,
                            quantity: Number(qty.value)
                        })
                    }
                } else {
                    cart = []
                    cart.push({
                        id: getId,
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        quantity: 1
                    })
                }
                localStorage.setItem('cart', JSON.stringify(cart))

                alert('Thêm thành công')
            }
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });