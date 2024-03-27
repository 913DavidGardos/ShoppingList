import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-aacc9-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const ulEl = document.getElementById("shopping-items")


function clearShoppingList(){
  ulEl.innerHTML = ""
}


function updateListItems(items){
  for(let i = 0; i < items.length; i++){
    const itemID = items[i][0]
    const itemVal = items[i][1]
    console.log(itemID, itemVal)
    const liEl = document.createElement("li")
    liEl.classList.add("shop-item")
    liEl.textContent = itemVal 
    liEl.addEventListener("click", function(){
      let exactLocationInDb = ref(database, `shoppingList/${itemID}`)
      remove(exactLocationInDb)
    })
    ulEl.append(liEl)
  }
}


onValue(shoppingListInDB, function (snapshot){
  clearShoppingList()
  if(snapshot.exists()){
    const data = snapshot.val()
    updateListItems(Object.entries(data))
  } else {
    console.log("snapshot empty")
  }
})

function handler() {
    let inputValue = inputFieldEl.value
    
    inputFieldEl.value =""
    push(shoppingListInDB, inputValue)
    
    console.log(inputValue)
}


addButtonEl.addEventListener("click", handler)
inputFieldEl.addEventListener("keypress", (e) => { 
  if(e.key === 'Enter'){
    handler()
  }
})


