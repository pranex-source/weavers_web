let savedData = localStorage.getItem("labours");
let labours;

if (savedData) {
    labours = JSON.parse(savedData);
} else {
    let startDataText = document.getElementById("startData").textContent;
    let parsedStartData = JSON.parse(startDataText);
    labours = parsedStartData;
}

let currentLabour = null;
for (let i = 0; i < labours.length; i++) {
    if (labours[i].id === "H001") {
        currentLabour = labours[i]; 
        break; 
    }
}


function formatDate(dateString) {
    if (!dateString) {
        return "-"; 
    }
   
    let parts = dateString.split("-"); 
    let day = parts[2];
    let month = parts[1];
    let year = parts[0].slice(2); 
    
    return day + "." + month + "." + year;
}


// CHANGED: one function makes ONE month card.
// We use it for "This Month" and for every old month.
function makeCard(title, materialText, assignedDate, completionDate, salaryList) {

    // salary table rows
    let rows = "<tr><th>Date</th><th>Amount</th></tr>";
    for (let i = 0; i < salaryList.length; i++) {
        rows = rows + "<tr><td>" + formatDate(salaryList[i].date) + "</td><td>" + salaryList[i].amount + "</td></tr>";
    }
    if (salaryList.length == 0) {
        rows = rows + '<tr><td colspan="2">No payments yet</td></tr>';
    }

    // the card
    return "<div class='month-card'>" +
           "<h3>" + title + "</h3>" +
           "<p>Material Received: <b>" + formatDate(assignedDate) + "</b></p>" +
           "<p>Material Submission: <b>" + formatDate(completionDate) + "</b></p>" +
           "<p>Material Type &amp; Count: <b>" + materialText + "</b></p>" +
           "<table>" + rows + "</table>" +
           "</div>";
}


// What material this month?
let materialText = "";
if (currentLabour.sarees > 0) {
    materialText = currentLabour.materialType + ", " + currentLabour.sarees + " sarees";
} else {
    materialText = "Nothing assigned yet";
}


// First card = This Month
let cardsHtml = makeCard("This Month", materialText, currentLabour.assignedDate, currentLabour.completionDate, currentLabour.salary);

// Then one card for each old month (August, July ...)
let past = currentLabour.history;

if (past && past.length > 0) {
    for (let k = 0; k < past.length; k++) {
        let m = past[k];
        let oldMaterial = m.materialType + ", " + m.sarees + " sarees";
        cardsHtml = cardsHtml + makeCard(m.month, oldMaterial, m.assignedDate, m.completionDate, m.salary);
    }
}


// Show everything on the page: top bar + all the cards
document.getElementById("historyBox").innerHTML =
    "<div class='info-bar'>" +
    "<h3>My History</h3>" +
    "<span>Name: <b>" + currentLabour.name + "</b></span>" +
    "<span>ID: <b>" + currentLabour.id + "</b></span>" +
    "</div>" +
    cardsHtml;