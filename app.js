/* ===================================================== */
/* ELEMENTS */
/* ===================================================== */

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

const cards =
  document.querySelectorAll(
    ".content-card"
  );

const mainContent =
  document.querySelector(
    ".main-content"
  );

/* ===================================================== */
/* PANEL STATE */
/* ===================================================== */

let activePanel = null;

/* ===================================================== */
/* DATE */
/* ===================================================== */

selectedDate.value =
  dayjs().format(
    "YYYY-MM-DD"
  );

/* ===================================================== */
/* STORAGE */
/* ===================================================== */

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

/* ===================================================== */
/* TIME SLOTS */
/* ===================================================== */

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

/* ===================================================== */
/* PANEL ENGINE */
/* ===================================================== */

function closeAllPanels(){

  cards.forEach(card=>{

    card.classList.remove(
      "active-card"
    );

    const body =
      card.querySelector(
        ".card-body"
      );

    body.classList.remove(
      "open"
    );

    const toggle =
      card.querySelector(
        ".card-toggle"
      );

    toggle.innerText = "+";

  });

  mainContent.classList.remove(
    "panel-active"
  );

  activePanel = null;

}

function openPanel(card){

  closeAllPanels();

  mainContent.classList.add(
    "panel-active"
  );

  card.classList.add(
    "active-card"
  );

  const body =
    card.querySelector(
      ".card-body"
    );

  body.classList.add(
    "open"
  );

  const toggle =
    card.querySelector(
      ".card-toggle"
    );

  toggle.innerText = "×";

  activePanel =
    card.dataset.panel;

}

function initPanels(){

  cards.forEach(card=>{

    const header =
      card.querySelector(
        ".card-header"
      );

    header.addEventListener(
      "click",
      ()=>{

        const alreadyOpen =
          card.classList.contains(
            "active-card"
          );

        if(alreadyOpen){

          closeAllPanels();

        }else{

          openPanel(card);

        }

      }
    );

  });

}

/* ===================================================== */
/* DATE DATA */
/* ===================================================== */

function getCurrentDateData(){

  const date =
    selectedDate.value;

  /* CREATE */

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

/* TASK MIGRATION */

Object.keys(
  plannerData[date]
  .schedule
).forEach(slot=>{

  let tasks =
    plannerData[date]
    .schedule[slot];

  /* OLD STRING */

  if(
    typeof tasks ===
    "string"
  ){

    plannerData[date]
    .schedule[slot] = [

      {

        text:tasks,

        status:"pending",

        important:false

      }

    ];

  }

  /* OLD OBJECT */

  else if(
    tasks
    &&
    !Array.isArray(tasks)
  ){

    plannerData[date]
    .schedule[slot] = [

      {

        text:
          tasks.text || "",

        status:
          tasks.status
          || "pending",

        important:
          tasks.important
          || false

      }

    ];

  }

  /* EMPTY */

  else if(!tasks){

    plannerData[date]
    .schedule[slot] = [];

  }

  /* TASK SAFETY */

  plannerData[date]
  .schedule[slot]
  .forEach(task=>{

    if(
      task.status ===
      undefined
    ){

      task.status =
        "pending";

    }

    if(
      task.important ===
      undefined
    ){

      task.important =
        false;

    }

  });

});

  return plannerData[date];

}

/* ===================================================== */
/* SAVE */
/* ===================================================== */

function saveData(){

  localStorage.setItem(
    "plannerData",
    JSON.stringify(
      plannerData
    )
  );

}

/* ===================================================== */
/* CALENDAR */
/* ===================================================== */

calendarBtn.addEventListener(
  "click",
  ()=>{

    selectedDate.showPicker();

  }
);

selectedDate.addEventListener(
  "change",
  ()=>{

    renderAll();

  }
);

/* ===================================================== */
/* WEEK STRIP */
/* ===================================================== */

function renderWeekStrip(){

  weekStrip.innerHTML = "";

  const selected =
    dayjs(
      selectedDate.value
    );

  const start =
    selected.startOf(
      "week"
    );

  for(let i=0;i<7;i++){

    const currentDay =
      start.add(i,"day");

    const div =
      document.createElement(
        "div"
      );

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

      <p>
        ${currentDay.format("DD")}
      </p>

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

/* ===================================================== */
/* SCHEDULE */
/* ===================================================== */

function renderSchedule(){

  scheduleContainer.innerHTML =
    "";

  const currentData =
    getCurrentDateData();

  const today =
    dayjs().format(
      "YYYY-MM-DD"
    );

  const selected =
    selectedDate.value;

  const isPastDate =
    dayjs(selected)
    .isBefore(
      today,
      "day"
    );

  timeSlots.forEach(slot=>{

    let tasks =
      currentData
      .schedule[slot];

    /* EMPTY */

    if(!tasks){

      tasks = [];

      currentData
      .schedule[slot] = tasks;

    }

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "schedule-item";

    /* ====================================== */
    /* TASKS HTML */
    /* ====================================== */

    let tasksHTML = "";

    tasks.forEach(
      (task,index)=>{

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

        tasksHTML += `

          <div
            class="task-card"
          >

            <input
              type="checkbox"

              class="
                task-checkbox
              "

              data-index="${index}"

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

              data-index="${index}"
            >

              ★

            </button>

            <input
              type="text"

              class="
                task-input
                ${statusClass}
              "

              data-index="${index}"

              placeholder="
                Task...
              "

              value="${task.text}"
            >

            <button
              class="
                delete-task-btn
              "

              data-index="${index}"
            >

              ×

            </button>

          </div>

        `;

      }
    );

    row.innerHTML = `

      <div class="time-label">

        ${slot}

      </div>

      <div class="slot-content">

        <div
          class="
            tasks-container
          "
        >

          ${tasksHTML}

        </div>

        <button
          class="
            add-task-btn
          "
        >

          + Add Task

        </button>

      </div>

    `;

    /* ====================================== */
    /* ADD TASK */
    /* ====================================== */

    const addTaskBtn =
      row.querySelector(
        ".add-task-btn"
      );

    addTaskBtn.addEventListener(
      "click",
      ()=>{

        tasks.push({

          text:"",

          status:"pending",

          important:false

        });

        saveData();

        renderSchedule();

      }
    );

    /* ====================================== */
    /* TEXT INPUT */
    /* ====================================== */

    row.querySelectorAll(
      ".task-input"
    ).forEach(input=>{

      input.addEventListener(
        "input",
        e=>{

          const index =
            e.target.dataset.index;

          tasks[index].text =
            e.target.value;

          saveData();

        }
      );

    });

    /* ====================================== */
    /* CHECKBOX */
    /* ====================================== */

    row.querySelectorAll(
      ".task-checkbox"
    ).forEach(checkbox=>{

      checkbox.addEventListener(
        "change",
        e=>{

          const index =
            e.target.dataset.index;

          const task =
            tasks[index];

          if(e.target.checked){

            if(
              task.status ===
              "missed"
            ){

              task.status =
                "lateCompleted";

            }

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

    });

    /* ====================================== */
    /* IMPORTANT */
    /* ====================================== */

    row.querySelectorAll(
      ".important-btn"
    ).forEach(button=>{

      button.addEventListener(
        "click",
        e=>{

          const index =
            e.target.dataset.index;

          tasks[index]
          .important =

            !tasks[index]
            .important;

          saveData();

          renderSchedule();

        }
      );

    });

    /* ====================================== */
    /* DELETE */
    /* ====================================== */

    row.querySelectorAll(
      ".delete-task-btn"
    ).forEach(button=>{

      button.addEventListener(
        "click",
        e=>{

          const index =
            e.target.dataset.index;

          tasks.splice(
            index,
            1
          );

          saveData();

          renderSchedule();

        }
      );

    });

    scheduleContainer
    .appendChild(row);

  });

}

/* ===================================================== */
/* STATUS ENGINE */
/* ===================================================== */

function updateTaskStatuses(){

  const today =
    dayjs();

  Object.keys(plannerData)
  .forEach(date=>{

    /* ONLY PAST DATES */

    if(
      dayjs(date)
      .isBefore(
        today,
        "day"
      )
    ){

      const schedule =
        plannerData[date]
        ?.schedule;

      if(!schedule) return;

      Object.keys(schedule)
      .forEach(slot=>{

        let tasks =
          schedule[slot];

        /* OLD STRING */

        if(
          typeof tasks ===
          "string"
        ){

          tasks = [

            {

              text:tasks,

              status:"pending",

              important:false

            }

          ];

          schedule[slot] =
            tasks;

        }

        /* OLD OBJECT */

        else if(
          tasks
          &&
          !Array.isArray(tasks)
        ){

          tasks = [

            {

              text:
                tasks.text || "",

              status:
                tasks.status
                || "pending",

              important:
                tasks.important
                || false

            }

          ];

          schedule[slot] =
            tasks;

        }

        if(!tasks) return;

        /* LOOP TASKS */

        tasks.forEach(task=>{

          if(

            task.text
            ?.trim()

            &&

            task.status ===
            "pending"

          ){

            task.status =
              "missed";

          }

        });

      });

    }

  });

  saveData();

}

/* ===================================================== */
/* HABITS */
/* ===================================================== */

function renderHabits(){

  habitContainer.innerHTML =
    "";

  const currentData =
    getCurrentDateData();

  habits.forEach(habit=>{

    const checked =
      currentData
      .habits[habit.id];

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "habit-row";

    row.innerHTML = `

      <input
        type="checkbox"

        ${
          checked
          ? "checked"
          : ""
        }
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

/* ===================================================== */
/* NOTES */
/* ===================================================== */

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

/* ===================================================== */
/* RENDER */
/* ===================================================== */

function renderAll(){

  renderWeekStrip();

  renderSchedule();

  renderHabits();

  renderNotes();

}

/* ===================================================== */
/* INIT */
/* ===================================================== */

updateTaskStatuses();

renderAll();

initPanels();