let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api";
let key = "740a2b97-6ea6-453d-9f60-425597307217";
let countOfPages;
let globalListApplications;
let globalListRoutes;
let globalListGuides;
let saveIdRoute;
let selectApplication;

// Показ уведомлений в личном кабинете
function showAlert(error, color) {
    let alerts = document.querySelector(".alerts-person");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.append(error);
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
}

// Загрузка количество страниц и выбранной страницы (на вход: количество страниц)
function loadNumberPages(numberPage, maxPages) {
    //console.log(numberPage + " " + maxPages);
    let page0 = document.querySelector("[data-page=\"0-applications\"]");
    let page1 = document.querySelector("[data-page=\"1-applications\"]");
    let page2 = document.querySelector("[data-page=\"2-applications\"]");
    let page3 = document.querySelector("[data-page=\"3-applications\"]");
    let page4 = document.querySelector("[data-page=\"4-applications\"]");
    let page5 = document.querySelector("[data-page=\"5-applications\"]");
    let page6 = document.querySelector("[data-page=\"6-applications\"]");

    page1.innerHTML = Number(numberPage) - 2;
    page2.innerHTML = Number(numberPage) - 1;
    page3.innerHTML = Number(numberPage);
    page4.innerHTML = Number(numberPage) + 1;
    page5.innerHTML = Number(numberPage) + 2;

    page0.classList.remove("d-none");
    page1.classList.remove("d-none");
    page2.classList.remove("d-none");
    page3.classList.remove("d-none");
    page4.classList.remove("d-none");
    page5.classList.remove("d-none");
    page6.classList.remove("d-none");
    page3.classList.add("active");

    if (numberPage == 1) {
        page0.classList.add("d-none");
        page1.classList.add("d-none");
        page2.classList.add("d-none");
    } else if (numberPage == 2) {
        page1.classList.add("d-none");
    } else if (numberPage == maxPages - 1) {
        page5.classList.add("d-none");
    } else if (numberPage == maxPages) {
        page4.classList.add("d-none");
        page5.classList.add("d-none");
        page6.classList.add("d-none");
    }

    if (maxPages == 1) {
        page4.classList.add("d-none");
        page5.classList.add("d-none");
        page6.classList.add("d-none");
    } else if (maxPages == 2) {
        page5.classList.add("d-none");
        if (numberPage == 2) {
            page4.classList.add("d-none");
            page6.classList.add("d-none");
        }
    }
}

// Загрузка маршрутов с сервера (на выход: JSON с маршрутами)
async function downloadFromServerRoutes() {
    let thisUrl = new URL(url + "/routes");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let routes = await response.json();
        globalListRoutes = routes;
        return routes;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Загрузка гидов с сервера (на вход: id маршрута)
async function downloadFromServerGuides(idRoute) {
    let thisUrl = new URL(url + "/routes/" + idRoute + "/guides");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let guides = await response.json();
        saveIdRoute = idRoute;
        globalListGuides = guides;
        return guides;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Поиск названия маршрута по id
async function filterRoutesName(idRoute) {
    let routes;
    if (globalListRoutes == null)
        routes = await downloadFromServerRoutes();
    else
        routes = globalListRoutes;
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].id == idRoute)
            return routes[i].name;
    }
}

// Поиск имени гида по id
async function filterGuidesName(idGuide, idRoute) {
    let guides;
    if (globalListGuides == null || saveIdRoute != idRoute)
        guides = await downloadFromServerGuides(idRoute);
    else
        guides = globalListGuides;
    for (let i = 0; i < guides.length; i++) {
        if (guides[i].id == idGuide)
            return guides[i].name;
    }
}

// Поиск необходимой заявки по id
function applicationSearch(idApplications) {
    for (let i = 0; i < globalListApplications.length; i++) {
        if (globalListApplications[i].id == idApplications) return globalListApplications[i];
    }
}

// Заполнение модального окна 
async function fillingModalWindow(application) {
    //console.log(application);
    let routeName = await filterRoutesName(application.route_id);
    let guideName = await filterGuidesName(application.guide_id, application.route_id);
    document.querySelector(".modal-make-name-route").innerHTML = "Название маршрута:  " + routeName;
    document.querySelector(".modal-make-FIO").innerHTML = "ФИО гида:  " + guideName;
    document.querySelector(".modal-price").innerHTML = "Итоговая стоимость:  " + application.price + " рублей.";
    document.querySelector(".modal-number-people").value = application.persons;
    document.querySelector(".modal-data").value = application.date;
    document.querySelector(".modal-time").value = application.time;
    document.querySelector(".modal-select-time").value = application.duration;
    document.querySelector(".modal-first-additional-option").checked = application.optionFirst;
    document.querySelector(".modal-second-additional-option").checked = application.optionSecond;

}

// Нажатие на иконки инструментов
async function clickBtnHandler(event) {
    if (event.target.dataset.action) {
        let modalWindow = bootstrap.Modal.getOrCreateInstance(makeAnApplication);
        modalWindow.hide();
        let action = event.target.getAttribute('data-action');
        let idApplications = event.target.parentNode.parentNode.getAttribute('data-id');
        let application = await applicationSearch(idApplications);
        selectApplication = application;
        fillingModalWindow(application);
        document.querySelector(".modal-number-people").removeAttribute("readonly");
        document.querySelector(".modal-data").removeAttribute("readonly");
        document.querySelector(".modal-time").removeAttribute("readonly");
        document.querySelector(".modal-select-time").removeAttribute("disabled");
        document.querySelector(".modal-first-additional-option").removeAttribute("disabled");
        document.querySelector(".modal-second-additional-option").removeAttribute("disabled");
        document.querySelector(".modal-btn-save").classList.remove("d-none");
        if (action == "show") {
            document.querySelector(".modalLabel").innerHTML = "Просмотр заявки";
            document.querySelector(".modal-number-people").setAttribute("readonly", true);
            document.querySelector(".modal-data").setAttribute("readonly", true);
            document.querySelector(".modal-time").setAttribute("readonly", true);
            document.querySelector(".modal-select-time").setAttribute("disabled", true);
            document.querySelector(".modal-first-additional-option").setAttribute("disabled", true);
            document.querySelector(".modal-second-additional-option").setAttribute("disabled", true);
            document.querySelector(".modal-btn-save").classList.add("d-none");
        } else if (action == "edit") {
            document.querySelector(".modalLabel").innerHTML = "Изменение заявки";

        } else if (action == "delete") {
            let routeName = await filterRoutesName(application.route_id);
            document.querySelector(".modal-body-delete").innerHTML = "Вы уверены что хотите удалить заявку на \""
                + routeName + "\" " + reformDate(application.date) + " - числа";
        }
    }
}

// Изменение формата даты для чтения
function reformDate(date) {
    let reformDate = date.split('-');
    let newFormDate = reformDate[2] + "." + reformDate[1] + "." + reformDate[0];
    return newFormDate;
}

// Добавление заявок на страницу
async function addNewElemApplications(number, infoElem) {
    let nameApplications = await filterRoutesName(infoElem.route_id);
    let exapleApplications = document.querySelector(".exaple-applications").cloneNode(true);
    exapleApplications.innerHTML = "";
    exapleApplications.setAttribute("data-id", infoElem.id);
    exapleApplications.classList = "applications";
    exapleApplications.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleApplications.innerHTML += "<td>" + nameApplications + "</td>";
    exapleApplications.innerHTML += "<td>" + reformDate(infoElem.date) + "</td>";
    exapleApplications.innerHTML += "<td>" + infoElem.price + " рублей" + "</td>";
    let check_input = "<td>"
        + "<i class=\"fa fa-eye fa-1x mx-2\" data-bs-toggle=\"modal\" data-bs-target=\"#makeAnApplication\" data-action=\"show\"></i>"
        + "<i class=\"fa fa-pencil fa-1x mx-2\" data-bs-toggle=\"modal\" data-bs-target=\"#makeAnApplication\" data-action=\"edit\"></i>"
        + "<i class=\"fa fa-trash fa-1x mx-2\" data-bs-toggle=\"modal\" data-bs-target=\"#deleteModal\" data-action=\"delete\"></i>"
        + "</td>";
    exapleApplications.innerHTML += check_input;
    let listApplications = document.querySelector(".list-applications");
    listApplications.append(exapleApplications);
    exapleApplications.onclick = clickBtnHandler;
}

// Загрузка заявок с сервера
async function downloadFromServerApplications() {
    let thisUrl = new URL(url + "/orders");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let applications = await response.json();
        globalListApplications = applications;
        return applications;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}


// Загрузка заявок
async function loadApplicationsStart(numberPage) {
    let applications = await downloadFromServerApplications();
    if (applications.length % 5 == 0) countOfPages = applications.length / 5;
    else countOfPages = Math.floor(applications.length / 5) + 1;
    loadApplications(numberPage, applications);
}

function loadApplications(numberPage, applications) {
    let allApplications = document.querySelectorAll(".applications");
    for (let i = 0; i < allApplications.length; i++) {
        let elem = allApplications[i];
        elem.parentNode.removeChild(elem);
    }
    loadNumberPages(numberPage, countOfPages);
    for (let i = (numberPage * 5) - 5; i < numberPage * 5; i++) {
        addNewElemApplications(i + 1, applications[i]);
    }
    //addNewElemApplications(1, applications[1])
}

// выбор страницы
function clickPageBtn(event) {
    if (event.target.dataset.page) {
        if (event.target.dataset.page == "0-applications") {
            loadApplications(1, globalListApplications);
        } else if (event.target.dataset.page == "6-applications") {
            loadApplications(countOfPages, globalListApplications);
        } else {
            loadApplications(Number(event.target.innerHTML), globalListApplications);
        }
    }
}

//Поиск в json по id
function searchById(jsonArray, idElem) {
    for (let i = 0; i < jsonArray.length; i++)
        if (jsonArray[i].id == idElem) return jsonArray[i];
}

// Расчет итоговой стоимовти
function costCalculation(event) {
    price = 1;
    let guideServiceCost = searchById(globalListGuides, selectApplication.guide_id).pricePerHour;
    let hoursNumber = Number(document.querySelector('.modal-select-time').options[document.querySelector('.modal-select-time').selectedIndex].value);
    price = price * guideServiceCost * hoursNumber;
    let isThisDayOff;
    if (document.querySelector('.modal-data').valueAsDate) {
        let month = document.querySelector('.modal-data').valueAsDate.getUTCMonth() + 1;
        let day = document.querySelector('.modal-data').valueAsDate.getUTCDate();
        let nDay = document.querySelector('.modal-data').valueAsDate.getUTCDay();
        if (nDay == 6 || nDay == 0) isThisDayOff = 1.5;
        else if (((month == 1) && (day >= 1 && day <= 9)) || ((month == 3) && (day >= 6 && day <= 8)) || ((month == 4) && (day >= 30) || (month == 5) && (day <= 3)) ||
            ((month == 5) && (day >= 7 && day <= 10)) || ((month == 6) && (day >= 11 && day <= 13)) || ((month == 11) && (day >= 4 && day <= 6))) {
            isThisDayOff = 1.5;
        } else isThisDayOff = 1;
        price = price * isThisDayOff;
    }
    let isItMorning, isItEvening;
    if (document.querySelector('.modal-time').value) {
        let hoursTime = Number(document.querySelector('.modal-time').value.split(":")[0]);
        if (hoursTime >= 9 && hoursTime <= 12) {
            isItMorning = 400;
            isItEvening = 0;
        }
        else if (hoursTime >= 20 && hoursTime <= 23) {
            isItEvening = 1000;
            isItMorning = 0;
        }
        else {
            isItMorning = 0;
            isItEvening = 0;
        }
        price = price + isItMorning + isItEvening;
    }
    let numberOfVisitors;
    if (document.querySelector('.modal-number-people').value) {
        let numberPeople = Number(document.querySelector('.modal-number-people').value);
        if (numberPeople >= 1 && numberPeople <= 5) numberOfVisitors = 0;
        else if (numberPeople > 5 && numberPeople <= 10) numberOfVisitors = 1000;
        else if (numberPeople > 10 && numberPeople <= 20) numberOfVisitors = 1500;
        price = price + numberOfVisitors;
    }

    // 1ая из опций
    if (document.querySelector('.modal-first-additional-option').checked) {
        price = price * 0.75;
    }

    // 2ая из опций
    if (document.querySelector('.modal-second-additional-option').checked) {
        if (isThisDayOff == 1.5)
            price = price * 1.25;
        else
            price = price * 1.3;
    }

    // price = Math.round(price * 100) / 100;
    price = Math.round(price);

    document.querySelector('.modal-price').innerHTML = "Итоговая стоимость: " + price + " рублей.";
}

// изменение формата даты на YYYY-MM-DD
function editDate(oldDate) {
    let newDate = "";
    newDate += oldDate.getUTCFullYear() + "-";
    newDate += oldDate.getUTCMonth() + 1 + "-";
    newDate += oldDate.getUTCDate();
    return newDate;
}

// Сохранение изменений заявки
async function savingApplication(event) {
    if (!(document.querySelector('.modal-data').valueAsDate && document.querySelector('.modal-time').value && document.querySelector('.modal-number-people').value)) {
        alert("Заполните все необходимые поля");
        return;
    }
    let formData = new FormData();
    formData.append('date', editDate(document.querySelector('.modal-data').valueAsDate));
    let minuts = document.querySelector('.modal-time').value.split(':')[1];
    if (minuts != "00" && minuts != "30") {
        alert("Время начала экскурсии в 0 или 30 минут");
        return;
    }
    formData.append('time', document.querySelector('.modal-time').value);
    formData.append('duration', document.querySelector('.modal-select-time').value);
    formData.append('persons', document.querySelector('.modal-number-people').value);
    formData.append('price', price);
    formData.append('optionFirst', Number(document.querySelector('.modal-first-additional-option').checked));
    formData.append('optionSecond', Number(document.querySelector('.modal-second-additional-option').checked));
    let thisUrl = new URL(url + "/orders/" + selectApplication.id);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "PUT", body: formData });
        if (response.status == 200) {
            await response.json();
            bootstrap.Modal.getOrCreateInstance(makeAnApplication).hide();
            showAlert("Заявка успешно изменена.", "alert-primary");
            loadApplicationsStart(1);
        } else {
            let data = await response.json();
            alert(data.error);
        }
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
}

// Удаление заявки 
async function deleteApplication(event) {
    let thisUrl = new URL(url + "/orders/" + selectApplication.id);
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "DELETE" });
        await response.json();
        bootstrap.Modal.getOrCreateInstance(deleteModal).hide();
        showAlert("Заявка успешно удалена.", "alert-primary");
        loadApplicationsStart(1);

    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
}

window.onload = function () {
    document.querySelector('.pagination').onclick = clickPageBtn; // Нажатие на выбор старницы
    loadApplicationsStart(1); // Загрузка 1ой страницы заявок

    // Внетренее изменение формы заявки для подсчета стоимости 
    document.querySelector('.modal-data').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-time').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-select-time').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-number-people').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-first-additional-option').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-second-additional-option').addEventListener('change', function () {
        costCalculation();
    });
    document.querySelector('.modal-btn-save').onclick = savingApplication; // Сохранение изменений заявки
    document.querySelector('.btn-delete-modal').onclick = deleteApplication;
};