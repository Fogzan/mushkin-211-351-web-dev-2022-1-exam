let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api";
let key = "740a2b97-6ea6-453d-9f60-425597307217";
let countOfPages; //
let globalListRoutes; // Весь список маршрутов
let globalListGuides; // Весь список гидов по маршруту
let temporaryListRoutes; // "Отсортированные" маршруты
let selectRoute; // Выбранный маршрут id
let selectGuide; // Выбранный гид id
let globalListAttractions = []; // Весь список дост.
let experienceFrom, experienceUpTo; // Опыт работы
let price;

// Показ уведомлений, взят из Bootstrap5 
//(https://getbootstrap.com/docs/5.3/components/alerts/)
function showAlert(error, color) {
    let alerts = document.querySelector(".alerts");
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
    setTimeout(() => alert.remove(), 4000);
}

// Сортировка маршрутов 
// searchElement = name / mainObject
function sortJson(oldJson, searchElement, searchText) {
    const jsonLength = oldJson.length;
    let newJson = [];
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = oldJson[i];

        if (searchElement == "name") {
            let strName = jsonElement.name.toLowerCase();
            searchText = searchText.toLowerCase();
            if (strName.includes(searchText)) {
                newJson.push(jsonElement);
            }
        } else if (searchElement == "mainObject") {
            //let strMainObject = jsonElement.mainObject.toLowerCase();
            if (jsonElement.mainObject.includes(searchText)) {
                newJson.push(jsonElement);
            }
        } else if (searchElement == "language") {
            let strName = jsonElement.language.toLowerCase();
            searchText = searchText.toLowerCase().trim();
            if (strName.includes(searchText)) {
                newJson.push(jsonElement);
            }
        }
    }
    //if (searchElement == "name" || searchElement == "mainObject")
    temporaryListRoutes = newJson;
    return newJson;
}

// Загрузка маршрутов с сервера (на выход: JSON с маршрутами)
async function downloadFromServerRoutes() {
    let thisUrl = new URL(url + "/routes");
    thisUrl.searchParams.append("api_key", key);
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', thisUrl);
    // xhr.responseType = 'json';
    // xhr.send();
    // xhr.onload = function () {
    //console.log(this.response);
    // };

    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let routes = await response.json();
        //console.log(filter(routes));
        globalListRoutes = routes;
        return routes;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Загрузка количество страниц и выбранной страницы 
// (на вход: количество страниц)
function loadNumberPages(numberPage, maxPages) {
    //console.log(numberPage + " " + maxPages);
    let page0 = document.querySelector("[data-page=\"0-excursions\"]");
    let page1 = document.querySelector("[data-page=\"1-excursions\"]");
    let page2 = document.querySelector("[data-page=\"2-excursions\"]");
    let page3 = document.querySelector("[data-page=\"3-excursions\"]");
    let page4 = document.querySelector("[data-page=\"4-excursions\"]");
    let page5 = document.querySelector("[data-page=\"5-excursions\"]");
    let page6 = document.querySelector("[data-page=\"6-excursions\"]");

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

    if (numberPage == 0) {
        page0.classList.add("d-none");
        page1.classList.add("d-none");
        page2.classList.add("d-none");
        page3.classList.add("d-none");
        page4.classList.add("d-none");
        page5.classList.add("d-none");
        page6.classList.add("d-none");
        page3.classList.add("active");
    }
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

// Добавление элементов в HTML для loadRoutes 
// (На вход: номер записи и сама запись)
function addNewElemRoute(number, infoElem) {
    //console.log(infoElem);
    let excursionForClone = document.querySelector(".exaple-excursion");
    let exapleExcursion = excursionForClone.cloneNode(true);
    exapleExcursion.innerHTML = "";
    exapleExcursion.classList = "route";
    exapleExcursion.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleExcursion.innerHTML += "<td>" + infoElem.name + "</td>";

    if (infoElem.description.length <= 100) {
        exapleExcursion.innerHTML += "<td>" + infoElem.description + "</td>";
    } else {
        exapleExcursion.innerHTML += "<td>" 
            + infoElem.description.substring(0, 100)
            + "<br><button type=\"button\" class=\"btn btn-link p-0 m-0 " 
            + "description-more-detals\" value=\""
            + infoElem.description
            + "\">Подробнее</button>" + "</td>";
    }


    if (infoElem.mainObject.length <= 100) {
        exapleExcursion.innerHTML += "<td>" + infoElem.mainObject + "</td>";

    } else {
        exapleExcursion.innerHTML += "<td>" 
            + infoElem.mainObject.substring(0, 100)
            + "<br><button type=\"button\" class=\"btn btn-link "
            + "p-0 m-0 mainObject-more-detals\" value=\""
            + infoElem.mainObject
            + "\">Подробнее</button>" + "</td>";
    }


    let check_input = "<td><input class=\"form-check-input radio-route\" "
        + "type=\"radio\" name=\"radio-route\" value=\"" 
        + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    exapleExcursion.innerHTML += check_input;
    let listExcursion = document.querySelector(".list-excursion");
    listExcursion.append(exapleExcursion);
}

// Заполнение списка с Достопримечательностями в поиске по маршрутам
function addAttractionsToList(attractions) {
    let newListAttractions = [];
    let listAttractions = attractions.split("-");
    for (let i = 0; i < listAttractions.length; i++) {
        listAttractions[i] = listAttractions[i].trim();
        if (globalListAttractions.indexOf(listAttractions[i]) < 0)
            globalListAttractions.push(listAttractions[i]);
    }
}

// Заполнение списка с Достопримечательностями в поиске по маршрутам
function addAttractionsToHtml() {
    let attractionsListHtml = document.querySelector(".list-attractions");
    for (let i = 0; i < globalListAttractions.length; i++) {
        let attractionsForClone = document.querySelector(".exaple-attractions");
        let exampAttractions = attractionsForClone.cloneNode(true);
        exampAttractions.classList = "";
        exampAttractions.innerHTML = "";
        exampAttractions.innerHTML += globalListAttractions[i].substring(0, 60);
        exampAttractions.setAttribute("class", "elem-attractions");
        exampAttractions.setAttribute("value", globalListAttractions[i]);
        attractionsListHtml.append(exampAttractions);
    }
}

function loadBtnMoreAndLessDetals() {}

function descriptionLessDetals(event) {
    let fullDescription = event.target.parentNode.innerHTML.trim();
    let indexSim = fullDescription.indexOf("<");
    fullDescription = fullDescription.substring(0, indexSim);
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link "
        + "p-0 m-0 description-more-detals\" value=\"  "
        + fullDescription
        + "\"> Подробнее </button>";
    loadBtnMoreAndLessDetals();
}

function mainObjectLessDetals(event) {
    let fullMainObject = event.target.parentNode.innerHTML.trim();
    fullMainObject = fullMainObject.substring(0, fullMainObject.indexOf("<"));
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link "
        + "p-0 m-0 mainObject-more-detals\" value=\""
        + fullMainObject
        + "\"> Подробнее </button>";
    loadBtnMoreAndLessDetals();
}
//
function descriptionMoreDetals(event) {
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link "
        + "p-0 m-0 description-less-detals\" value=\""
        + event.target.value.substring(0, 100)
        + "\"> Скрыть </button>";
    loadBtnMoreAndLessDetals();
}

function mainObjectMoreDetals(event) {
    event.target.parentNode.innerHTML = event.target.value
        + "<br><button type=\"button\" class=\"btn btn-link "
        + "p-0 m-0 mainObject-less-detals\" value=\""
        + event.target.value.substring(0, 100)
        + "\"> Скрыть </button>";
    loadBtnMoreAndLessDetals();
}

// Подробнее кнопки
function loadBtnMoreAndLessDetals() {
    let allDescription = document.querySelectorAll('.description-more-detals');
    for (let i = 0; i < allDescription.length; i++) {
        allDescription[i].onclick = descriptionMoreDetals;
    }
    let allMainObject = document.querySelectorAll('.mainObject-more-detals');
    for (let i = 0; i < allMainObject.length; i++) {
        allMainObject[i].onclick = mainObjectMoreDetals;
    }
    let allDescripLess = document.querySelectorAll('.description-less-detals');
    for (let i = 0; i < allDescripLess.length; i++) {
        allDescripLess[i].onclick = descriptionLessDetals;
    }
    let allMainObjectLes = document.querySelectorAll('.mainObject-less-detals');
    for (let i = 0; i < allMainObjectLes.length; i++) {
        allMainObjectLes[i].onclick = mainObjectLessDetals;
    }
}

// Обработчик события Нажатие на выбор гида
function radioGuideChange(event) {
    let docElem = document.querySelector("[data-id='" + selectGuide + "']");
    if (selectGuide && docElem) {
        let tSelGui = document.querySelector("[data-id='" + selectGuide + "']");
        tSelGui.parentNode.parentNode.classList.remove("select-guide");
    }
    selectGuide = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-guide");
    let conBtn = document.querySelector('.container-btn-make-an-application');
    conBtn.classList.remove("d-none");
}

// Добавление гидов в таблицу Html
function addNewElemGuides(number, infoElem) {
    //console.log(infoElem);
    let exapleGuide = document.querySelector(".exaple-guide").cloneNode(true);
    exapleGuide.innerHTML = "";
    exapleGuide.classList = "guide";
    exapleGuide.innerHTML += "<td scope=\"row\">" + number + "</td>";
    exapleGuide.innerHTML += "<td class=\"profile\"><img "
        + "src=\"images\\profile.jpg\" alt=\"\" class=\"img-fluid\"></td>";
    exapleGuide.innerHTML += "<td>" + infoElem.name + "</td>";
    exapleGuide.innerHTML += "<td>" + infoElem.language + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" 
        + infoElem.workExperience + "</td>";
    exapleGuide.innerHTML += "<td class=\"text-center\">" 
        + infoElem.pricePerHour 
        + " <i class=\"fa fa-rub\" aria-hidden=\"true\"></i></td>";
    let check_input;
    if (selectGuide && infoElem.id == selectGuide) {
        exapleGuide.classList.add("select-guide");
        check_input = "<td><input checked class=\"form-check-input "
            + "radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" 
            + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    } else {
        check_input = "<td><input class=\"form-check-input "
            + "radio-guide\" type=\"radio\" name=\"radio-guide\" value=\"" 
            + infoElem.id + "\" data-id=\"" + infoElem.id + "\"></td>";
    }
    exapleGuide.innerHTML += check_input;
    let listGuide = document.querySelector(".list-guide");
    listGuide.append(exapleGuide);
}

// Сортировка для опыта работы
function sortJsonEW(oldJson, expFrom, expUptTo) {
    //let oldJson = globalListGuides;
    const jsonLength = oldJson.length;
    let newJson = [];
    expFrom = Number(expFrom);
    expUptTo = Number(expUptTo);
    for (let i = 0; i < jsonLength; i++) {
        let jsonElement = oldJson[i];
        if (expFrom >= 0 || expUptTo >= 0) {
            if (expFrom >= 0 && expUptTo >= 0 && expUptTo >= expFrom) {
                if (expFrom <= jsonElement.workExperience 
                    && expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expFrom >= 0) {
                if (expFrom <= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            } else if (expUptTo >= 0) {
                if (expUptTo >= jsonElement.workExperience) {
                    newJson.push(jsonElement);
                }
            }
        } else {
            newJson = oldJson;
        }
    }
    if (!expFrom && !expUptTo) newJson = oldJson;
    return newJson;
}

// Начало сортировки гидов
function startSortGuides() {
    let listGuides = globalListGuides.map(a => Object.assign({}, a));
    let languageGuides = document.querySelector(".list-language").value;
    //experienceFrom, experienceUpTo
    //console.log("languageGuides");
    if (languageGuides || experienceFrom || experienceUpTo) {
        if (languageGuides) {
            listGuides = sortJson(listGuides, "language", languageGuides);
        }
        if (experienceFrom || experienceUpTo) {
            listGuides = sortJsonEW(listGuides, experienceFrom, experienceUpTo);
        }
    } else {
        listGuides = globalListGuides;
    }
    newListGuides = listGuides;
    return listGuides;
}

function loadGuideList(listGuides) {}

// Выбор языка у гида
function searchByLanguage(event) {
    let listGuides = startSortGuides();
    loadGuideList(listGuides);
}

// Загрузка окна с гидами
function loadGuideList(guides) {
    let allGuide = document.querySelectorAll(".guide");
    for (let i = 0; i < allGuide.length; i++) {
        allGuide[i].parentNode.removeChild(allGuide[i]);
    }
    for (let i = 0; i < guides.length; i++) {
        addNewElemGuides(i + 1, guides[i]);
    }
    document.querySelector('.list-language').onchange = searchByLanguage;
    let radioList = document.querySelectorAll('.radio-guide');
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioGuideChange;
    }
}

// Добавление слотов сортировки по языку
function addLanguage(language) {
    let listLanguage = document.querySelector(".list-language");
    if (listLanguage.innerHTML.indexOf(language) == -1) {
        listLanguage.innerHTML += "<option value=\" " 
            + language + "\" class=\"element-language\">" 
            + language + "</option>";
    }
}

// Загрузка с сервера списка гидов
async function downloadFromServerGuides(idRoute) {
    let thisUrl = new URL(url + "/routes/" + idRoute + "/guides");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "GET" });
        let guides = await response.json();
        globalListGuides = guides;
        return guides;
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}

// Начало загрузки окна с гидами
async function stratLoadGuideList(idRoute) {
    document.querySelector(".guidesList").classList.remove("d-none");
    let guides = await downloadFromServerGuides(idRoute);
    let oldElemLanguage = document.querySelectorAll(".element-language");
    for (let i = 0; i < oldElemLanguage.length; i++)
        oldElemLanguage[i].parentNode.removeChild(oldElemLanguage[i]);
    for (let i = 0; i < guides.length; i++)
        addLanguage(guides[i].language);
    loadGuideList(guides);

}

// Обработчик события Нажатие на выбор маршрута
function radioRouteChange(event) {
    let tSelRout = document.querySelector("[data-id='" + selectRoute + "']");
    if (selectRoute && tSelRout)
        tSelRout.parentNode.parentNode.classList.remove("select-route");
    selectRoute = event.target.value;
    event.target.parentNode.parentNode.classList.add("select-route");
    let contBtn = document.querySelector(".container-btn-make-an-application");
    contBtn.classList.add("d-none");
    stratLoadGuideList(event.target.value);
}

// Заполнение таблицы маршрутов (На вход номер страницы)
function loadRoutes(numberPage, routes) {
    if (routes.length % 10 == 0) countOfPages = routes.length / 10;
    else countOfPages = Math.floor(routes.length / 10) + 1;
    loadNumberPages(numberPage, countOfPages);
    let allExcursionRoute = document.querySelectorAll(".route");
    for (let i = 0; i < allExcursionRoute.length; i++) {
        let elem = allExcursionRoute[i];
        elem.parentNode.removeChild(elem);
    }
    for (let i = (numberPage * 10) - 10; i < numberPage * 10; i++) {
        if (routes[i]) addNewElemRoute(i + 1, routes[i]);
        //console.log(routes[i]);
    }
    loadBtnMoreAndLessDetals();
    //console.log(document.querySelectorAll('.radio-route'));
    let radioList = document.querySelectorAll('.radio-route');
    //console.log(radioList);
    for (let i = 0; i < radioList.length; i++) {
        elem = radioList[i];
        elem.onchange = radioRouteChange;
    }
    let tSelRoute = document.querySelector("[data-id='" + selectRoute + "']");
    if (selectRoute && tSelRoute) {
        tSelRoute.parentNode.parentNode.classList.add("select-route");
        tSelRoute.setAttribute("checked", "true");
    }
}

// Заполнение таблицы маршрутов (На вход номер страницы) при загрузке страницы
async function loadRoutesStart(numberPage) {
    let routes = await downloadFromServerRoutes();
    temporaryListRoutes = routes;
    for (let i = 0; i < routes.length; i++)
        addAttractionsToList(routes[i].mainObject);
    loadRoutes(numberPage, routes);
    addAttractionsToHtml();
}

// Обработчик события Нажатие на переключение страниц
function clickPageBtn(event) {
    if (event.target.dataset.page) {
        //console.log(temporaryListRoutes, globalListRoutes);
        //console.log(event.target.innerHTML);
        if (event.target.dataset.page == "0-excursions") {
            loadRoutes(1, temporaryListRoutes);
        } else if (event.target.dataset.page == "6-excursions") {
            loadRoutes(countOfPages, temporaryListRoutes);
        } else {
            loadRoutes(Number(event.target.innerHTML), temporaryListRoutes);
        }
    }
}

// Начало сортировки маршрутов 
function startSortRoutes() {
    let listRoutes = globalListRoutes.map(a => Object.assign({}, a));
    let nameRoute = document.querySelector(".search-routes").value;
    let tListAtract = document.querySelector(".list-attractions");
    let attractionsRoute = tListAtract.options[tListAtract.selectedIndex].value;
    if (attractionsRoute || nameRoute) {
        if (nameRoute) {
            listRoutes = sortJson(listRoutes, "name", nameRoute);
        }
        if (attractionsRoute) {
            listRoutes = sortJson(listRoutes, "mainObject", attractionsRoute);
        }
    } else {
        listRoutes = globalListRoutes;
    }
    temporaryListRoutes = listRoutes;
    return listRoutes;
}

// Поиск маршрутов по Достопримечательностям
function searchByAttractions(event) {
    let listRoutes = startSortRoutes();
    if (listRoutes.length == 0) {
        loadRoutes(0, listRoutes);
    } else {
        loadRoutes(1, listRoutes);
    }
}

// Поиск маршрутов по названию
function searchByName(event) {
    let listRoutes = startSortRoutes();
    if (listRoutes.length == 0) {
        loadRoutes(0, listRoutes);
    } else {
        loadRoutes(1, listRoutes);
    }
}

// Функция поиска по опыту работы
function searchExperienceWork() {
    loadGuideList(startSortGuides());
}

// обработчик события ввода опыта работы ДО
function searchExperienceFrom(event) {
    experienceFrom = event.target.value;
    searchExperienceWork();
}

// обработчик события ввода опыта работы ДО
function searchExperienceUpTo(event) {
    experienceUpTo = event.target.value;
    searchExperienceWork();
}

//Поиск в json по id
function searchById(jsonArray, idElem) {
    for (let i = 0; i < jsonArray.length; i++)
        if (jsonArray[i].id == idElem) return jsonArray[i];
}

// Праздничные дни:
// с 1 по 9 января (9 дней)
// с 6 по 8 марта (3 дня)
// с 30 апреля по 3 мая (4 дня)
// с 7 по 10 мая (4 дня)
// с 11 по 13 июня (3 дня)
// с 4 по 6 ноября (3 дня)

// Расчет итоговой стоимовти
function costCalculation(event) {
    price = 1;
    let guideServCost = searchById(globalListGuides, selectGuide).pricePerHour;
    let modSelTim = document.querySelector('.modal-select-time');
    let hoursNumber = Number(modSelTim.options[modSelTim.selectedIndex].value);
    price = price * guideServCost * hoursNumber;
    let isThisDayOff;
    if (document.querySelector('.modal-date').valueAsDate) {
        let modalDate = document.querySelector('.modal-date');
        let month = modalDate.valueAsDate.getUTCMonth() + 1;
        let day = modalDate.valueAsDate.getUTCDate();
        let nDay = modalDate.valueAsDate.getUTCDay();
        if (nDay == 6 || nDay == 0) isThisDayOff = 1.5;
        else if (((month == 1) && (day >= 1 && day <= 9)) 
            || ((month == 3) && (day >= 6 && day <= 8)) 
            || ((month == 4) && (day >= 30) || (month == 5) && (day <= 3)) 
            || ((month == 5) && (day >= 7 && day <= 10)) 
            || ((month == 6) && (day >= 11 && day <= 13)) 
            || ((month == 11) && (day >= 4 && day <= 6))) {
            isThisDayOff = 1.5;
        } else isThisDayOff = 1;
        price = price * isThisDayOff;
    }
    let isItMorning, isItEvening;
    if (document.querySelector('.modal-time').value) {
        let modalTime = document.querySelector('.modal-time');
        let hoursTime = Number(modalTime.value.split(":")[0]);
        if (hoursTime >= 9 && hoursTime <= 12) {
            isItMorning = 400;
            isItEvening = 0;
        } else if (hoursTime >= 20 && hoursTime <= 23) {
            isItEvening = 1000;
            isItMorning = 0;
        } else {
            isItMorning = 0;
            isItEvening = 0;
        }
        price = price + isItMorning + isItEvening;
    }
    let numberOfVisitors;
    if (document.querySelector('.modal-number-people').value) {
        let modalNumberPeople = document.querySelector('.modal-number-people');
        let numberPeople = Number(modalNumberPeople.value);
        if (numberPeople >= 1 
            && numberPeople <= 5) numberOfVisitors = 0;
        else if (numberPeople > 5 
            && numberPeople <= 10) numberOfVisitors = 1000;
        else if (numberPeople > 10 
            && numberPeople <= 20) numberOfVisitors = 1500;
        price = price + numberOfVisitors;
    }

    let modFirstAdit = document.querySelector('.modal-first-additional-option');
    let modSecAdit = document.querySelector('.modal-second-additional-option');
    let firstOptionCost;
    let secondOptionCost;
    let oldPrice;
    if (modFirstAdit.checked || modSecAdit.checked) {
        if (modFirstAdit.checked && modSecAdit.checked) {
            if (isThisDayOff == 1.5) {
                firstOptionCost = Math.round(price * 1.25 * 0.25 * 100) / 100;
                price = price * 0.75;
                oldPrice = price;
                price = price * 1.25;
            } else {
                firstOptionCost = Math.round(price * 1.3 * 0.25 * 100) / 100;
                price = price * 0.75;
                oldPrice = price;
                price = price * 1.3;
            }
            secondOptionCost = Math.round((price - oldPrice) * 100) / 100;
        } else if (modFirstAdit.checked) {
            firstOptionCost = Math.round(price * 25) / 100;
            price = price * 0.75;
        } else if (modSecAdit.checked) {
            if (isThisDayOff == 1.5) {
                secondOptionCost = Math.round(price * 25) / 100;
                price = price * 1.25;
            } else {
                secondOptionCost = Math.round(price * 30) / 100;
                price = price * 1.3;
            }
        }
    }
    price = Math.round(price * 100) / 100;
    //price = Math.round(price);

    document.querySelector('.modal-price').innerHTML = 
        "Итоговая стоимость: " + price 
        + " <i class=\"fa fa-rub\" aria-hidden=\"true\"></i>";

    // 1ая из опций (отображение влияния на стоимость)
    let viewFirst = document.querySelector('.view-first-addition');
    if (document.querySelector('.modal-first-additional-option').checked) {
        viewFirst.innerHTML = "Стоимость уменьшена на: " 
            + firstOptionCost 
            + " <i class=\"fa fa-rub\" aria-hidden=\"true\"></i>";
    } else {
        viewFirst.innerHTML = "";
    }

    // 2ая из опций (отображение влияния на стоимость)
    let viewSec = document.querySelector('.view-second-addition');
    if (document.querySelector('.modal-second-additional-option').checked) {
        viewSec.innerHTML = "Стоимость увеличена на: "
            + secondOptionCost
            + " <i class=\"fa fa-rub\" aria-hidden=\"true\"></i>";
    } else {
        viewSec.innerHTML = "";
    }
}

// Обработчик события нажатия на кнопку оформление заявки
function clickOnMakeAnApplication(event) {
    document.querySelector('.modal-make-FIO').innerHTML = 
        "Фио гида: " + searchById(globalListGuides, selectGuide).name;
    document.querySelector('.modal-make-name-route').innerHTML = 
        "Название маршрута: " + searchById(globalListRoutes, selectRoute).name;
    document.querySelector('.modal-first-additional-option').checked = false;
    document.querySelector('.modal-second-additional-option').checked = false;
    let nowDate = new Date();
    var day = ("0" + nowDate.getDate()).slice(-2);
    var month = ("0" + (nowDate.getMonth() + 1)).slice(-2);
    //console.log(nowDate.getFullYear() + "-" + day + "-" + month);
    document.querySelector('.modal-date').value = 
        nowDate.getFullYear() + "-" + day + "-" + month;
    document.querySelector('.modal-time').value = "09:00";
    document.querySelector('.modal-select-time').selectedIndex = 0;
    document.querySelector('.modal-number-people').value = "1";
    costCalculation();
}

// изменение формата даты на YYYY-MM-DD
function editDate(oldDate) {
    let newDate = "";
    newDate += oldDate.getUTCFullYear() + "-";
    newDate += oldDate.getUTCMonth() + 1 + "-";
    newDate += oldDate.getUTCDate();
    return newDate;
}

// Очистка главнй страницы
function clearMainWindow() {
    let tSelRout = document.querySelector("[data-id='" + selectRoute + "']");
    if (selectRoute && tSelRout) {
        tSelRout.parentNode.parentNode.classList.remove("select-route");
        tSelRout.checked = false;
    }
    selectRoute = 0;
    selectGuide = 0;
    let contBtn = document.querySelector('.container-btn-make-an-application');
    contBtn.classList.add("d-none");
    document.querySelector('.guidesList').classList.add("d-none");
}


// Сохранение заявки
async function savingApplication(event) {
    if (!(document.querySelector('.modal-date').valueAsDate 
        && document.querySelector('.modal-time').value 
        && document.querySelector('.modal-number-people').value)) {
        alert("Заполните все необходимые поля");
        return;
    }
    let formData = new FormData();
    formData.append('guide_id', selectGuide);
    formData.append('route_id', selectRoute);
    let modalDate = document.querySelector('.modal-date');
    formData.append('date', editDate(modalDate.valueAsDate));
    let minuts = document.querySelector('.modal-time').value.split(':')[1];
    if (minuts != "00" && minuts != "30") {
        alert("Время начала экскурсии в 0 или 30 минут");
        return;
    }
    formData.append('time', document.querySelector('.modal-time').value);
    let modalSetTime = document.querySelector('.modal-select-time');
    formData.append('duration', modalSetTime.value);
    let modalNumberPeople = document.querySelector('.modal-number-people');
    formData.append('persons', modalNumberPeople.value);
    formData.append('price', price);
    let modFirstOpt = document.querySelector('.modal-first-additional-option');
    let modSeconOpt = document.querySelector('.modal-second-additional-option');
    formData.append('optionFirst', Number(modFirstOpt.checked));
    formData.append('optionSecond', Number(modSeconOpt.checked));
    let thisUrl = new URL(url + "/orders");
    thisUrl.searchParams.append("api_key", key);
    try {
        let response = await fetch(thisUrl, { method: "POST", body: formData });
        if (response.status == 200) {
            await response.json();
            bootstrap.Modal.getOrCreateInstance(makeAnApplication).hide();
            showAlert("Заявка успешно создана.", "alert-primary");
            clearMainWindow();
        } else {
            let data = await response.json();
            alert(data.error);
        }
    } catch (err) {
        showAlert(err.message, "alert-danger");
    }
}

window.onload = function () {
    // Выбор страницы с маршрутами (клики)
    document.querySelector('.pagination').onclick = clickPageBtn; 
    // Загрузка 1ой страницы маршрутов
    loadRoutesStart(1); 
    // Поиск по названию маршрута (ввод названия)
    let searchRoutes = document.querySelector('.search-routes');
    searchRoutes.addEventListener('input', searchByName);
    // Поиск по Достопримечательностям (выбор)
    document.querySelector('.list-attractions').onchange = searchByAttractions; 
    // Поиск гида по опыту ОТ (ввод названия)
    let docExpFrom = document.querySelector('.experience-from');
    docExpFrom.addEventListener('input', searchExperienceFrom); 
    // Поиск гида по опыту ДО (ввод названия)
    let docExpUpTo = document.querySelector('.experience-up-to');
    docExpUpTo.addEventListener('input', searchExperienceUpTo); 
    // Кнопка оформить заявку
    let btnMakeAnAppl = document.querySelector('.btn-make-an-application');
    btnMakeAnAppl.onclick = clickOnMakeAnApplication; 
    // Внетренее изменение формы заявки для подсчета стоимости 
    let modalNumberPeople = document.querySelector(".modal-number-people");
    let modalSelectTime = document.querySelector(".modal-select-time");
    let modalDate = document.querySelector(".modal-date");
    let modalTime = document.querySelector(".modal-time");
    let modFiOp = document.querySelector(".modal-first-additional-option");
    let modSeOp = document.querySelector(".modal-second-additional-option");
    modalDate.addEventListener('change', function () {
        costCalculation();
    });
    modalTime.addEventListener('change', function () {
        costCalculation();
    });
    modalSelectTime.addEventListener('change', function () {
        costCalculation();
    });
    modalNumberPeople.addEventListener('change', function () {
        costCalculation();
    });
    modFiOp.addEventListener('change', function () {
        costCalculation();
    });
    modSeOp.addEventListener('change', function () {
        costCalculation();
    });
    let modalBtnSave = document.querySelector('.modal-btn-save');
    modalBtnSave.onclick = savingApplication; // Сохранение заявки
};

// showAlert("ОШИБКА", "alert-danger"); <--- Пример вывода уведомлений