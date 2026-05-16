const habitTable =
  document.getElementById(
    "habitTable"
  );

const weekDatePicker =
  document.getElementById(
    "weekDatePicker"
  );

const monthPicker =
  document.getElementById(
    "monthPicker"
  );

const addHabitBtn =
  document.getElementById(
    "addHabitBtn"
  );

const editHabitBtn =
  document.getElementById(
    "editHabitBtn"
  );

const deleteHabitBtn =
  document.getElementById(
    "deleteHabitBtn"
  );

const confirmDeleteBtn =
  document.getElementById(
    "confirmDeleteBtn"
  );

const saveEditBtn =
  document.getElementById(
    "saveEditBtn"
  );

const deleteSection =
  document.getElementById(
    "deleteSection"
  );

const editSection =
  document.getElementById(
    "editSection"
  );

/* STORAGE */

let habits =
  JSON.parse(
    localStorage.getItem("habits")
  )
  || [];

let plannerData =
  JSON.parse(
    localStorage.getItem("plannerData")
  )
  || {};

let deletedHabits =
  JSON.parse(
    localStorage.getItem(
      "deletedHabits"
    )
  )
  || [];

let editMode = false;
let deleteMode = false;

/* DEFAULT DATES */

weekDatePicker.value =
  dayjs().format("YYYY-MM-DD");

monthPicker.value =
  dayjs().format("YYYY-MM");

/* SAVE */

function saveHabits(){

  localStorage.setItem(
    "habits",
    JSON.stringify(habits)
  );

  localStorage.setItem(
    "deletedHabits",
    JSON.stringify(
      deletedHabits
    )
  );

}

/* MAIN RENDER */

function renderTracker(){

  const isLandscape =
    window.innerWidth >
    window.innerHeight;

  if(isLandscape){

    renderMonthlyTracker();

  }else{

    renderWeeklyTracker();

  }

}

/* WEEKLY */

function renderWeeklyTracker(){

  habitTable.innerHTML = "";

  const selected =
    dayjs(
      weekDatePicker.value
    );

  const start =
    selected.startOf("week");

  let header = `
    <tr>

      <th class="habit-column">
        Habit
      </th>
  `;

  for(let i=0;i<7;i++){

    const day =
      start.add(i,"day");

    header += `
      <th>
        ${day.format("DD")}
        <br>
        ${day.format("ddd")}
      </th>
    `;

  }

  header += "</tr>";

  habitTable.innerHTML += header;

  habits.forEach(habit=>{

    let row = `
      <tr>
    `;

    /* DELETE MODE */

    if(deleteMode){

      row += `
        <td class="habit-column">

          <div
            style="
              display:flex;
              align-items:center;
              gap:6px;
            "
          >

            <input
              type="checkbox"
              class="delete-checkbox"
              data-id="${habit.id}"
            >

            <span>
              ${habit.name}
            </span>

          </div>

        </td>
      `;

    }

    /* EDIT MODE */

    else if(editMode){

      row += `
        <td class="habit-column">

          <input
            type="text"
            class="edit-input"
            data-id="${habit.id}"
            value="${habit.name}"
          >

        </td>
      `;

    }

    /* NORMAL */

    else{

      row += `
        <td class="habit-column">
          ${habit.name}
        </td>
      `;

    }

    /* DAYS */

    for(let i=0;i<7;i++){

      const day =
        start
        .add(i,"day")
        .format("YYYY-MM-DD");

      const completed =
        plannerData[day]
        ?.habits?.[habit.id];

      row += `
        <td>

          <div
            class="
              status-box
              ${completed ? "completed" : ""}
            "
          ></div>

        </td>
      `;

    }

    row += "</tr>";

    habitTable.innerHTML += row;

  });

}

/* MONTHLY */

function renderMonthlyTracker(){

  habitTable.innerHTML = "";

  const selectedMonth =
    dayjs(
      monthPicker.value
    );

  const totalDays =
    selectedMonth.daysInMonth();

  let header = `
    <tr>

      <th class="habit-column">
        Habit
      </th>
  `;

  for(let i=1;i<=totalDays;i++){

    header += `
      <th>
        ${i}
      </th>
    `;

  }

  header += "</tr>";

  habitTable.innerHTML += header;

  habits.forEach(habit=>{

    let row = `
      <tr>

        <td class="habit-column">
          ${habit.name}
        </td>
    `;

    for(let i=1;i<=totalDays;i++){

      const date =
        selectedMonth
        .date(i)
        .format("YYYY-MM-DD");

      const completed =
        plannerData[date]
        ?.habits?.[habit.id];

      row += `
        <td>

          <div
            class="
              status-box
              ${completed ? "completed" : ""}
            "
          ></div>

        </td>
      `;

    }

    row += "</tr>";

    habitTable.innerHTML += row;

  });

}

/* ADD HABIT */

addHabitBtn.addEventListener(
  "click",
  ()=>{

    const name =
      prompt("Habit name");

    if(!name) return;

    habits.push({

      id:
        "habit" + Date.now(),

      name

    });

    saveHabits();

    renderTracker();

  }
);

/* EDIT MODE */

editHabitBtn.addEventListener(
  "click",
  ()=>{

    editMode = !editMode;

    deleteMode = false;

    /* SHOW SAVE */

    editSection.classList.toggle(
      "hidden",
      !editMode
    );

    /* HIDE DELETE SECTION */

    deleteSection.classList.add(
      "hidden"
    );

    /* SHOW DELETE BTN */

    deleteHabitBtn.style.display =
      "block";

    renderTracker();

  }
);

/* SAVE EDIT */

saveEditBtn.addEventListener(
  "click",
  ()=>{

    const inputs =
      document.querySelectorAll(
        ".edit-input"
      );

    inputs.forEach(input=>{

      const habit =
        habits.find(
          h=>h.id === input.dataset.id
        );

      if(habit){

        habit.name =
          input.value.trim();

      }

    });

    saveHabits();

    editMode = false;

    editSection.classList.add(
      "hidden"
    );

    renderTracker();

  }
);

/* DELETE MODE */

deleteHabitBtn.addEventListener(
  "click",
  ()=>{

    deleteMode = !deleteMode;

    editMode = false;

    /* SHOW DELETE SECTION */

    deleteSection.classList.toggle(
      "hidden",
      !deleteMode
    );

    /* HIDE EDIT SECTION */

    editSection.classList.add(
      "hidden"
    );

    /* HIDE DELETE BTN */

    deleteHabitBtn.style.display =
      deleteMode
      ? "none"
      : "block";

    renderTracker();

  }
);

/* CONFIRM DELETE */

confirmDeleteBtn.addEventListener(
  "click",
  ()=>{

    const selected =
      document.querySelectorAll(
        ".delete-checkbox:checked"
      );

    const ids =
      [...selected].map(
        x=>x.dataset.id
      );

    ids.forEach(id=>{

      const habit =
        habits.find(
          h=>h.id === id
        );

      if(habit){

        deletedHabits.push({

          ...habit,

          deletedAt:
            Date.now()

        });

      }

    });

    habits =
      habits.filter(
        h=>!ids.includes(h.id)
      );

    saveHabits();

    deleteMode = false;

    deleteSection.classList.add(
      "hidden"
    );

    /* SHOW DELETE BTN AGAIN */

    deleteHabitBtn.style.display =
      "block";

    renderTracker();

  }
);

/* DATE CHANGES */

weekDatePicker.addEventListener(
  "change",
  renderWeeklyTracker
);

monthPicker.addEventListener(
  "change",
  renderMonthlyTracker
);

/* RESIZE FIX */

let resizeTimeout;

window.addEventListener(
  "resize",
  ()=>{

    clearTimeout(resizeTimeout);

    resizeTimeout =
      setTimeout(()=>{

        /* Prevent rerender while typing */

        const isEditing =
          document.activeElement
          ?.classList
          ?.contains(
            "edit-input"
          );

        if(isEditing) return;

        renderTracker();

      },300);

  }
);

/* INIT */

renderTracker();