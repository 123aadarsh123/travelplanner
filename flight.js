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

// Function to render flight results to the DOM
function showFlightResults(flights) {
  const resultsDiv = document.getElementById("flight-results");
  if (!flights || flights.length === 0) {
    resultsDiv.innerHTML = "<p>No flights found for your selection.</p>";
    return;
  }
  let html = `<table class="flight-table">
    <thead>
      <tr>
        <th>Airline</th>
        <th>Flight No.</th>
        <th>Departure Time</th>
        <th>Fare</th>
      </tr>
    </thead>
    <tbody>`;
  flights.forEach(f => {
    html += `<tr>
      <td>${f.airline}</td>
      <td>${f.number}</td>
      <td>${f.departureTime}</td>
      <td>${formatINR(f.fare)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
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
