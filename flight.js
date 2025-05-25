// Show initial letter of user name on Dashboard button
document.addEventListener("DOMContentLoaded", function () {
  let initial = "D";
  const name =
    sessionStorage.getItem("fullName") || localStorage.getItem("userFullName");
  if (name && name.trim().length > 0) {
    initial = name.trim()[0].toUpperCase();
  }
  document.getElementById("dashboard-initial").textContent = initial;
});
// Toggle the visibility of the return date field based on journey type
function toggleReturnDate() {
  const journeyType = document.getElementById("journeyType").value;
  const returnDateGroup = document.getElementById("returnDateGroup");

  if (journeyType === "round-trip") {
    returnDateGroup.style.display = "block"; // Show the return date field
  } else {
    returnDateGroup.style.display = "none"; // Hide the return date field
    document.getElementById("return").value = ""; // Clear the return date value
  }
}
// Set minimum and maximum dates for departure and return inputs
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 365); // Allow booking up to 1 year in advance

  const formattedToday = today.toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; // Format max date as YYYY-MM-DD

  // Set min and max attributes for departure and return inputs
  const departureInput = document.getElementById("departure");
  const returnInput = document.getElementById("return");

  departureInput.setAttribute("min", formattedToday);
  departureInput.setAttribute("max", formattedMaxDate);
  returnInput.setAttribute("min", formattedToday);
  returnInput.setAttribute("max", formattedMaxDate);

  // Update return date's minimum based on departure date
  departureInput.addEventListener("change", (event) => {
    const departureDate = event.target.value;

    if (departureDate) {
      returnInput.setAttribute("min", departureDate); // Set return date's min to the selected departure date
      returnInput.removeAttribute("disabled"); // Enable the return date field
    } else {
      returnInput.setAttribute("min", formattedToday); // Reset to today's date if departure date is cleared
      returnInput.setAttribute("disabled", "true"); // Disable the return date field
    }
  });

  // Handle trip type selection (one-way or round trip)
  const tripTypeInputs = document.getElementsByName("tripType");
  tripTypeInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.value === "round") {
        returnInput.removeAttribute("disabled"); // Enable the return date field for round trips
      } else {
        returnInput.setAttribute("disabled", "true"); // Disable the return date field for one-way trips
        returnInput.value = ""; // Clear the return date value
      }
    });
  });
});

// ...rest of your code above...

// Example static flight data generator (You can replace this with real API or logic)
function getFlightResults({ from, to, departure, adults, children, cabinClass }) {
  // For demo: generate 3 random flights
  const sampleFlights = [
    {
      airline: "IndiGo",
      number: "6E-203",
      departureTime: "09:00",
      fare: 3200
    },
    {
      airline: "Air India",
      number: "AI-101",
      departureTime: "12:30",
      fare: 3900
    },
    {
      airline: "Vistara",
      number: "UK-857",
      departureTime: "18:45",
      fare: 4300
    }
  ];
  // Optionally, filter or modify based on parameters
  return sampleFlights;
}

// Utility: Format money
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Function to render flight results similar to Booking.com style (see image 1)
function showFlightResults(flights) {
  const resultsDiv = document.getElementById("flight-results");
  if (!flights || flights.length === 0) {
    resultsDiv.innerHTML = "<p>No flights found for your selection.</p>";
    return;
  }

  let html = `<div class="bookingcom-style-results">`;

  flights.forEach(f => {
    html += `
      <div class="flight-card">
        <div class="flight-card-main">
          <div class="flight-airline-logo">
            <img src="flight-icon.jpg" alt="${f.airline}" style="width:40px;height:40px;border-radius:8px;">
          </div>
          <div class="flight-times">
            <div>
              <strong>${f.departureTime}</strong> <span class="flight-airport-code">${f.from || "DEL"}</span> 
              <span class="flight-date">${f.departureDate || ""}</span>
            </div>
            <div class="flight-duration">
              <span class="direct-badge">Direct</span>
              <span>2h 15m</span>
            </div>
            <div>
              <strong>${f.arrivalTime || ""}</strong> <span class="flight-airport-code">${f.to || "BOM"}</span>
              <span class="flight-date">${f.arrivalDate || ""}</span>
            </div>
          </div>
          <div class="flight-details">
            <div class="flight-airline-name">${f.airline}</div>
            <div class="flight-number">${f.number}</div>
          </div>
          <div class="flight-fare-box">
            <div class="flight-fare-label">Eco Value fare: personal item, carry-on bag, checked bag</div>
            <div class="flight-fare-amount">${formatINR(f.fare)}</div>
            <button class="btn btn-primary btn-details">View details</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  resultsDiv.innerHTML = html;
}


document
  .getElementById("flightForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const departure = document.getElementById("departure").value;
    const returnDate = document.getElementById("return").value;
    const adults = parseInt(document.getElementById("adults").value, 10);
    const children = parseInt(document.getElementById("children").value, 10);
    const cabinClass = document.getElementById("cabinClass").value;

    // Validate input
    if (!from || !to || !departure) {
      alert("Please fill in all required fields.");
      return;
    }
    if (from === to) {
      alert("Origin and destination cannot be the same.");
      return;
    }

    // Get and show results
    const results = getFlightResults({ from, to, departure, adults, children, cabinClass });
    showFlightResults(results);

     });
