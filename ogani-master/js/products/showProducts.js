import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const dbRef = ref(getDatabase());
const db = getDatabase();
const featuredFilter = document.querySelector('.featured__filter');
let data;

get(child(dbRef, `Products`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            for(let value in data) {
                featuredFilter.innerHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6 mix oranges fresh-meat">
                        <div class="featured__item">
                            <div class="featured__item__pic set-bg">
                                <img src="${data[value].image}" />
                                <ul class="featured__item__pic__hover">
                                    <li><a href="#"><i class="fa fa-heart"></i></a></li>
                                    <li><a href="shop-details.html?id=${value}"><i class="fa fa-retweet"></i></a></li>
                                    <li class="addToCart" id=${value}><a><i class="fa fa-shopping-cart "></i></a></li>
                                </ul>
                            </div>
                            <div class="featured__item__text">
                                <h6><a href="#">${data[value].name}</a></h6>
                                <h5>$${data[value].price}</h5>
                            </div>
                        </div>
                    </div>
                    `
                }

            const addToCart = document.querySelectorAll('.addToCart');
            
            addToCart.forEach((btn) => {
                btn.onclick = function(){
                    const product = data[this.getAttribute('id')]
                    let cart = JSON.parse(localStorage.getItem('cart'))
                    if(cart) {
                        let check = cart.find((item) => item.id === this.getAttribute('id'))
                        if(check) {
                            check.quantity += 1
                        } else {
                            cart.push({ 
                                id: this.getAttribute('id'),
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                quantity: 1
                            })
                        }
                    } else {
                        cart = []
                        cart.push({
                            id: this.getAttribute('id'),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        })
                    }
                    localStorage.setItem('cart', JSON.stringify(cart))

                    alert('Thêm thành công')
                }
            })

            

            
           

        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
