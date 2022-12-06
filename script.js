let carAPI = "https://api.tuz.vn/car/";
let carData = "";

function $(query) {
  return document.querySelector(query);
}

let carList = [];
let carFromAPI = [];
let getDataCart = localStorage.getItem("cart");
if (getDataCart) {
  carList = JSON.parse(localStorage.getItem("cart"));
}

fetch(carAPI)
  .then((rs) => rs.json())
  .then((rs) => {
    rs["data"].map((car, index) => {
      car["addToCart"] = 1;
      carFromAPI.push(car);
      document.getElementsByClassName("box-car-list")[0].innerHTML += `
          <div class="car-list col-12 col-md-6 col-lg-4 text-center px-2">
            <div class="car-info shadow-sm rounded p-2">
            <div class="car-title mb-2 fw-semibold" data-bs-toggle="modal"
        data-bs-target="#car-popup" onclick="showCar(${index})">${car.name}</div>
            <div class="car-img mb-2" data-bs-toggle="modal"
        data-bs-target="#car-popup" onclick="showCar(${index})"><img class="rounded-1 border border-light" src="${car.img}" alt="${car.name}"></div>
            <div class="car-price fw-semibold position-relative">
              <i class="bi bi-cart4 position-absolute cart" onclick="addCart(${index})"></i>
              <div class="position-absolute plus">+1</div>
              ${car.price}<sup>đ</sup>

            </div>
            </div>
          </div>
          `;
      document.getElementsByClassName("box-car-side")[0].innerHTML += `
            <div class="card-body d-flex flex-wrap">
              <div class="car-side-left col-4" data-bs-toggle="modal"
              data-bs-target="#car-popup" onclick="showCar(${index})">
                <img class="rounded-1" src="${car.img}" alt="" />
              </div>
              <div class="car-side-right col-8 ps-3">
                <div class="car-side-name fw-semibold" data-bs-toggle="modal"
                data-bs-target="#car-popup" onclick="showCar(${index})">${car.name}</div>
                <div class="car-side-mau">Màu: <span>${car.color}</span></div>
                <div class="car-side-gia">Giá: <span>${car.price}</span></div>
              </div>
            </div>
            `;
    });
    $(".box-car-all span").textContent = rs["data"].length;
  });

function showCar(id) {
  fetch(carAPI)
    .then((rs) => rs.json())
    .then((rs) => {
      let getData = rs.data[id];
      document.getElementsByClassName("car-name")[0].textContent = getData.name;
      $(".car-popup img").src = getData.img;
      $(".car-popup .gia span").textContent = getData.price;
      $(".car-popup .odo span").textContent = getData.odo;
      $(".car-popup .nam-sx span").textContent = getData.year;
      $(".car-popup .bks span").textContent = getData.bks;
      $(".car-popup .dang-ky span").textContent = getData.reg;
      $(".car-popup .mau span").textContent = getData.color;
      $(".car-popup .nhien-lieu span").textContent = getData.fuel;
    });
}

function addCart(id) {
  let io = 0;
  if (carList.length != 0) {
    carList.forEach((thisCarList) => {
      if (thisCarList["img"].includes(carFromAPI[id].img)) {
        thisCarList.addToCart++;
        io++;
      }
    });
    if (io == 0) {
      carList.push(carFromAPI[id]);
    }
  } else {
    carList.push(carFromAPI[id]);
  }

  localStorage.setItem("cart", JSON.stringify(carList));

  showFaded();
  setTimeout(() => {
    document
      .getElementsByClassName("box-faded")[0]
      .classList.toggle("box-hide");
  }, 1500);

  document.getElementsByClassName("cart")[id].classList.toggle("add");
  setTimeout(() => {
    document.getElementsByClassName("cart")[id].classList.toggle("add");
  }, 800);
}

function showFaded() {
  let cartCount = 0;
  let boxFaded = document.getElementsByClassName("box-faded")[0];
  if (carList != 0) {
    boxFaded.innerHTML = "";
    carList.map((car, index) => {
      boxFaded.innerHTML += `
              <div class="card-body d-flex flex-wrap text-start">
                <div class="car-side-left col-4">
                  <img class="rounded-1" src="${car.img}" alt="${car.name}" />
                </div>
                <div class="car-side-right col-8 ps-3">
                  <div class="car-side-name fw-semibold">${car.name}</div>
                  <div class="car-side-gia">Giá: <span>${car.price}</span></div>
                  <div class="input-group input-group-sm mt-2 position-relative">
                    <span class="input-group-text" id="car-side-sl">Số lượng</span>
                    <input type="number" class="form-control car-sl" aria-label="Số lượng" aria-describedby="car-side-sl" value="${car.addToCart}" disabled>
                    <i class="bi bi-cart4 position-absolute del" onclick="delCart(${index})"></i>
                    </div>
                </div>
              </div>
            `;
      cartCount += car.addToCart;
    });
  } else {
    boxFaded.innerHTML =
      '<div class="card-body d-flex flex-wrap">Chưa có xe nào trong danh sách đặt';
  }
  document.getElementsByClassName("box-faded")[0].classList.toggle("box-hide");
  document.getElementsByClassName("badge")[0].textContent = `+${cartCount}`;
}

function delCart(id) {
  let confirmAction = confirm(
    `Bạn có chắc chắn muốn xóa ${carList[id].name} ra khỏi danh sách?`
  );
  if (confirmAction) {
    carList.splice(id, 1);
    localStorage.setItem("cart", JSON.stringify(carList));
    setTimeout(function () {
      window.location.reload(1);
    }, 500);
  } else {
  }
}
