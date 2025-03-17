document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("input");
    const submitBtn = document.getElementById("submit");
    const monthName = document.getElementById("monthName");

    if (monthName) {
        const now = new Date();
        const options = { month: 'long', year: 'numeric' }; // Format for month and year
        monthName.textContent = now.toLocaleDateString('en-US', options);
    }

    const calendarElement = document.getElementById("calendar");
    let storageValues = JSON.parse(localStorage.getItem("calendarData")) || {};

    function saveToLocalStorage() {
        localStorage.setItem("calendarData", JSON.stringify(storageValues));
    }

    function getCurrentDateTime() {
        const now = new Date();
        const hrs = now.getHours() % 12 || 12;
        const mins = now.getMinutes().toString().padStart(2, '0');
        const sec = now.getSeconds().toString().padStart(2, '0');
        const ampm = now.getHours() >= 12 ? "PM" : "AM";

        return {
            date: now.getDate(),
            time: `${hrs}:${mins}:${sec} ${ampm}`,
            fullDate: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
    }   

    
    // function updateList() {
    //     listOfInputs.innerHTML = "";
    //     Object.values(storageValues).forEach(({ value, time, fullDate }) => {
    //         const li = document.createElement("li");
    //         li.innerText = `${fullDate} - ${value} (${time})`;
    //         listOfInputs.appendChild(li);
    //     });
    // }

    submitBtn.addEventListener("click", () => {
        const text = inputElement.value.trim();
        if (!text) return;

        const { date, time, fullDate } = getCurrentDateTime();

        console.log(storageValues)
        storageValues[date] = { value: text, time, fullDate };
        saveToLocalStorage();

        updateCalendar();
        //updateList();
        inputElement.value = "";
    });

    function createCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const totalDays = new Date(year, month + 1, 0).getDate();

        const firstDayIndex = new Date(year, month, 1).getDay();


        // Add empty placeholders
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("day", "empty");
            calendarElement.appendChild(emptyDiv);
        }

        // Create calendar days
        for (let j = 1; j <= totalDays; j++) {
            const dayElm = document.createElement("div");
            dayElm.classList.add("day");
            console.log(dayElm);
            dayElm.id = `day-${j}`;
            dayElm.innerText = j;

            if (storageValues[j]) {
                dayElm.innerText = `${j}: ${storageValues[j].value}`;
            }

            calendarElement.appendChild(dayElm);
        }
    }

    function updateCalendar() {
        Object.keys(storageValues).forEach(date => {
            const dayElm = document.getElementById(`day-${date}`);
            if (dayElm) {
                dayElm.innerText = `${date}: ${storageValues[date].value}`;
            }
        });
    }

    // Initialize calendar and list on load
    createCalendar();
    updateCalendar();
    //updateList();


    calendarElement.addEventListener("click", (event) => {
        if (event.target.classList.contains("day")) {
            const dayNumber = event.target.id.match(/\d+/)[0]; // Extracts numbers
            const userInput = prompt(`Enter text for Day ${dayNumber}:`);
            
            if (userInput) {
                event.target.innerText = `${dayNumber}: ${userInput}`;
            }
            else if (!userInput) return;
            const { date, time, fullDate } = getCurrentDateTime();

            console.log(storageValues)
            storageValues[dayNumber] = { value: userInput, time, fullDate };
            saveToLocalStorage();

            updateCalendar();

        }
    });

});

 