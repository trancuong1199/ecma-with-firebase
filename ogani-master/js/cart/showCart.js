const cart = JSON.parse(localStorage.getItem('cart'));
const showProduct = document.querySelector('#cart');

cart.map((value) => {
    showProduct.innerHTML += `
        <tr>
            <td class="shoping__cart__item">
                <img src="${value.image}" alt="" width="100px">
                <h5>${value.name}</h5>
            </td>
            <td class="shoping__cart__price">
                $${value.price}
            </td>
            <td class="shoping__cart__quantity">
                <div class="quantity">
                    <div class="pro-qty">
                        <input type="number" min="1" value="${value.quantity}" id="${value.id}">
                    </div>
                </div>
            </td>
            <td class="shoping__cart__total" id="total-${value.id}">
                $${value.price * value.quantity}
            </td>
            <td class="shoping__cart__item__close" data-id="${value.id}">
                <span class="icon_close"></span>
            </td>
        </tr>
    `

    
})
function renderTotal() {
    let temp = 0
    let cart = JSON.parse(localStorage.getItem('cart'));
    console.log(cart);
    cart.map((value) => {   
        temp += Number(value.price) * value.quantity
    })
    
    document.getElementById('sumTotal').innerText = '$' + temp
}
renderTotal()

$(document).on("click","input[type=number]",function(){
    let cart = JSON.parse(localStorage.getItem('cart'));
    let product_id = this.getAttribute("id");
    const check = cart.find((item) => item.id === product_id)
    check.quantity = Number(this.value)
    const total = check.price * check.quantity

    document.getElementById(`total-${check.id}`).innerText = '$' + total
    localStorage.setItem("cart", JSON.stringify(cart));
    renderTotal()
    
})

$(document).on("click",".shoping__cart__item__close",function(){
    let cart = JSON.parse(localStorage.getItem('cart'));
    const getId = this.getAttribute('data-id')
    let item = cart.filter((value) => {
        if(value.id === getId){
            return false;
        }else{
            return true;
        }
    })
    if(confirm('Đồng ý xóa sản phẩm khỏi giỏ hàng không?')) {
        this.parentElement.remove()
        localStorage.setItem("cart", JSON.stringify(item));
    } 
    
    renderTotal()

})
