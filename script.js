// Firebase connection - API
const firebaseConfig = {
    apiKey: "AIzaSyAAcOnSHpeef-fmZg4H6VIL6TV4kTC2FoU",
    authDomain: "unit4tablecreation.firebaseapp.com",
    databaseURL: "https://unit4tablecreation-default-rtdb.firebaseio.com",
    projectId: "unit4tablecreation",
    storageBucket: "unit4tablecreation.firebasestorage.app",
    messagingSenderId: "57046939385",
    appId: "1:57046939385:web:8fa07b6e581c2dd3129428"
};

// Call  to initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Types text into an element one character at a time. Using recursion with setTimeout to create a typing effect. 
function typeOutput(elementId, text, speed = 2) {
    const el = document.getElementById(elementId);
    el.innerText = "";
    let i = 0;

    function typeNextChar() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(typeNextChar, speed);
        }
    }

    typeNextChar();
}

//SINGLE RECORD: this will isolate a single participant's record if they have their user ID.
//since that is the unique key it should always pull a single record.
function getByUserID() {
    const userID = document.getElementById('userID').value;
    const dbRef = firebase.database().ref('Participant');
    
    dbRef.once('value', (snapshot) => {
        const allParticipants = snapshot.val();
        let match = null;

        for (let key in allParticipants) {
            const person = allParticipants[key];
            if (String(person.userID) === userID) {
                match = person;
            }
        }
        
        typeOutput('userIdData', match ? JSON.stringify(match, null, 2) : "This person does not exist.");
    }).catch(error => {
        console.error('Error fetching data', error);
    });
}

// MULTIPLE RECORDS: this would be finding participants by their last name, but we use an example of 
//multiple users with the same last name. I figure if I was to get anything I usually give my last name
//not my user ID, so this will run a query and essentially pull userID by last name to then run an order 
// check by id...also added "toLowerCase()" so that the values match with or without capitilization
function getByLastName() {
    const lastName = document.getElementById('lastName').value.toLowerCase();
    const dbRef = firebase.database().ref('Participant');

    dbRef.once('value', (snapshot) => {
        const allParticipants = snapshot.val();
        const matches = {};

        for (let key in allParticipants) {
            const person = allParticipants[key];
            if (person.LastName.toLowerCase() === lastName) {
                matches[key] = {userID: person.userID, FirstName: person.FirstName};
            }
        }

        typeOutput('lastNameData',Object.keys(matches).length ? JSON.stringify(matches, null, 2) : "This person does not exist.");

                }).catch(error => {
        console.error('Error fetching data', error);
    });
}


// MULTIPLE SELECTION: This will pull the 2 selected values from the drop down. Next week I would like to adjust this 
//by adding data ordered, and order fulfilled or unfulfilled boolean so you can filter by outstanding orders.
function getFilteredRecords() {
    const colorChoice = document.getElementById('colorSelect').value;
    const fillingChoice = document.getElementById('fillingSelect').value;
    
    const dbRef = firebase.database().ref('CakeOrders');
    dbRef.once('value', (snapshot) => {
        const allOrders = snapshot.val();
        const matches = {};

        for (let key in allOrders) {
            const order = allOrders[key];
            if (order.cakeColor === colorChoice && order.cakeFilling === fillingChoice) {
                matches[key] = order;
            }
        }

        typeOutput('filteredData', Object.keys(matches).length ? JSON.stringify(matches, null, 2) : "Ew who would order that?");
    }).catch(error => {
        console.error('Error fetching data', error);
    });
}