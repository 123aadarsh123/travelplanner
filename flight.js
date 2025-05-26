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
    returnDateGroup.style.display = "block";
  } else {
    returnDateGroup.style.display = "none";
    document.getElementById("return").value = "";
  }
}

// Set minimum and maximum dates for departure and return inputs
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 365);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

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
      returnInput.setAttribute("min", departureDate);
      returnInput.removeAttribute("disabled");
    } else {
      returnInput.setAttribute("min", formattedToday);
      returnInput.setAttribute("disabled", "true");
    }
  });

  // Handle trip type selection
  const journeyTypeSelect = document.getElementById("journeyType");
  journeyTypeSelect.addEventListener("change", (event) => {
    if (event.target.value === "round-trip") {
      returnInput.removeAttribute("disabled");
      document.getElementById("returnDateGroup").style.display = "block";
    } else {
      returnInput.setAttribute("disabled", "true");
      returnInput.value = "";
      document.getElementById("returnDateGroup").style.display = "none";
    }
  });
});

// Utility: Format money
function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Function to render user summary and result cards
function showFlightResultsWithSummary(
  { from, to, departure, returnDate, cabinClass, journeyType },
  flights
) {
  const resultsDiv = document.getElementById("flight-results");

  // Map airport codes to names for display
  const airportNames = {
    DEL: "Delhi (DEL)",
    BOM: "Mumbai (BOM)",
    BLR: "Bangalore (BLR)",
    MAA: "Chennai (MAA)",
    CCU: "Kolkata (CCU)",
  };

  let summaryHtml = `
  <div class="booking-search-summary" style="background:#f7fafc;border-radius:12px;padding:18px 22px;margin-bottom:24px;">
    <b>Journey Type:</b> ${
      journeyType === "round-trip" ? "Round Trip" : "One Way"
    } &nbsp; 
    <b>From:</b> ${airportNames[from] || from || "-"} &nbsp; 
    <b>To:</b> ${airportNames[to] || to || "-"} &nbsp; 
    <b>Departure:</b> ${departure || "-"}
    ${returnDate ? `&nbsp; <b>Return:</b> ${returnDate}` : ""}
    &nbsp; <b>Cabin Class:</b> ${
      cabinClass
        ? cabinClass[0].toUpperCase() + cabinClass.slice(1).replace("_", " ")
        : "-"
    }
  </div>
`;

  if (!flights || flights.length === 0) {
    resultsDiv.innerHTML =
      summaryHtml + "<p>No flights found for your selection.</p>";
    return;
  }

  let html = `<div class="bookingcom-style-results">`;
  flights.forEach((f) => {
    html += `
      <div class="flight-card">
        <div class="flight-card-main">
          <div class="flight-airline-logo">
            <img src="${f.airlineLogoUrl || "flight-icon.jpg"}" alt="${
      f.airlineName || "Airline"
    }" style="width:40px;height:40px;border-radius:8px;">
          </div>
          <div class="flight-times">
            <div>
              <strong>${f.departureTime || ""}</strong>
              <span class="flight-airport-code">${
                f.departureAirportCode || ""
              }</span>
            </div>
            <div class="flight-duration">
              <span class="direct-badge">${
                f.stops === 0 ? "Direct" : f.stops + " stop"
              }</span>
              <span>${f.duration || ""}</span>
            </div>
            <div>
              <strong>${f.arrivalTime || ""}</strong>
              <span class="flight-airport-code">${
                f.arrivalAirportCode || ""
              }</span>
            </div>
          </div>
          <div class="flight-details">
            <div class="flight-airline-name">${f.airlineName || ""}</div>
            <div class="flight-number">${f.flightNumber || ""}</div>
          </div>
          <div class="flight-fare-box">
            <div class="flight-fare-label">${f.fareType || ""}</div>
            <div class="flight-fare-amount">${formatINR(f.price)}</div>
            <button class="btn btn-primary btn-details">View details</button>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  resultsDiv.innerHTML = summaryHtml + html;
}

// Static flight data (from your screenshot)
function getStaticFlightResults(from, to) {
  return [
    {
      airlineLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "",
      departureTime: "11:40 AM",
      departureAirportCode: from,
      arrivalTime: "1:55 PM",
      arrivalAirportCode: to,
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: getFare(from, to),
    },
    {
      airlineLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "",
      departureTime: "2:40 PM",
      departureAirportCode: to,
      arrivalTime: "4:55 PM",
      arrivalAirportCode: from,
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: getFare(to, from),
    },
  ];
}

function getFare(from, to) {
  // Simple static fare logic, aap chahein to aur logic laga sakte hain
  if ((from === "DEL" && to === "BOM") || (from === "BOM" && to === "DEL")) {
    return 9645;
  }
  if ((from === "DEL" && to === "BLR") || (from === "BLR" && to === "DEL")) {
    return 10500;
  }
  if ((from === "DEL" && to === "MAA") || (from === "MAA" && to === "DEL")) {
    return 11200;
  }
  // Default fare
  return 9000;
}
// On form submit: fetch user input, show static results and summary
document
  .getElementById("flightForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const departure = document.getElementById("departure").value;
    const returnDate = document.getElementById("return").value;
    const cabinClass = document.getElementById("cabinClass").value;
    const journeyType = document.getElementById("journeyType").value;
    // Optionally validate input
    if (!from || !to || !departure) {
      alert("Please fill in all required fields.");
      return;
    }
    if (from === to) {
      alert("Origin and destination cannot be the same.");
      return;
    }

    // Show static results with user input summary
    showFlightResultsWithSummary(
      { from, to, departure, returnDate, cabinClass, journeyType },
      getStaticFlightResults(from, to)
    );
  });
