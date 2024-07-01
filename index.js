const cityTimeOffset = {
  melbourne: { name: "Melbourne", offset: 10 },
  paris: { name: "Paris", offset: 1 },
  toronto: { name: "Toronto", offset: -5 },
  beijing: { name: "Beijing", offset: 8 },
  new_york: { name: "New York", offset: -5 },
  london: { name: "London", offset: 0 },
  tokyo: { name: "Tokyo", offset: 8 },
};
const cityIds = Object.keys(cityTimeOffset);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let page = 1;
let counting = false;
let sectors = 36000;
let nextSectorId = 0;
let timerDisplay = "01:00:00";
let timerSecond = 3600;
let totalHideNumber = 10;
let modalShow = false;

cityIds.forEach((id, index) => {
  if (index > 0) {
    let clone = document
      .getElementById(cityIds[0] + "_section")
      .cloneNode(true);
    clone.setAttribute("id", id + "_section");
    clone.childNodes[1].setAttribute("id", id);
    document.getElementById("world_clocks").appendChild(clone);
  }
});

for (let i = 1; i < sectors; i++) {
  let clone = document.getElementById("timer_sector_0").cloneNode(true);
  clone.setAttribute("id", "timer_sector_" + i);
  clone.style.transform = "rotate(" + (360 * i) / sectors + "deg)";
  document.getElementById("timer_circle").appendChild(clone);
}

let worldClockInterval = setInterval(worldClock, 1000);
let timerInterval;

function startWorldClock() {
  worldClockInterval = setInterval(worldClock, 1000);
}

function stopWorldClock() {
  clearInterval(worldClockInterval);
}

function worldClock() {
  cityIds.forEach((id) => {
    setClock(id);
  });
}

function handleSwitch() {
  if (page == 2 && counting) {
    toggleModal();
  } else {
    switchPage();
  }
}

function switchPage() {
  const worldClockEl = document.getElementById("world_clocks");
  const timerEl = document.getElementById("timer");
  const switchButtonEl = document.getElementById("switch_button");
  worldClockEl.style.display = page == 1 ? "none" : "grid";
  timerEl.style.display = page == 1 ? "flex" : "none";
  switchButtonEl.style.backgroundColor =
    page == 1 ? "rgb(205, 238, 250)" : "#e94467";
  switchButtonEl.style.color = page == 1 ? "black" : "white";
  switchButtonEl.style.border =
    page == 1 ? "1px solid #413c69" : "rgb(205, 238, 250)";
  page = page == 1 ? 2 : 1;
  if (page == 2) {
    stopWorldClock();
  } else {
    startWorldClock();
  }
}

function timer() {
  const countdownEl = document.getElementById("countdown");
  if (counting) {
    if (countdownEl.innerText == "00:00:00") {
      resetTimer();
    } else {
      changeCountDown();
      hideSector(nextSectorId, totalHideNumber);
      nextSectorId += totalHideNumber;
    }
  }
}
function startTimer() {
  const timerButtonStartEl = document.getElementById("timer_button_start");
  const timerButtonCancelEl = document.getElementById("timer_button_cancel");
  counting = !counting;
  if (counting) {
    timerInterval = setInterval(timer, 1000);
  } else {
    clearInterval(timerInterval);
  }
  timerButtonStartEl.innerHTML = counting ? "PAUSE" : "START";
  timerButtonStartEl.style.backgroundColor = counting ? "#a64359" : "#e94467";
  timerButtonStartEl.style.width = "7rem";
  timerButtonCancelEl.style.display = "block";
}

function resetTimer() {
  const timerButtonStartEl = document.getElementById("timer_button_start");
  const timerButtonCancelEl = document.getElementById("timer_button_cancel");
  const countdownEl = document.getElementById("countdown");
  counting = false;
  clearInterval(timerInterval);
  timerButtonStartEl.innerHTML = "START";
  timerButtonStartEl.style.backgroundColor = "#e94467";
  timerButtonStartEl.style.width = "10rem";
  timerButtonCancelEl.style.display = "none";
  countdownEl.innerHTML = timerDisplay;
  nextSectorId = 0;
  showSectors();
}

function stopTimerAndSwitch() {
  startTimer();
  continueSwitch();
}

function continueSwitch() {
  toggleModal();
  switchPage();
}

function toggleModal() {
  modalShow = !modalShow;
  const modelEl = document.getElementById("modal");
  modelEl.style.display = modalShow ? "flex" : "none";
}

function getTime(id) {
  const date = adjustDate(cityIds[0], id);
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDay();
  const month = date.getMonth();
  return [hours, minutes, seconds, day, month];
}

function adjustDate(local, id) {
  const date = new Date().setHours(
    new Date().getHours() +
      cityTimeOffset[id].offset -
      cityTimeOffset[local].offset
  );
  return new Date(date);
}

function setClock(id) {
  const [hours, minutes, seconds, day, month] = getTime(id);
  setClockTime(id, hours, minutes, seconds);
  setCityAndDate(id, day, month);
}

function setClockTime(id, hours, minutes, seconds) {
  const clockEl = document.getElementById(id);
  clockEl.childNodes[1].style.transform =
    "rotate(" +
    ((hours * 3600 + minutes * 60 + seconds) * (360 / 12)) / 3600 +
    "deg)";
  clockEl.childNodes[3].style.transform =
    "rotate(" +
    (((hours * 3600 + minutes * 60 + seconds) * (360 / 12)) / 3600 + 180) +
    "deg)";
  clockEl.childNodes[5].style.transform =
    "rotate(" + ((minutes * 60 + seconds) * 360) / 3600 + "deg)";
  clockEl.childNodes[7].style.transform =
    "rotate(" + (((minutes * 60 + seconds) * 360) / 3600 + 180) + "deg)";
  clockEl.childNodes[9].style.transform =
    "rotate(" + (seconds * 360) / 60 + "deg)";
  clockEl.childNodes[11].style.transform =
    "rotate(" + ((seconds * 360) / 60 + 180) + "deg)";
  setClockColor(clockEl, hours);
}

function setCityAndDate(id, day, month) {
  const sectionEl = document.getElementById(id + "_section");
  sectionEl.childNodes[3].innerHTML = cityTimeOffset[id].name;
  sectionEl.childNodes[5].innerHTML = day + " " + months[month];
}

function setClockColor(clockEl, hours) {
  const nodesIndexes1 = [1, 3, 5, 7, 9, 11];
  const nodesIndexes2 = [13, 27];
  const isNight = hours > 19 || hours < 7;
  clockEl.classList.add(isNight ? "night_color" : "day_color");
  clockEl.classList.add(isNight ? "clock_night_border_color" : "day_color");
  clockEl.childNodes.forEach((node, index) => {
    if (nodesIndexes1.includes(index)) {
      node.classList.add(isNight ? "day_color" : "night_color");
    }
    if (nodesIndexes2.includes(index)) {
      node.classList.add(isNight ? "night_color" : "day_color");
    }
  });
}

function showSectors() {
  for (let i = 0; i < sectors; i++) {
    let sectorEl = document.getElementById("timer_sector_" + i);
    sectorEl.style.display = "block";
  }
}

function changeCountDown() {
  const countdownEl = document.getElementById("countdown");
  let [hours, minutes, seconds] = countdownEl.innerText.split(":").map(Number);
  if (seconds > 0) {
    seconds--;
  } else {
    seconds = 59;
    if (minutes > 0) {
      minutes--;
    } else {
      minutes = 59;
      if (hours > 0) {
        hours--;
      } else {
        hours = 0;
      }
    }
  }
  countdownEl.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function hideSector(nextSectorId, totalHideNumber) {
  if (nextSectorId + totalHideNumber > sectors) {
    totalHideNumber = sectors - nextSectorId;
  }
  if (nextSectorId <= sectors) {
    for (let i = 0; i < totalHideNumber; i++) {
      let nextSectorEl = document.getElementById(
        "timer_sector_" + (nextSectorId + i)
      );
      nextSectorEl.style.display = "none";
    }
  }
}

function submitTimer(event) {
  event.preventDefault();
  let inputTimerForm = document.querySelector("#input_timer");
  let data = new FormData(inputTimerForm);
  let newTimer = data.get("timer");
  const timerList = newTimer.split(":").map(Number);
  if (
    newTimer == "10:00:00" ||
    (timerList.length == 3 &&
      timerList.every((number) => number >= 0 && number < 60) &&
      timerList[0] < 10)
  ) {
    timerDisplay = newTimer;
    let countdownEl = document.getElementById("countdown");
    countdownEl.innerHTML = newTimer;
    timerSecond = timerList[0] * 3600 + timerList[1] * 60 + timerList[2];
    if (timerSecond < sectors) {
      totalHideNumber = Math.floor(sectors / timerSecond);
    }
    resetTimer();
  }
}

function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}
