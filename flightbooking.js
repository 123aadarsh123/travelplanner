window.addEventListener("DOMContentLoaded", function () {
  // Get values from sessionStorage (default to 1 adult if not set)
  const adults = parseInt(sessionStorage.getItem("bookingAdults") || "1", 10);
  const children = parseInt(
    sessionStorage.getItem("bookingChildren") || "0",
    10
  );

  // Update trip summary and route title if you want to make them dynamic
  const tripSummary = document.getElementById("trip-summary");
  const travelerCount = adults + children;
  tripSummary.innerHTML = `Round-trip &nbsp;•&nbsp; ${travelerCount} traveler${
    travelerCount > 1 ? "s" : ""
  } &nbsp;•&nbsp; Sat, Jun 28 - Sat, Jul 5`;

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

  // Update price details
  const pricePerAdult = 11336.86;
  const pricePerChild = 11336.86;
  let priceRows = "";
  if (adults > 0)
    priceRows += `<div class="price-row"><span>Adult (${adults})</span><span>INR${(
      pricePerAdult * adults
    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>`;
  if (children > 0)
    priceRows += `<div class="price-row"><span>Child (${children})</span><span>INR${(
      pricePerChild * children
    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>`;
  document.getElementById("price-breakdown").innerHTML = priceRows;
  document.getElementById("total-price").textContent =
    "INR" +
    (pricePerAdult * adults + pricePerChild * children).toLocaleString(
      undefined,
      { minimumFractionDigits: 2 }
    );
  document.getElementById("traveler-count").textContent = travelerCount;
});
