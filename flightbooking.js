window.addEventListener("DOMContentLoaded", function () {
  // Get values from sessionStorage (with sensible defaults)
  const adults = parseInt(sessionStorage.getItem("bookingAdults") || "1", 10);
  const children = parseInt(
    sessionStorage.getItem("bookingChildren") || "0",
    10
  );
  const from = sessionStorage.getItem("bookingFrom") || "DEL";
  const to = sessionStorage.getItem("bookingTo") || "BOM";
  const journeyType =
    sessionStorage.getItem("bookingJourneyType") || "round-trip";
  const departure = sessionStorage.getItem("bookingDeparture") || "2025-06-28";
  const returnDate = sessionStorage.getItem("bookingReturn") || "";

  // Airport code to name
  const airportNames = {
    DEL: "New Delhi",
    BOM: "Mumbai",
    BLR: "Bangalore",
    MAA: "Chennai",
    CCU: "Kolkata",
  };

  // Format date as: Sat, Jun 28
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Compose summary line
  const travelerCount = adults + children;
  const tripSummary = document.getElementById("trip-summary");
  tripSummary.innerHTML = `
    ${journeyType === "round-trip" ? "Round-trip" : "One-way"}
    &nbsp;•&nbsp; ${travelerCount} traveler${travelerCount > 1 ? "s" : ""}
    &nbsp;•&nbsp; ${formatDate(departure)}${
    journeyType === "round-trip" && returnDate
      ? " - " + formatDate(returnDate)
      : ""
  }
  `;

  // Compose route title
  const routeTitle = document.getElementById("route-title");
  routeTitle.textContent = `${airportNames[from] || from} to ${
    airportNames[to] || to
  }`;

  // Generate traveler cards
  let cardsHtml = "";
  for (let i = 1; i <= adults; i++) {
    cardsHtml += `
      <div class="card">
        <div class="card-title">👤 Adult ${i}</div>
        <button style="background:#fff;border:1px solid #0071c2;color:#0071c2;padding:8px 18px;border-radius:5px;font-weight:500;cursor:pointer;margin-bottom:14px;">Add this traveler's details</button>
        <ul class="bag-list">
          <li>1 personal item<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">Fits under the seat in front of you</span></li>
          <li style="margin-top:10px;">1 carry-on bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">25 x 35 x 55 cm · 7 kg</span></li>
          <li style="margin-top:10px;">1 checked bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">15 kg</span></li>
        </ul>
      </div>
    `;
  }
  for (let i = 1; i <= children; i++) {
    cardsHtml += `
      <div class="card">
        <div class="card-title">🧒 Child ${i}</div>
        <button style="background:#fff;border:1px solid #0071c2;color:#0071c2;padding:8px 18px;border-radius:5px;font-weight:500;cursor:pointer;margin-bottom:14px;">Add this traveler's details</button>
        <ul class="bag-list">
          <li>1 personal item<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">Fits under the seat in front of you</span></li>
          <li style="margin-top:10px;">1 carry-on bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">25 x 35 x 55 cm · 7 kg</span></li>
          <li style="margin-top:10px;">1 checked bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">15 kg</span></li>
        </ul>
      </div>
    `;
  }
  document.querySelector(".traveler-cards").innerHTML = cardsHtml;

  // Update price details (example static price, you can make dynamic)
  const fare = parseFloat(sessionStorage.getItem("bookingFare") || "0");
  let priceRows = "";
  if (adults > 0)
    priceRows += `<div class="price-row"><span>Adult (${adults})</span></div>`;
  if (children > 0)
    priceRows += `<div class="price-row"><span>Child (${children})</span></div>`;
  document.getElementById("price-breakdown").innerHTML = priceRows;
  document.getElementById("total-price").textContent =
    "INR" + fare.toLocaleString(undefined, { minimumFractionDigits: 2 });
  document.getElementById("traveler-count").textContent = travelerCount;
  // Open modal on "Add this traveler's details" click
  document.body.addEventListener("click", function (e) {
    if (e.target && e.target.matches("button, .btn, .btn-details")) {
      if (e.target.textContent.includes("Add this traveler's details")) {
        document.getElementById("traveler-modal").style.display = "flex";
      }
    }
    if (e.target && e.target.id === "close-modal") {
      document.getElementById("traveler-modal").style.display = "none";
    }
    if (e.target && e.target.id === "done-btn") {
      document.getElementById("traveler-modal").style.display = "none";
      // Optionally: validate and save traveler details here
    }
  });
  // Optional: close modal on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape")
      document.getElementById("traveler-modal").style.display = "none";
  });
});
