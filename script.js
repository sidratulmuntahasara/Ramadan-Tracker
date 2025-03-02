const dayTiles = document.querySelectorAll('.day-tile');
const locks = document.querySelectorAll('.lock');
const timingsBox = document.querySelector('.timings-box');
const currentTimeElement = document.getElementById('current-time');
const userLocationElement = document.getElementById('user-location');

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

// Function to unlock a day with animation
function unlockDay(day) {
  const lock = locks[day - 1];
  if (lock) {
    // Add the 'unlocked' class to trigger the animation
    lock.classList.add('unlocked');

    // After the animation ends, change the lock icon to unlocked
    lock.addEventListener('animationend', () => {
      lock.src = 'assets/icons/lock-unlocked.png';
      lock.classList.remove('unlocked'); // Remove the class for future use
    }, { once: true });

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
    // Vibrate the device for 200ms
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    // Add a shake animation to the locked tile
    const tile = dayTiles[day - 1];
    tile.classList.add('shake');
    tile.addEventListener('animationend', () => {
      tile.classList.remove('shake');
    }, { once: true });
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
        // Add a delay to stagger the animations
        setTimeout(() => unlockDay(day), day * 200); // 200ms delay between each animation
      }
    }
  } else {
    alert("It's not Ramadan yet!");
  }
}

// Initialize the calendar on page load
initializeCalendar();

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

// Function to get the next prayer time
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
    const [hours, minutes] = prayer.time.split(':');
    const prayerTime = new Date();
    prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (prayerTime > now) {
      return { name: prayer.name, time: prayer.time };
    }
  }

  // If all prayers have passed, return Fajr for the next day
  return { name: 'Fajr', time: timings.Fajr };
}

// Function to get user location and fetch prayer times
async function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch prayer times
        const timings = await getPrayerTimes(latitude, longitude);
        displayPrayerTimes(timings);

        // Fetch the city/region using a reverse geocoding API
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        const location = `${data.city}, ${data.principalSubdivision}`;
        userLocationElement.textContent = `Location: ${location}`;
      },
      (error) => {
        console.error("Error getting location:", error);
        timingsBox.innerHTML = "<p>Unable to fetch prayer times. Please enable location access.</p>";
        userLocationElement.textContent = "Location: Unable to fetch location.";
      }
    );
  } else {
    timingsBox.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
    userLocationElement.textContent = "Location: Geolocation is not supported by your browser.";
  }
}

// Fetch and display prayer times and location on page load
getUserLocation();

// Function to update the current time
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString(); // Format: HH:MM:SS
  currentTimeElement.textContent = `Current Time: ${timeString}`;
}

// Update the time every second
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // Initial call