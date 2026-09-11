import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: import.meta.env.VITE_DATABASE_URL
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// console.log(app);
// console.log(database);
const referenceInDB = ref(database, "leads");

let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

const render = leads => {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
    };
    ulEl.innerHTML = listItems;
    return listItems;
};

const setAndRender = () => {
    render(myLeads);
    return setAndRender;
};

const callSnapshot = snapshot => {
    // console.log(snapshot.val());
    // console.log(snapshot);
    const isSnapshotExists = snapshot.exists();
    if (isSnapshotExists) {
        const snapshotVal = snapshot.val();
        const leads = Object.values(snapshotVal);
        render(leads);
    };
    return callSnapshot;
};

const deleteBtnFn = () => {
    myLeads = [];
    render(myLeads);
    remove(referenceInDB);
    ulEl.innerHTML = "";
    return deleteBtnFn;
};

const inputBtnFn = () => {
    myLeads.push(inputEl.value);
    push(referenceInDB, inputEl.value);
    inputEl.value = "";
    setAndRender();
    return inputBtnFn;
};

onValue(referenceInDB, callSnapshot);

deleteBtn.addEventListener("dblclick", deleteBtnFn);

inputBtn.addEventListener("click", inputBtnFn);