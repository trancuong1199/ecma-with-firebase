import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const db = getDatabase();


let cart = JSON.parse(localStorage.getItem('cart'));
const list = document.querySelector('#listProducts');
const total = document.querySelector('#total');
const btnOrder = document.querySelector('.btnOrder');
const name = document.querySelector('#name');
const address = document.querySelector('#address');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');

let temp = 0;
cart.map(value => {
    temp += Number(value.price) * value.quantity
    list.innerHTML += `<li>${value.name}<span>$${value.price * value.quantity}</span></li>`;
    
})
total.innerHTML += `<span>$${temp}</span>`

btnOrder.onclick = (e) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart'));
    if(name.value == '' || address.value == '' || phone.value == '' || email.value == '') {
        alert('Mời nhập đầy đủ thông tin!')
    } else {
        let data = {
            customer_name: name.value,
            customer_address: address.value,
            customer_email: phone.value,
            customer_phone_number: email.value,
            customer_status: 'Chưa thanh toán'
        }
        const documentListRef = ref(db, 'Orders');
        const newRecordRef = push(documentListRef);
        set(newRecordRef, data);
        let id = newRecordRef._path.pieces_[1];
        console.log(cart);
        console.log(id)
        cart.forEach(value => {
            console.log(value)
            let cartDetail = {
                order_id: id,
                name: value.name,
                image: value.image,
                price: value.price,
                quantity: value.quantity
            }
            const documentListRef = ref(db, 'order_details');
            const newRecordRef = push(documentListRef);
            set(newRecordRef, cartDetail);
        })
        alert('Đặt hàng thành công')
        list.innerHTML = `<li></li>`;
        total.innerHTML = `<span></span>`
        name.value = ''
        address.value = ''
        phone.value = ''
        email.value = ''
        name.focus()
    }

}
