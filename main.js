/**
 * FIREBASE
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-cart-db-eff8f-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

/**
 * DOM ELEMENTS
 */
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

/**
 * FETCHING DATA FROM FIREBASE
 */
onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        let listItemsArr = Object.entries(snapshot.val())

        clearShoppingListEl()
        
        for (let i = 0; i < listItemsArr.length; i++) {
            let currentItem = listItemsArr[i]
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here...yet"
    }
})

/**
 * LISTENERS AND FUNCTIONS  
 */

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim()

    onValue(shoppingListInDB, (snapshot) => {
        if (snapshot.exists()) {
            let listItemsValues = Object.values(snapshot.val())
            if (listItemsValues.includes(inputValue)) {
                alert("This item already exists in your list")
                return
            } else {
                push(shoppingListInDB, inputValue)
            }
        } else {
            push(shoppingListInDB, inputValue)
        }

    }, {
        onlyOnce: true
    })
  
    clearInputFieldEl()
  })

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let listItemEl = document.createElement("li")

    listItemEl.textContent = itemValue

    listItemEl.addEventListener("dblclick", () => {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.appendChild(listItemEl)
}