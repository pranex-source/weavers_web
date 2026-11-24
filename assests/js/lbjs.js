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

        
        let materialText = "";
        if (currentLabour.sarees > 0) {
            materialText = currentLabour.materialType + ", " + currentLabour.sarees + " sarees";
        } else {
            materialText = "Nothing assigned yet";
        }

        
        let tableRows = "<tr><th>Date</th><th>Amount</th></tr>";
        for (let j = 0; j < currentLabour.salary.length; j++) {
            let payment = currentLabour.salary[j];
            let formattedDate = formatDate(payment.date);
            
            tableRows = tableRows + "<tr><td>" + formattedDate + "</td><td>" + payment.amount + "</td></tr>";
        }

        
        document.getElementById("historyBox").innerHTML =
            "<h3>My History</h3>" +
            "<p>Name: <b>" + currentLabour.name + "</b></p>" +
            "<p>ID: <b>" + currentLabour.id + "</b></p>" +
            "<p>Material Received: <b>" + formatDate(currentLabour.assignedDate) + "</b></p>" +
            "<p>Material Submission: <b>" + formatDate(currentLabour.completionDate) + "</b></p>" +
            "<p>Material Type &amp; Count: <b>" + materialText + "</b></p>" +
            "<h3>Salary History</h3><table>" + tableRows + "</table>";

    