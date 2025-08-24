(function () {
  const lifeData = JSON.parse(localStorage.getItem("lifeData")) || {};

  // Elements
  const resName = document.getElementById("resName");
  const resAge = document.getElementById("resAge");
  const resGender = document.getElementById("resGender");
  const resLocation = document.getElementById("resLocation");
  const resFoodType = document.getElementById("resFoodType");
  const resFavFood = document.getElementById("resFavFood");
  const genderImage = document.getElementById("genderImage");
  const person = document.getElementById("person");
  const lifeVisual = document.getElementById("lifeVisual");
  const timeline = document.getElementById("timeline");
  const progress = document.getElementById("progress");
  const coffin = document.getElementById("coffin");
  const remainingTime = document.getElementById("remainingTime");
  const revealBtn = document.getElementById("revealBtn");

  // Populate user info
  resName.textContent = lifeData.name || "-";
  resAge.textContent = lifeData.age || "-";
  resGender.textContent = lifeData.gender || "-";
  resLocation.textContent = lifeData.location || "-";
  resFoodType.textContent = lifeData.foodType || "-";
  resFavFood.textContent = lifeData.favFood || "-";

  // Avatar
  const maleURL   = "https://cdn-icons-png.flaticon.com/512/145/145867.png";
  const femaleURL = "https://cdn-icons-png.flaticon.com/512/145/145852.png";
  const otherURL  = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const avatarURL =
    lifeData.gender === "Male" ? maleURL :
    lifeData.gender === "Female" ? femaleURL : otherURL;

  genderImage.src = avatarURL;
  person.src = avatarURL;

  revealBtn.addEventListener("click", revealLife);

  function revealLife() {
    lifeVisual.style.display = "block";

    const age = clampInt(lifeData.age, 0, 120);
    let avgLife = 75;

    switch (lifeData.location) {
      case "Japan": avgLife = 84; break;
      case "India": avgLife = 70; break;
      case "USA": avgLife = 78; break;
      case "Europe": avgLife = 81; break;
    }
    if (lifeData.gender === "Female") avgLife += 3;
    if (lifeData.gender === "Male") avgLife -= 2;

    const yearsRemaining = Math.max(0, avgLife - age);
    const daysLived = Math.round(age * 365.25);
    const daysRemaining = Math.round(yearsRemaining * 365.25);

    remainingTime.innerHTML =
      `🌍 You’ve lived <b>${daysLived.toLocaleString()}</b> days.<br>` +
      `⏳ Remaining Life: <b>${daysRemaining.toLocaleString()}</b> days (${yearsRemaining} years).`;

    const timelineWidth = timeline.offsetWidth;
    const personWidth = person.offsetWidth;
    const coffinWidth = coffin.offsetWidth;

    // Coffin fixed at end
    coffin.style.left = timelineWidth - coffinWidth + "px";

    // Target X for person
    const targetX = Math.min(age / avgLife, 1) * (timelineWidth - personWidth);

    // Age = 0 special case
    if (age === 0) {
      person.style.left = "0px";
      progress.style.width = "0px";
      coffin.style.left = "0px";  
      progress.style.background = "red"; // red line for age 0
      return;
    }

    // Normal age > 0, line starts green
    progress.style.background = "green";

    // Animate person and line together
    let startTime = null;
    const duration = 2000;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(elapsed / duration, 1);
      const easedPct = easeOutQuad(pct);
      const currentX = targetX * easedPct;

      person.style.left = currentX + "px";
      progress.style.width = currentX + personWidth / 2 + "px";

      // If age = 0 and reached coffin, change line to green
      if (age === 0 && currentX >= coffin.offsetLeft) {
        progress.style.background = "green";
      }

      if (pct < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function clampInt(v, min, max) {
    v = parseInt(v, 10);
    if (isNaN(v)) return min;
    return Math.max(min, Math.min(max, v));
  }

  function easeOutQuad(t) {
    return t * (2 - t);
  }
})();
