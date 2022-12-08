import { getDatabase, ref, get, child, remove, update } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const dbRef = ref(getDatabase());
const db = getDatabase();
let data;
let dataDetail;
const listOrder = document.querySelector('#listOrder');
const status = [
    'Đã thanh toán', 'Chưa thanh toán'
]
listOrder.innerHTML = "<h3 style='margin: 20px;'>Đang tải dữ liệu...</h3>"
const renderOrder = () => {
    get(child(dbRef, `Orders`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            showOrder(data)
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });

    get(child(dbRef, `order_details`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            dataDetail = snapshot.val()
            
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}   

renderOrder()


function showOrder(data) {
    let output = []
    for (let prd in data) {
        let select = '<select class="form-select status" aria-label="Default select example" style="width: 160px;">';
        status.forEach((item)=>{
            select += `<option value="${item}" ${data[prd].customer_status === item ? 'selected':''}>${item}</option>`;
        })
        select += `</select>`;
        output += `
            <tr>
                <td>${data[prd].customer_name}</td>
                <td>${data[prd].customer_address}</td>
                <td>${data[prd].customer_email}</td>
                <td>${data[prd].customer_phone_number}</td>
                <td>
                    ${select}              
                    <button type="button" id="${prd}" class="btn btn-success updateStatus" style="margin-top: 10px;">Cập nhật</button>
                </td>
                <td>
                    <a href="orderDetail.html?id=${prd}">
                        <button type="button" class="btn btn-primary">Chi tiết</button>
                    </a>
                    <button type="button" class="btn btn-danger deleted" value="${prd}">Xóa</button>
                </td>
            </tr>
        `;
    }
    listOrder.innerHTML = output;
    const btnDeleteds = document.querySelectorAll('.deleted');
    const updateStatus = document.querySelectorAll('.updateStatus');
    
    updateStatus.forEach((btn) => {
        btn.onclick = function(){
            let order_id = this.getAttribute('id');
            let status = this.previousElementSibling.value;
            console.log(status);
            const postListRef = ref(db, 'Orders/' + order_id);

            update(postListRef, {
                customer_status: status
            })
            alert('Cập nhật thành công')
            renderOrder()
        }
    })

    btnDeleteds.forEach(btnDeleted => {
        btnDeleted.onclick = () => {
            for (let item in dataDetail) {
                if(dataDetail[item].order_id == btnDeleted.value) {
                    remove(ref(db, 'order_details/'+ item))
                        .then(() => {
                            console.log('ok');
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                    }
                }
            remove(ref(db, 'Orders/'+ btnDeleted.value))
                .then(() => {
                    alert('Xóa thành công')
                })
                .catch((error) => {
                    console.error(error);
                });
            
            renderOrder()
            
        }
    })
}
