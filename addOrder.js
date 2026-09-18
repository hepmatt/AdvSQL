const firebaseConfig = {
    apiKey: "AIzaSyAAcOnSHpeef-fmZg4H6VIL6TV4kTC2FoU",
    authDomain: "unit4tablecreation.firebaseapp.com",
    databaseURL: "https://unit4tablecreation-default-rtdb.firebaseio.com",
    projectId: "unit4tablecreation",
    storageBucket: "unit4tablecreation.firebasestorage.app",
    messagingSenderId: "57046939385",
    appId: "1:57046939385:web:8fa07b6e581c2dd3129428"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

const form = document.getElementById('orderForm');

// live character counter for the Additional Notes field
const notesInput = document.getElementById('addNotes');
const notesCount = document.getElementById('notesCounter');

    notesInput.addEventListener('input', function () {
    notesCount.textContent = this.value.length + ' / 250';
    });

// finds the highest existing orderID in CakeOrders, then displays and
// auto-fills the next available number so users don't accidentally overwrite an order
function suggestNextOrderID() {
    const dbRef = database.ref('CakeOrders');

    dbRef.once('value', (snapshot) => {
        const allOrders = snapshot.val();
        let highest = 200; // fallback starting point if the table is ever empty

        for (let key in allOrders) {
            const order = allOrders[key];
            if (order.orderID && order.orderID > highest) {
                highest = order.orderID;
            }
        }

        const nextID = highest + 1;
        document.getElementById('orderID').value = nextID;
    }).catch((error) => {
        document.getElementById('nextOrderIdHint').textContent = "Could not check existing Order IDs.";
    });
}

// run this as soon as the page loads
suggestNextOrderID();

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // pull values straight from the form's input ids
    const orderID = document.getElementById('orderID').value;
    const userID = document.getElementById('userID').value;
    const cakeColor = document.getElementById('cakeColor').value;
    const cakeSize = document.getElementById('cakeSize').value;
    const candleValue = document.getElementById('candleValue').value;
    const cakeSliced = document.getElementById('cakeSliced').checked;
    const sliceShape = document.getElementById('sliceShape').value;
    const addNotes = document.getElementById('addNotes').value;

    // filling: radio group, grab whichever one is checked
    const filling = document.querySelector('input[name="filling"]:checked').value;


    // toppings: checkbox group, gather every checked box's value into an array
    const toppingCheckboxes = document.querySelectorAll('input[name="toppings"]:checked');
    const toppings = Array.from(toppingCheckboxes).map(cb => cb.value);

    // write directly to CakeOrders/<orderID>, so the key matches the
    // orderID field exactly, same pattern as your original 10 records
    const newOrderRef = database.ref('CakeOrders/' + orderID);

    newOrderRef.set({
        orderID: Number(orderID),
        userID: Number(userID),
        cakeColor: cakeColor,
        cakeFilling: filling,
        cakeSize: cakeSize,
        cakeToppings: toppings,
        candleValue: Number(candleValue),
        cakeSliced: Boolean(cakeSliced),
        sliceShape: sliceShape,
        addNotes: addNotes
    }).then(() => {
        document.getElementById('insertResult').innerText = "Record Inserted";
        form.reset();
    }).catch((error) => {
        document.getElementById('insertResult').innerText = "Error inserting record: " + error.message;
    });
});