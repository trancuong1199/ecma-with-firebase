import { getDatabase, ref, get, child, remove, orderByKey, limitToFirst, startAt, query } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { deleteObject, getStorage, ref as sRef  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const dbRef = ref(getDatabase());
const db = getDatabase();
const storage = getStorage();
const items_page = 3;
let pagination_output = "";
let data;
const listProducts = document.querySelector('#listProducts');
listProducts.innerHTML = "<h3 style='margin: 20px;'>Đang tải dữ liệu...</h3>"

get(child(dbRef, `Products`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            let items = Object.keys(data);
            let pages = Math.ceil(items.length / items_page);
            const pagination = document.querySelector('.pagination');
            for (let i = 1; i <= pages; i++) {
                pagination_output += `<li class="page-item ${
                    i === 1 ? "active" : ""
                }" data-key="${
                    items[i * items_page - items_page]
                }"><a class="page-link" href="javascript:void(0)">${i}</a></li>`;
            }
            pagination.innerHTML = pagination_output

        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });


    $(document).on("click", "li.page-item", function () {
        $("li.page-item").removeClass("active");
        $(this).addClass("active");
        let key = $(this).data("key");
        let documentRef = query(
            ref(db, 'Products'),
            orderByKey(),
            limitToFirst(items_page),
            startAt(key)
          );
    
        get(documentRef).then((snapshot) => {
            showProducts(snapshot.val())
    
        });
    });
    

let documentRef = query(
    ref(db, 'Products'),
    orderByKey(),
    limitToFirst(items_page),
  );

get(documentRef).then((snapshot) => {
    showProducts(snapshot.val())
});


function showProducts(data) {
    let output = ""
    for (let prd in data) {
        get(child(dbRef, `Categories/${data[prd].cate_id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let dataCate = snapshot.val()
                        output += `
                            <tr>
                                <td>${data[prd].name}</td>
                                <td>${dataCate.name}</td>
                                <td>
                                    <img width="150px" src="${data[prd].image}" > 
                                </td> 
                                <td>$${data[prd].price}</td>
                                <td width="280px">${data[prd].detail}</td>
                                <td>
                                    <a href="editProduct.html?id=${prd}">
                                        <button type="button" class="btn btn-secondary" id="edit" value=${prd}>Sửa</button> 
                                    </a>
                                    <button type="button" class="btn btn-danger" id="deleted"  value=${prd}>Xóa</button>
                                </td>
                            </tr>
                        `
                }
                listProducts.innerHTML = output;


                // DELETED
                const btnDeleteds = document.querySelectorAll('#deleted');
                const desertRef = sRef(storage, `images/${data[prd].imageName}`);

                btnDeleteds.forEach(btnDeleted => {
                    btnDeleted.onclick = function() {
                        if(confirm('Bạn muốn xóa sản phẩm này?')) {

                            remove(ref(db, 'Products/'+ btnDeleted.value))
                                .then(() => {
                                    deleteObject(desertRef).then(() => {
                                        console.log('sucessfully');
                                        this.parentElement.parentElement.remove()
                                    }).catch((error) => {
                                        console.log('error');
                                    });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }

                    }
                })
            })
    }
    
}




