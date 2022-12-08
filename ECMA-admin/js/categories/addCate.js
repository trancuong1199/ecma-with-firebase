import { getDatabase, ref, push, set, get, child, remove, update } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
const btn = document.querySelector('#btn');
const inputName = document.querySelector('#nameCate');
const listCate = document.querySelector('#listCate');
const db = getDatabase();
let data;

listCate.innerHTML = "<h3 style='margin: 20px;'>Đang tải dữ liệu...</h3>"

btn.onclick = (e) => {
    e.preventDefault();
    const postListRef = ref(db, 'Categories');
    const newPostRef = push(postListRef);

    set(newPostRef, {
        name: inputName.value,
    })
    alert('Thêm thành công')
    renderCate()
    inputName.value = ""
    inputName.focus()
}

const dbRef = ref(getDatabase());

const renderCate = () => {
    get(child(dbRef, `Categories`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val()
            categories(data)
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}   
renderCate()

function categories(data) {
    let output = ""
    let dataName = [];
    for (let cat in data) {
        dataName.push(data[cat].name);
        output += `
            <tr>
                <td id="${cat}">${data[cat].name}</td>
                <td>
                    <button type="button" class="btn btn-secondary" id="edit" value=${cat}>Sửa</button>
                    <button type="button" class="btn btn-danger" id="deleted" value=${cat}>Xóa</button>
                </td>
            </tr>
        `
    }
    
    listCate.innerHTML = output

    // DELETED
    const btnDeleteds = document.querySelectorAll('#deleted')
    
    btnDeleteds.forEach(btnDeleted => {
        btnDeleted.onclick = () => {
            remove(ref(db, 'Categories/'+ btnDeleted.value))
                .then(() => {
                    alert('Xóa thành công')
                    renderCate()
                    inputName.focus()
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    })

    // EDIT
   const editbtns = document.querySelectorAll("#edit");
   const updates = {};

   editbtns.forEach(function(editbtn, index){
       editbtn.onclick = function(){
            const td = document.getElementById(editbtn.value);

            td.innerHTML = `
                <input type="text" value="${td.innerText}" id="newNameCate-${index}"/>
                <button type="button" class="btn btn-secondary" value="${index}" id="saveBtn-${index}">Lưu</button>
                <button type="button" class="btn btn-danger" id="cancleBtn-${index}">Hủy</button>
            `;

            const saveBtn = document.querySelector(`#saveBtn-${index}`);
            const newNameCate = document.querySelector(`#newNameCate-${index}`);
            const cancleBtn = document.querySelector(`#cancleBtn-${index}`);

            saveBtn.onclick = () => {
                const postData = {name: newNameCate.value}
                updates['/Categories/' + editbtn.value] = postData;
                update(ref(db), updates)

                alert('Sửa thành công!')
                renderCate()
            }

            cancleBtn.onclick = () => {
                dataName.map((name, id) => {
                    if(id === index) {
                        td.innerHTML = `
                            <td>${name}</td>
                        `
                    }
                })
            }
        }
    })

}
