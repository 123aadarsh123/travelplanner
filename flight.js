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
async function getFlightResults({ from, to, departure, returnDate, adults, children, cabinClass, journeyType }) {
  const url = 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights';
  const params = new URLSearchParams({
    fromId: from + '.AIRPORT',       // e.g. DEL.AIRPORT
    toId: to + '.AIRPORT',           // e.g. BOM.AIRPORT
    departDate: departure,           // YYYY-MM-DD
    ...(journeyType === 'round-trip' && returnDate ? { returnDate } : {}),
    cabinClass: cabinClass.toUpperCase(), // API expects uppercase: ECONOMY, BUSINESS, etc.
    adults,
    children,
    currency_code: 'INR'
  });

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '4c9328c1fbmsh3d67d4b76c41350p1ae51fjsn665cb6fcec0f',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(`${url}?${params.toString()}`, options);
    if (!response.ok) throw new Error('API Error: ' + response.statusText);
    const data = await response.json();

    // Check and parse flight data as per API documentation
    if (data && data.data && Array.isArray(data.data.flights)) {
      return data.data.flights; // adapt to your rendering below
    } else {
      return [];
    }
  } catch (err) {
    alert("Error fetching flight data: " + err.message);
    return [];
  }
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
            <div class="flight-fare-amount">₹${f.price}</div>
            <button class="btn btn-primary btn-details">View details</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  resultsDiv.innerHTML = html;
}


document.getElementById("flightForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  // Gather form values
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const departure = document.getElementById("departure").value;
  const returnDate = document.getElementById("return").value;
  const adults = document.getElementById("adults").value;
  const children = document.getElementById("children").value;
  const cabinClass = document.getElementById("cabinClass").value;
  const journeyType = document.getElementById("journeyType").value;

  // Validate input
  if (!from || !to || !departure) {
    alert("Please fill in all required fields.");
    return;
  }
  if (from === to) {
    alert("Origin and destination cannot be the same.");
    return;
  }

  // Fetch and show results
  const results = await getFlightResults({ from, to, departure, returnDate, adults, children, cabinClass, journeyType });
  showFlightResults(results);
});
