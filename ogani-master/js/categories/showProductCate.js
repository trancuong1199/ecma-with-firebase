import { getDatabase, ref, get, child, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const getId = params.id

const dbRef = ref(getDatabase());
let data;
const showlistProducts = document.querySelector('#showProducts');
const renderOrder = () => {
    get(child(dbRef, `Products`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            showProducts(data)
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}   

renderOrder()


function showProducts(data) {
    let output = []
    for (let prd in data) {
        if(getId == data[prd].cate_id)
        output += `
            <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="product__item">
                    <div class="product__item__pic set-bg">
                        <img src="${data[prd].image}" />
                        <ul class="product__item__pic__hover">
                            <li><a href="#"><i class="fa fa-heart"></i></a></li>
                            <li><a href="shop-details.html?id=${prd}"><i class="fa fa-retweet"></i></a></li>
                            <li><a class="addToCart" id=${prd}><i class="fa fa-shopping-cart"></i></a></li>
                        </ul>
                    </div>
                    <div class="product__item__text">
                        <h6><a href="#">${data[prd].name}</a></h6>
                        <h5>$${data[prd].price}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    showlistProducts.innerHTML = output;
}
