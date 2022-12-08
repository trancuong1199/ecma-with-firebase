import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getStorage, ref as SRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const dbRef = ref(getDatabase());
const db = getDatabase();
const name = document.querySelector('#name');
const cate = document.querySelector('#cate');
const price = document.querySelector('#price');
const detail = document.querySelector('#detail');
const image = document.querySelector('#image');
const btn = document.querySelector('#btnAdd');
let files = [];
const reader = new FileReader();

const renderCate = () => {
    get(child(dbRef, `Categories`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            for (let cat in data) {
                cate.innerHTML += `
                    <option value="${cat}">${data[cat].name}</option>
                `
            }
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}
renderCate();



btn.onclick = (e) => {
    e.preventDefault();
    const postListRef = ref(db, 'Products');
    const newPostRef = push(postListRef);
    

    if(image.files[0] === undefined) {
        alert('Hãy nhập đầy đủ thông tin')
    } else {
        fireBaseUploadFile("images/" + image.files[0].name, image.files[0], function(url){
            if(cate.value == '' || detail.value == '' || name.value == '' || price.value == '') {
                alert('Hãy nhập đầy đủ thông tin')
            } else {
                set(newPostRef, {
                    cate_id: cate.value,
                    detail: detail.value,
                    image: url,
                    name: name.value,
                    price: price.value,
                    imageName: image.files[0].name
                })
                
                alert('Thêm thành công')
                name.value = ""
                detail.value == ''
                price.value == ''
                name.focus()
            }
        })
    }

}

image.onchange = (e) => {
    files = e.target.files;
    reader.readAsDataURL(files[0])
}

reader.onload = () => {
    document.querySelector('#mying').src = reader.result;
}




function fireBaseUploadFile(path, file, callback) {
    const storageRef = SRef(getStorage(), path);
    uploadBytes(storageRef, file)
        .then((snapshot) => {
            getDownloadURL(storageRef)
        .then((url) => {
            callback(url);
        });
        });
}