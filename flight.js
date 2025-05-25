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

// Utility: Format money
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Function to render flight results similar to Booking.com style (see image 2)
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
            <img src="${f.airlineLogoUrl || 'flight-icon.jpg'}" alt="${f.airlineName || 'Airline'}" style="width:40px;height:40px;border-radius:8px;">
          </div>
          <div class="flight-times">
            <div>
              <strong>${f.departureTime || ''}</strong>
              <span class="flight-airport-code">${f.departureAirportCode || ''}</span>
            </div>
            <div class="flight-duration">
              <span class="direct-badge">${f.stops === 0 ? 'Direct' : f.stops + ' stop'}</span>
              <span>${f.duration || ''}</span>
            </div>
            <div>
              <strong>${f.arrivalTime || ''}</strong>
              <span class="flight-airport-code">${f.arrivalAirportCode || ''}</span>
            </div>
          </div>
          <div class="flight-details">
            <div class="flight-airline-name">${f.airlineName || ''}</div>
            <div class="flight-number">${f.flightNumber || ''}</div>
          </div>
          <div class="flight-fare-box">
            <div class="flight-fare-label">${f.fareType || ''}</div>
            <div class="flight-fare-amount">${formatINR(f.price)}</div>
            <button class="btn btn-primary btn-details">View details</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  resultsDiv.innerHTML = html;
}

// Static flight data based on the provided screenshot
function getStaticFlightResults() {
  return [
    {
      airlineLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "",
      departureTime: "11:40 AM",
      departureAirportCode: "DEL",
      arrivalTime: "1:55 PM",
      arrivalAirportCode: "BOM",
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: 9645
    },
    {
      airlineLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "",
      departureTime: "2:40 PM",
      departureAirportCode: "BOM",
      arrivalTime: "4:55 PM",
      arrivalAirportCode: "DEL",
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: 9645
    }
  ];
}

// On form submit, show static result (no API call)
document.getElementById("flightForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Validate input as before, or skip if you want to always show result

  // Show static results only
  const results = getStaticFlightResults();
  showFlightResults(results);
});
