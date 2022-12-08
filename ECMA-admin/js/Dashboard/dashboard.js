import { getDatabase, ref, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const db = getDatabase();
const payDone = document.querySelector('.payDone');
const payNotDone = document.querySelector('.payNotDone');
const totalPayed = document.querySelector('.totalPayed');

const dataNotPay = query(
    ref(db, 'Orders'),
    orderByChild('customer_status'),
    equalTo('Chưa thanh toán')
);

const dataPay = query(
    ref(db, 'Orders'),
    orderByChild('customer_status'),
    equalTo('Đã thanh toán')
);

get(dataPay)
    .then(async (snapshot) => {
            let data = Object.keys(snapshot.val())
            let sum = 0;
            for(let i = 0; i < data.length; i++){
                const dataPay = query(
                    ref(db, 'order_details'),
                    orderByChild('order_id'),
                    equalTo(data[i])
                );
                
                const res = await get(dataPay);
                let dataOrder = res.val()
                Object.values(dataOrder).forEach(value => {
                    let prices  = value.price * value.quantity
                    sum += prices
                })
            }
            
            payDone.innerHTML +=  data ? data.length : 0
            totalPayed.innerHTML +=  '$' + sum

        }
    );




get(dataNotPay).then((snapshot) => {
    let data = snapshot.val()
    payNotDone.innerHTML += data ? Object.keys(data).length : 0
  }
);

