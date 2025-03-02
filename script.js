const dayTiles = document.querySelectorAll('.day-tile');
const locks = document.querySelectorAll('.lock');

// Get the current day of Ramadan dynamically
let currentDay = 1; // Default to day 1 (will be updated dynamically)

// Function to fetch the current Islamic date
async function getCurrentIslamicDate() {
  const response = await fetch('https://api.aladhan.com/v1/gToH');
  const data = await response.json();
  const hijriMonth = data.data.hijri.month.number;
  const hijriDay = data.data.hijri.day;

  // Check if it's Ramadan (month 9 in the Hijri calendar)
  if (hijriMonth === 9) {
    return hijriDay;
  } else {
    return 0; // Not Ramadan
  }
}

// Function to unlock a day
function unlockDay(day) {
  const lock = locks[day - 1];
  if (lock) {
    lock.src = 'assets/icons/lock-unlocked.png';
    lock.classList.add('unlocked');
    // Save the unlocked state in localStorage
    localStorage.setItem(`day-${day}-unlocked`, 'true');
  }
}

// Function to check if a day is unlocked
function isDayUnlocked(day) {
  return localStorage.getItem(`day-${day}-unlocked`) === 'true';
}

// Function to handle day clicks
function handleDayClick(day) {
  if (day <= currentDay) {
    unlockDay(day);
  } else {
    alert("This day is not unlocked yet!");
  }
}

// Add event listeners to each day tile
dayTiles.forEach((tile, index) => {
  const day = index + 1;
  tile.addEventListener('click', () => handleDayClick(day));
});

// Initialize the calendar
async function initializeCalendar() {
  const hijriDay = await getCurrentIslamicDate();
  if (hijriDay > 0) {
    currentDay = hijriDay; // Set the current day of Ramadan
    // Unlock all days up to the current day
    for (let day = 1; day <= currentDay; day++) {
      unlockDay(day);
    }
    // Restore unlocked days from localStorage
    for (let day = 1; day <= 30; day++) {
      if (isDayUnlocked(day)) {
        unlockDay(day);
      }
    }
  } else {
    alert("It's not Ramadan yet!");
  }
}

// Initialize the calendar on page load
initializeCalendar();

const timingsBox = document.querySelector('.timings-box');

// Function to fetch prayer times
async function getPrayerTimes(latitude, longitude) {
  const date = new Date();
  const today = date.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=2`
  );
  const data = await response.json();
  return data.data.timings;
}

// Function to display prayer times
function displayPrayerTimes(timings) {
  timingsBox.innerHTML = `
    <p>Fajr: ${timings.Fajr}</p>
    <p>Dhuhr: ${timings.Dhuhr}</p>
    <p>Asr: ${timings.Asr}</p>
    <p>Maghrib: ${timings.Maghrib}</p>
    <p>Isha: ${timings.Isha}</p>
  `;
}

// Function to get user location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getPrayerTimes(latitude, longitude).then((timings) => {
          displayPrayerTimes(timings);
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        timingsBox.innerHTML = "<p>Unable to fetch prayer times. Please enable location access.</p>";
      }
    );
  } else {
    timingsBox.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
  }
}

// Fetch and display prayer times on page load
getUserLocation();

function getNextPrayerTime(timings) {
  const now = new Date();
  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  for (const prayer of prayerTimes) {
    const prayerTime = new Date(`${now.toDateString()} ${prayer.time}`);
    if (prayerTime > now) {
      return { name: prayer.name, time: prayer.time };
    }
  }

  // If all prayers have passed, return Fajr for the next day
  return { name: 'Fajr', time: timings.Fajr };
}

// Update displayPrayerTimes function
function displayPrayerTimes(timings) {
  const nextPrayer = getNextPrayerTime(timings);
  timingsBox.innerHTML = `
    <p>Fajr: ${timings.Fajr}</p>
    <p>Dhuhr: ${timings.Dhuhr}</p>
    <p>Asr: ${timings.Asr}</p>
    <p>Maghrib: ${timings.Maghrib}</p>
    <p>Isha: ${timings.Isha}</p>
    <p><strong>Next Prayer: ${nextPrayer.name} at ${nextPrayer.time}</strong></p>
  `;
}