const tomorrowContainer =
  document.getElementById(
    "tomorrowContainer"
  );

const importantContainer =
  document.getElementById(
    "importantContainer"
  );

const upcomingContainer =
  document.getElementById(
    "upcomingContainer"
  );

const missedContainer =
  document.getElementById(
    "missedContainer"
  );

const prepContainer =
  document.getElementById(
    "prepContainer"
  );

/* MODALS */

const moveModal =
  document.getElementById(
    "moveModal"
  );

const conflictModal =
  document.getElementById(
    "conflictModal"
  );

const moveDate =
  document.getElementById(
    "moveDate"
  );

const moveSlot =
  document.getElementById(
    "moveSlot"
  );

const cancelMoveBtn =
  document.getElementById(
    "cancelMoveBtn"
  );

const confirmMoveBtn =
  document.getElementById(
    "confirmMoveBtn"
  );

const cancelConflictBtn =
  document.getElementById(
    "cancelConflictBtn"
  );

const overwriteBtn =
  document.getElementById(
    "overwriteBtn"
  );

const addBtn =
  document.getElementById(
    "addBtn"
  );

/* TEMP */

let activeMoveTask = null;

/* STORAGE */

let plannerData =
  JSON.parse(
    localStorage.getItem(
      "plannerData"
    )
  ) || {};

/* GET TASKS */

function getTasksByDate(date){

  const data =
    plannerData[date];

  if(
    !data
    ||
    !data.schedule
  ){

    return [];

  }

  const tasks = [];

  Object.keys(data.schedule)
  .forEach(slot=>{

    let slotTasks =
      data.schedule[slot];

    /* OLD STRING */

    if(
      typeof slotTasks ===
      "string"
    ){

      slotTasks = [

        {

          text:slotTasks,

          status:"pending",

          important:false

        }

      ];

    }

    /* OLD OBJECT */

    else if(
      slotTasks
      &&
      !Array.isArray(slotTasks)
    ){

      slotTasks = [

        {

          text:
            slotTasks.text || "",

          status:
            slotTasks.status
            || "pending",

          important:
            slotTasks.important
            || false

        }

      ];

    }

    /* EMPTY */

    if(!slotTasks){

      return;

    }

    /* LOOP TASKS */

    slotTasks.forEach(task=>{

      if(
        !task.text
        ||
        !task.text.trim()
      ){

        return;

      }

      /* SKIP */

      if(

        task.status ===
        "completed"
      
        ||
      
        task.status ===
        "lateCompleted"
      
      ){
      
        return;
      
      }

      tasks.push({

        date,

        slot,

        text:task.text,

        status:task.status,

        important:
          task.important || false,

        taskRef:task

      });

    });

  });

  return tasks;

}

/* PREP TASKS */

function getPrepTasks(){

  const tomorrow =
    dayjs()
    .add(1,"day");

  const tomorrowDay =
    tomorrow.format(
      "dddd"
    );

  const prepTasks = [];

  prepRules.forEach(rule=>{

    /* DAILY */

    if(
      rule.frequency ===
      "daily"
    ){

      prepTasks.push(rule);

      return;

    }

    /* DAYS */

    if(
      rule.days
      &&
      rule.days.includes(
        tomorrowDay
      )
    ){

      prepTasks.push(rule);

    }

  });

  return prepTasks;

}

/* TOMORROW */

function getTomorrowTasks(){

  const tomorrow =
    dayjs()
    .add(1,"day")
    .format("YYYY-MM-DD");

  return getTasksByDate(
    tomorrow
  );

}

/* IMPORTANT */

function getImportantTasks(){

  const today =
    dayjs();

  const important = [];

  Object.keys(plannerData)
  .forEach(date=>{

    if(
      dayjs(date)
      .isAfter(today,"day")
    ){

      const tasks =
        getTasksByDate(date);

      tasks.forEach(task=>{

        if(task.important){

          important.push(task);

        }

      });

    }

  });

  return important;

}

/* UPCOMING */

function getUpcomingTasks(){

  const today =
    dayjs();

  const upcoming = [];

  Object.keys(plannerData)
  .forEach(date=>{

    if(
      dayjs(date)
      .isAfter(today,"day")
    ){

      const tasks =
        getTasksByDate(date);

      tasks.forEach(task=>{

        if(!task.important){

          upcoming.push(task);

        }

      });

    }

  });

  return upcoming;

}

/* MISSED */

function getMissedTasks(){

  const missed = [];

  Object.keys(plannerData)
  .forEach(date=>{

    const data =
      plannerData[date];

    if(
      !data
      ||
      !data.schedule
    ){

      return;

    }

    Object.keys(data.schedule)
    .forEach(slot=>{

      let slotTasks =
        data.schedule[slot];

      /* OLD STRING */

      if(
        typeof slotTasks ===
        "string"
      ){

        slotTasks = [

          {

            text:slotTasks,

            status:"pending",

            important:false

          }

        ];

      }

      /* OLD OBJECT */

      else if(
        slotTasks
        &&
        !Array.isArray(slotTasks)
      ){

        slotTasks = [

          {

            text:
              slotTasks.text || "",

            status:
              slotTasks.status
              || "pending",

            important:
              slotTasks.important
              || false

          }

        ];

      }

      if(!slotTasks){

        return;

      }

      slotTasks.forEach(task=>{

        if(
          !task.text
          ||
          !task.text.trim()
        ){

          return;

        }

        if(

          task.status ===
          "missed"

        ){

          missed.push({

            date,

            slot,

            text:task.text,

            status:task.status,

            important:
              task.important || false,

            taskRef:task

          });

        }

      });

    });

  });

  return missed;

}

/* PREP CHECK */

function isPrepChecked(
  title,
  item
){

  const tomorrow =
    dayjs()
    .add(1,"day")
    .format(
      "YYYY-MM-DD"
    );

  const prepState =
    JSON.parse(
      localStorage.getItem(
        "prepState"
      )
    ) || {};

  return !!prepState[
    `${tomorrow}_${title}_${item}`
  ];

}

/* RENDER PREP */

function renderPrepTasks(){

  prepContainer.innerHTML =
    "";

  const prepTasks =
    getPrepTasks();

  if(
    prepTasks.length === 0
  ){

    prepContainer.innerHTML = `

      <div class="empty-text">
        No preparation tasks
      </div>

    `;

    return;

  }

  prepTasks.forEach(task=>{

    const div =
      document.createElement(
        "div"
      );
  
    div.className =
      "task-item prep-item";
  
    div.innerHTML = `
  
      <div class="prep-icon">
  
        ${
          task.type ===
          "purchase"
  
          ? "🛒"
  
          : "🌙"
        }
  
      </div>
  
      <div class="task-info">
  
        <div class="task-time">
  
          ${task.title}
  
        </div>
  
        <div class="prep-list">

        ${
          task.items
          .map((item,index)=>`
      
            <label
              class="prep-check-row"
            >
      
              <input
                type="checkbox"
      
                class="
                  prep-checkbox
                "
      
                data-title="
                  ${task.title}
                "
      
                data-item="
                  ${item}
                "
      
                ${
                  isPrepChecked(
                    task.title,
                    item
                  )
      
                  ? "checked"
                  : ""
                }
              >
      
              <span
                class="
                  prep-check-text
      
                  ${
                    isPrepChecked(
                      task.title,
                      item
                    )
      
                    ? "checked"
                    : ""
                  }
                "
              >
      
                ${item}
      
              </span>
      
            </label>
      
          `)
          .join("")
        }
      
      </div>
  
      </div>
  
    `;
  
    prepContainer
    .appendChild(div);
  
  });

}

/* PREP EVENTS */

document.addEventListener(
  "change",
  e=>{

    if(
      e.target.classList
      .contains(
        "prep-checkbox"
      )
    ){

      const checkbox =
        e.target;

      const title =
        checkbox.dataset.title;

      const item =
        checkbox.dataset.item;

      const tomorrow =
        dayjs()
        .add(1,"day")
        .format(
          "YYYY-MM-DD"
        );

      const key =
        `${tomorrow}_${title}_${item}`;

      const prepState =
        JSON.parse(
          localStorage.getItem(
            "prepState"
          )
        ) || {};

      prepState[key] =
        checkbox.checked;

      localStorage.setItem(
        "prepState",
        JSON.stringify(
          prepState
        )
      );

      /* TEXT */

      const text =
        checkbox
        .parentElement
        .querySelector(
          ".prep-check-text"
        );

      if(
        checkbox.checked
      ){

        text.classList.add(
          "checked"
        );

      }

      else{

        text.classList.remove(
          "checked"
        );

      }

    }

  }
);

/* RENDER */

function renderTasks(
  container,
  tasks,
  options = {}
){

  const {
    showDate = false,
    important = false,
    missed = false
  } = options;

  container.innerHTML = "";

  if(tasks.length === 0){

    container.innerHTML = `
      <div class="empty-text">
      🌿 Nothing here yet
      </div>
    `;

    return;

  }

  /* SORT */

  tasks.sort((a,b)=>{

    return dayjs(a.date)
    .valueOf()

    -

    dayjs(b.date)
    .valueOf();

  });

  /* GROUP */

  const grouped = {};

  tasks.forEach(task=>{

    if(!grouped[task.date]){

      grouped[task.date] = [];

    }

    grouped[task.date]
    .push(task);

  });

  /* RENDER */

  Object.keys(grouped)
  .forEach(date=>{

    if(showDate){

      const dateHeader =
        document.createElement("div");

      dateHeader.className =
        "group-date";

      dateHeader.innerText =
        dayjs(date)
        .format(
          "DD MMM YYYY"
        );

      container.appendChild(
        dateHeader
      );

    }

    grouped[date]
    .forEach(task=>{

      const div =
        document.createElement("div");

      div.className =
        "task-item";

      if(important){

        div.classList.add(
          "task-important"
        );

      }

      if(missed){

        div.classList.add(
          "task-missed"
        );

      }

      div.innerHTML = `

      <input
        type="checkbox"
        class="task-checkbox"
      >
    
      <div class="task-info">
    
        <div class="task-time">
          ${task.slot}
        </div>
    
        <div class="task-text">
          ${task.text}
        </div>
    
      </div>
    
      ${
        missed
        ? `
          <button
            class="move-btn"
          >
            Move
          </button>
        `
        : ""
      }
    
    `;

      const checkbox =
        div.querySelector(
          ".task-checkbox"
        );

        const moveBtn =
        div.querySelector(
          ".move-btn"
        );
      
        if(moveBtn){

          moveBtn.addEventListener(
            "click",
            ()=>{
        
              activeMoveTask =
                task;
        
              moveDate.value =
                "";
        
              moveSlot.value =
                "";
        
              moveModal
              .classList
              .add("show");
        
            }
          );
        
        } 

      checkbox.addEventListener(
        "change",
        ()=>{
      
          const today =
            dayjs();
      
          const taskDate =
            dayjs(task.date);
      
          if(
            taskDate.isBefore(
              today,
              "day"
            )
          ){
      
            task.taskRef.status =
              "lateCompleted";
      
          }
      
          else{
      
            task.taskRef.status =
              "completed";
      
          }
      
          localStorage.setItem(
            "plannerData",
            JSON.stringify(
              plannerData
            )
          );
      
          renderAll();
      
        }
      );

      container.appendChild(div);

    });

  });

}

/* CANCEL MOVE */

cancelMoveBtn
.addEventListener(
  "click",
  ()=>{

    moveModal
    .classList
    .remove("show");

  }
);

/* CANCEL CONFLICT */

cancelConflictBtn
.addEventListener(
  "click",
  ()=>{

    conflictModal
    .classList
    .remove("show");

  }
);

/* MOVE TASK */

confirmMoveBtn
.addEventListener(
  "click",
  ()=>{

    if(
      !activeMoveTask
    ) return;

    const newDate =
      moveDate.value;

    const newSlot =
      moveSlot.value;

    if(
      !newDate
      ||
      !newSlot
    ){

      return;

    }

    /* CREATE DATE */

    if(
      !plannerData[newDate]
    ){

      plannerData[newDate] = {

        schedule:{},

        habits:{},

        notes:""

      };

    }

    /* CREATE SLOT */

    if(
      !plannerData[newDate]
      .schedule[newSlot]
    ){

      plannerData[newDate]
      .schedule[newSlot] = [];

    }

    let targetTasks =
      plannerData[newDate]
      .schedule[newSlot];

    /* OLD OBJECT */

    if(
      !Array.isArray(
        targetTasks
      )
    ){

      targetTasks = [

        {

          text:
            targetTasks.text || "",

          status:
            targetTasks.status
            || "pending",

          important:
            targetTasks.important
            || false

        }

      ];

      plannerData[newDate]
      .schedule[newSlot] =
        targetTasks;

    }

    /* TASK */

    const movedTask = {

      text:
        activeMoveTask.text,

      status:"pending",

      important:
        activeMoveTask
        .important

    };

    /* EMPTY SLOT */

    if(
      targetTasks.length === 0
    ){

      targetTasks.push(
        movedTask
      );

      activeMoveTask
      .taskRef
      .status =
        "movedForward";

      finishMove();

      return;

    }

    /* SHOW CONFLICT */

    moveModal
    .classList
    .remove("show");

    conflictModal
    .classList
    .add("show");

    /* OVERWRITE */

    overwriteBtn.onclick =
      ()=>{

        plannerData[newDate]
        .schedule[newSlot] = [
          movedTask
        ];

        activeMoveTask
        .taskRef
        .status =
          "movedForward";

        finishMove();

      };

    /* ADD */

    addBtn.onclick =
      ()=>{

        plannerData[newDate]
        .schedule[newSlot]
        .push(movedTask);

        activeMoveTask
        .taskRef
        .status =
          "movedForward";

        finishMove();

      };

  }
);

/* FINISH */

function finishMove(){

  localStorage.setItem(
    "plannerData",
    JSON.stringify(
      plannerData
    )
  );

  moveModal
  .classList
  .remove("show");

  conflictModal
  .classList
  .remove("show");

  activeMoveTask =
    null;

  renderAll();

}

/* RENDER ALL */

function renderAll(){

  renderPrepTasks();

  renderTasks(
    tomorrowContainer,
    getTomorrowTasks()
  );

  renderTasks(
    importantContainer,
    getImportantTasks(),
    {
      showDate:true,
      important:true
    }
  );

  renderTasks(
    upcomingContainer,
    getUpcomingTasks(),
    {
      showDate:true
    }
  );

  renderTasks(
    missedContainer,
    getMissedTasks(),
    {
      showDate:true,
      missed:true
    }
  );

}

/* INIT */

renderAll();