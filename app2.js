const selectedDate =
  document.getElementById(
    "selectedDate"
  );

const calendarBtn =
  document.getElementById(
    "calendarBtn"
  );

const weekStrip =
  document.getElementById(
    "weekStrip"
  );

const scheduleContainer =
  document.getElementById(
    "scheduleContainer"
  );

const habitContainer =
  document.getElementById(
    "habitContainer"
  );

const notesInput =
  document.getElementById(
    "notesInput"
  );

/* DATE */

selectedDate.value =
  dayjs().format("YYYY-MM-DD");

/* STORAGE */

let plannerData =
  JSON.parse(
    localStorage.getItem(
      "plannerData"
    )
  ) || {};

let habits =
  JSON.parse(
    localStorage.getItem(
      "habits"
    )
  )
  || [
    {
      id:"habit1",
      name:"Workout"
    },
    {
      id:"habit2",
      name:"Meditation"
    },
    {
      id:"habit3",
      name:"Water 3L"
    },
    {
      id:"habit4",
      name:"No Sugar"
    }
  ];

/* TIME SLOTS */

const timeSlots = [

  "6-7 AM",
  "7-8 AM",
  "8-9 AM",
  "9-10 AM",
  "10-11 AM",

  "11-12 PM",
  "12-1 PM",
  "1-2 PM",
  "2-3 PM",

  "3-4 PM",
  "4-5 PM",
  "5-6 PM",

  "6-7 PM",
  "7-8 PM",
  "8-9 PM"

];

/* DATE DATA */

function getCurrentDateData(){

  const date =
    selectedDate.value;

  /* CREATE DATE */

  if(!plannerData[date]){

    plannerData[date] = {

      schedule:{},

      habits:{},

      notes:""

    };

  }

  /* SAFETY */

  if(
    !plannerData[date]
    .schedule
  ){

    plannerData[date]
    .schedule = {};

  }

  if(
    !plannerData[date]
    .habits
  ){

    plannerData[date]
    .habits = {};

  }

  /* HABITS INIT */

  habits.forEach(habit=>{

    if(
      plannerData[date]
      .habits[habit.id]
      === undefined
    ){

      plannerData[date]
      .habits[habit.id] = false;

    }

  });

  /* TASK MIGRATION */

  Object.keys(
    plannerData[date]
    .schedule
  ).forEach(slot=>{

    let task =
      plannerData[date]
      .schedule[slot];

    /* OLD STRING */

    if(
      typeof task ===
      "string"
    ){

      plannerData[date]
      .schedule[slot] = {

        text:task,

        status:"pending",

        important:false

      };

    }

    /* EMPTY */

    else if(!task){

      plannerData[date]
      .schedule[slot] = {

        text:"",

        status:"pending",

        important:false

      };

    }

    /* IMPORTANT SAFETY */

    task =
      plannerData[date]
      .schedule[slot];

    if(
      task.important ===
      undefined
    ){

      task.important = false;

    }

  });

  return plannerData[date];

}

/* SAVE */

function saveData(){

  localStorage.setItem(
    "plannerData",
    JSON.stringify(plannerData)
  );

}

/* CALENDAR */

calendarBtn.addEventListener(
  "click",
  ()=>{

    selectedDate.showPicker();

  }
);

selectedDate.addEventListener(
  "change",
  renderAll
);

/* WEEK STRIP */

function renderWeekStrip(){

  weekStrip.innerHTML = "";

  const selected =
    dayjs(selectedDate.value);

  const start =
    selected.startOf("week");

  for(let i=0;i<7;i++){

    const currentDay =
      start.add(i,"day");

    const div =
      document.createElement("div");

    div.className =
      "day-box";

    if(
      currentDay.format(
        "YYYY-MM-DD"
      )
      ===
      selected.format(
        "YYYY-MM-DD"
      )
    ){

      div.classList.add(
        "active"
      );

    }

    div.innerHTML = `
      <span>
        ${currentDay
          .format("ddd")
          .toUpperCase()}
      </span>

      <strong>
        ${currentDay.format("DD")}
      </strong>
    `;

    div.addEventListener(
      "click",
      ()=>{

        selectedDate.value =
          currentDay.format(
            "YYYY-MM-DD"
          );

        renderAll();

      }
    );

    weekStrip.appendChild(div);

  }

}

/* SCHEDULE */

function renderSchedule(){

  scheduleContainer.innerHTML = "";

  const currentData =
    getCurrentDateData();

  const today =
    dayjs().format("YYYY-MM-DD");

  const selected =
    selectedDate.value;

  const isPastDate =
    dayjs(selected)
    .isBefore(today,"day");

  timeSlots.forEach(slot=>{

    let task =
      currentData
      .schedule[slot];

    /* EMPTY */

    if(!task){

      task = {

        text:"",

        status:"pending",

        important:false

      };

      currentData
      .schedule[slot] = task;

    }

    /* STATUS CLASS */

    let statusClass = "";

    if(
      task.status ===
      "completed"
    ){
    
      statusClass =
        "task-completed";
    
    }
    
    else if(
      task.status ===
      "missed"
    ){
    
      statusClass =
        "task-missed";
    
    }
    
    else if(
      task.status ===
      "lateCompleted"
    ){
    
      statusClass =
        "task-late";
    
    }
    
    else if(
      task.status ===
      "movedForward"
    ){
    
      statusClass =
        "task-moved";
    
    }

    const row =
      document.createElement("div");

    row.className =
      "schedule-item";

    row.innerHTML = `

      <div class="time-label">
        ${slot}
      </div>

      <div class="task-area">

        <input
          type="checkbox"
          class="task-checkbox"

          ${
            task.status ===
            "completed"

            ||

            task.status ===
            "lateCompleted"

            ? "checked"
            : ""
          }

          ${
            isPastDate
            ? "disabled"
            : ""
          }
        >

        <button
          class="
            important-btn
            ${
              task.important
              ? "important-active"
              : ""
            }
          "
        >
          ★
        </button>

        <input
          type="text"
          class="
            task-input
            ${statusClass}
          "

          placeholder="Task..."

          value="${task.text}"
        >

      </div>

    `;

    const textInput =
      row.querySelector(
        ".task-input"
      );

    const checkbox =
      row.querySelector(
        ".task-checkbox"
      );

    const importantBtn =
      row.querySelector(
        ".important-btn"
      );

    /* TEXT */

    textInput.addEventListener(
      "input",
      e=>{

        task.text =
          e.target.value;

        saveData();

      }
    );

    /* CHECKBOX */

    checkbox.addEventListener(
      "change",
      e=>{

        if(e.target.checked){

          /* MISSED */

          if(
            task.status ===
            "missed"
          ){

            task.status =
              "lateCompleted";

          }

          /* NORMAL */

          else{

            task.status =
              "completed";

          }

        }else{

          task.status =
            "pending";

        }

        saveData();

        renderSchedule();

      }
    );

    /* IMPORTANT */

    importantBtn.addEventListener(
      "click",
      ()=>{

        task.important =
          !task.important;

        saveData();

        renderSchedule();

      }
    );

    scheduleContainer
    .appendChild(row);

  });

}

function updateTaskStatuses(){

  const today =
    dayjs();

  Object.keys(plannerData)
  .forEach(date=>{

    /* ONLY PAST DATES */

    if(
      dayjs(date)
      .isBefore(today,"day")
    ){

      const schedule =
        plannerData[date]
        ?.schedule;

      if(!schedule) return;

      Object.keys(schedule)
      .forEach(slot=>{

        let task =
          schedule[slot];

        /* OLD DATA MIGRATION */

        if(
          typeof task === "string"
        ){

          task = {

            text:task,

            status:"pending"

          };

          schedule[slot] = task;

        }

        /* AUTO MISSED */

        if(
          task.text?.trim()
          &&
          task.status ===
          "pending"
        ){

          task.status =
            "missed";

        }

      });

    }

  });

  saveData();

}
/* HABITS */

function renderHabits(){

  habitContainer.innerHTML = "";

  const currentData =
    getCurrentDateData();

  habits.forEach(habit=>{

    const checked =
      currentData
      .habits[habit.id];

    const row =
      document.createElement("div");

    row.className =
      "habit-row";

    row.innerHTML = `
      <input
        type="checkbox"
        ${checked ? "checked" : ""}
      >

      <label>
        ${habit.name}
      </label>
    `;

    const checkbox =
      row.querySelector(
        "input"
      );

    checkbox.addEventListener(
      "change",
      e=>{

        currentData
        .habits[habit.id] =
          e.target.checked;

        saveData();

      }
    );

    habitContainer
      .appendChild(row);

  });

}

/* NOTES */

function renderNotes(){

  const currentData =
    getCurrentDateData();

  notesInput.value =
    currentData.notes || "";

}

notesInput.addEventListener(
  "input",
  e=>{

    const currentData =
      getCurrentDateData();

    currentData.notes =
      e.target.value;

    saveData();

  }
);

/* RENDER */

function renderAll(){

  renderWeekStrip();

  renderSchedule();

  renderHabits();

  renderNotes();

}

/* INIT */

updateTaskStatuses();

renderAll();