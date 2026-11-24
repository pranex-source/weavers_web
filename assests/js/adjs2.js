function startApp() {

    const totalMaterial = 150;
    const sareeCount = 10;

    // ---------- Load the data ----------
    const savedText = localStorage.getItem("labours");
    let labours;
    if (savedText) {
        labours = JSON.parse(savedText);
    } else {
        const jsonText = document.getElementById("labourData").textContent;
        labours = JSON.parse(jsonText);
    }

    let current = 0;   // which labour we are editing (0 = first)

    // ---------- Save the data ----------
    function saveData() {
        localStorage.setItem("labours", JSON.stringify(labours));
    }

    // Colour one pie and give back the percent
    function drawPie(pieId, part, total) {
        let percent = 0;
        if (total > 0) {
            percent = Math.round(part / total * 100);
        }
        const pie = document.getElementById(pieId);
        pie.style.background = "conic-gradient(#27ae60 0% " + percent + "%, #f39c12 " + percent + "% 100%)";
        return percent;
    }

    function showCharts() {

        // Count everything from the labour data
        let issuedMaterial = 0;   // total sarees given to labours
        let issuedLabours = 0;    // labours who got work
        let completedTasks = 0;   // labours who finished
        let workingLabours = 0;   // labours still working

        for (let i = 0; i < labours.length; i++) {
            if (labours[i].sarees > 0) {
                issuedMaterial = issuedMaterial + labours[i].sarees;
                issuedLabours = issuedLabours + 1;
                if (labours[i].completed == true) {
                    completedTasks = completedTasks + 1;
                } else {
                    workingLabours = workingLabours + 1;
                }
            }
        }
        const totalLabours = labours.length;

        const percent1 = drawPie("pie1", issuedMaterial, totalMaterial);
        document.getElementById("text1").innerHTML = percent1 + "% Issued (" + issuedMaterial + " of " + totalMaterial + ")";

        const percent2 = drawPie("pie2", completedTasks, issuedLabours);
        document.getElementById("text2").innerHTML = percent2 + "% Completed (" + completedTasks + " of " + issuedLabours + ")";

        drawPie("pie3", workingLabours, totalLabours);
        document.getElementById("text3").innerHTML = workingLabours + " working, " + (totalLabours - workingLabours) + " not working";
    }

    function showDashboard() {
        showCharts();   // refresh the pies every time we come back

        const cardsBox = document.getElementById("cards");
        cardsBox.innerHTML = "";

        // Make one card for each labour
        for (let j = 0; j < labours.length; j++) {
            const l = labours[j];

            // Decide the status text AND the card colour
            let status = "Not assigned";
            let color = "red";
            if (l.sarees > 0) {
                status = "In progress";
                color = "yellow";
                if (l.completed == true) {
                    status = "Completed";
                    color = "green";
                }
            }

            const card = document.createElement("div");
            card.className = "id-card " + color;
            card.innerHTML = '<div class="name">' + l.name + "</div>" +
                             "Labour ID: " + l.id + "<br>" +
                             '<span class="status">' + status + "</span>";
            
            function openLabour() {
                showAssign(j);
            }
            card.onclick = openLabour;

            cardsBox.appendChild(card);
        }

        document.getElementById("dashboard").style.display = "block";
        document.getElementById("assign").style.display = "none";
    }

    function showSalary() {
        const salary = labours[current].salary;
        let rows = "<tr><th>Date</th><th>Amount</th></tr>";

        for (let i = 0; i < salary.length; i++) {
            rows = rows + "<tr><td>" + salary[i].date + "</td><td>" + salary[i].amount + "</td></tr>";
        }

        if (salary.length == 0) {
            rows = rows + '<tr><td colspan="2">No payments yet</td></tr>';
        }
        document.getElementById("aSalary").innerHTML = rows;
    }

    function showAssign(number) {
        current = number;
        console.log("current=",current);
        
        const l = labours[current];

        document.getElementById("aName").innerHTML = l.name;
        document.getElementById("aId").innerHTML = l.id;
        document.getElementById("aAssigned").value = l.assignedDate;
        document.getElementById("aCompletion").value = l.completionDate;
        document.getElementById("aSarees").value = sareeCount;

        if (l.sarees == 0) {
            document.getElementById("aType").value = "Silk";
        } else {
            document.getElementById("aType").value = l.materialType;
        }

        if (l.completed == true) {
            document.getElementById("doneBtn").innerHTML = "Reopen task";
        } else {
            document.getElementById("doneBtn").innerHTML = "Mark completed";
        }

        showSalary();
        document.getElementById("aMessage").innerHTML = "";

        document.getElementById("dashboard").style.display = "none";
        document.getElementById("assign").style.display = "block";
    }

    function saveAssignment() {
        labours[current].materialType = document.getElementById("aType").value;
        labours[current].sarees = sareeCount;
        labours[current].assignedDate = document.getElementById("aAssigned").value;
        labours[current].completionDate = document.getElementById("aCompletion").value;
        saveData();
        document.getElementById("aMessage").innerHTML = "Assignment saved";
    }

    function toggleCompleted() {
        if (labours[current].completed == true) {
            labours[current].completed = false;
            saveData();
            showAssign(current);
            document.getElementById("aMessage").innerHTML = "Task reopened";
        } else {
            labours[current].completed = true;
            saveData();
            showAssign(current);
            document.getElementById("aMessage").innerHTML = "Marked completed";
        }
    }

    function addPayment() {
        const date = document.getElementById("payDate").value;
        const amount = Number(document.getElementById("payAmount").value);

        if (date == "" || amount == 0) {
            document.getElementById("aMessage").innerHTML = "Enter date and amount";
            return;
        }

        labours[current].salary.push({ date: date, amount: amount });
        saveData();
        showAssign(current);
        document.getElementById("aMessage").innerHTML = "Payment added";
    }

    // NEW: Close month button. Moves this month's work into history.
    function closeMonth() {
        const l = labours[current];

        // Nothing to close if no work or no assigned date
        if (l.sarees == 0 || l.assignedDate == "") {
            document.getElementById("aMessage").innerHTML = "Assign work and set the assigned date first";
            return;
        }

        // Get the month name from the date: "2026-09-22" becomes "September 2026"
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        const parts = l.assignedDate.split("-");
        const monthText = monthNames[Number(parts[1]) - 1] + " " + parts[0];

        // Make the history list if this labour does not have one yet
        if (l.history == null) {
            l.history = [];
        }

        // Add this month at the start of the list (newest first)
        l.history.unshift({
            month: monthText,
            materialType: l.materialType,
            sarees: l.sarees,
            assignedDate: l.assignedDate,
            completionDate: l.completionDate,
            salary: l.salary
        });

        // Keep only the last 2 months (change 2 to 3 for three months)
        if (l.history.length > 2) {
            l.history.pop();
        }

        // Clear this month, so new work can be assigned
        l.materialType = "";
        l.sarees = 0;
        l.assignedDate = "";
        l.completionDate = "";
        l.completed = false;
        l.salary = [];

        saveData();
        showAssign(current);
        document.getElementById("aMessage").innerHTML = "Month closed. Saved in history.";
    }

    function resetData() {
        localStorage.removeItem("labours");
        location.reload();
        return false;
    }

    // Connect the buttons
    document.getElementById("backBtn").onclick = showDashboard;
    document.getElementById("saveBtn").onclick = saveAssignment;
    document.getElementById("doneBtn").onclick = toggleCompleted;
    document.getElementById("payBtn").onclick = addPayment;
    document.getElementById("closeBtn").onclick = closeMonth;  
    document.getElementById("resetLink").onclick = resetData;

    // Start
    showDashboard();
}

startApp();