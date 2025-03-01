const dayTiles = document.querySelectorAll('.day-tile');
const calendarPage = document.querySelector('.calendar-page');
const taskPage = document.querySelector('.task-page');

dayTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    calendarPage.classList.add('hidden');
    taskPage.classList.remove('hidden');
  });
});

// Add logic for coin animation and task completion