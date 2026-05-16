const searchInput =
  document.getElementById(
    "searchInput"
  );

const resultsContainer =
  document.getElementById(
    "resultsContainer"
  );

/* STORAGE */

let plannerData =
  JSON.parse(
    localStorage.getItem(
      "plannerData"
    )
  ) || {};

/* SEARCH */

function searchPlanner(query){

  resultsContainer.innerHTML = "";

  if(!query.trim()){

    resultsContainer.innerHTML = `

      <div class="empty-state">
        Start searching...
      </div>

    `;

    return;

  }

  query =
    query.toLowerCase();

  const results = [];

  Object.keys(plannerData)
  .forEach(date=>{

    const data =
      plannerData[date];

    /* TASKS */

/* TASKS */

if(data.schedule){

  Object.keys(data.schedule)
  .forEach(slot=>{

    let tasks =
      data.schedule[slot];

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

    }

    /* EMPTY */

    if(!tasks) return;

    /* LOOP TASKS */

    tasks.forEach(task=>{

      if(
        !task.text
      ) return;

      if(
        task.text
        .toLowerCase()
        .includes(query)
      ){

        results.push({

          type:"task",

          date,

          slot,

          text:task.text,

          status:
            task.status,

          important:
            task.important

        });

      }

    });

  });

}

    /* NOTES */

    if(
      data.notes
      &&
      data.notes
      .toLowerCase()
      .includes(query)
    ){

      results.push({

        type:"note",

        date,

        text:data.notes

      });

    }

  });

  /* SORT */

  results.sort((a,b)=>{

    return dayjs(b.date)
    .valueOf()

    -

    dayjs(a.date)
    .valueOf();

  });

  /* EMPTY */

  if(results.length === 0){

    resultsContainer.innerHTML = `

      <div class="empty-state">
      🔍 No matching tasks found
      </div>

    `;

    return;

  }

  /* RENDER */

  results.forEach(result=>{

    const card =
      document.createElement("div");

    card.className =
      "result-card";

    let statusClass = "";

    if(result.important){

      statusClass =
        "result-important";

    }

    if(
      result.status ===
      "missed"
    ){

      statusClass =
        "result-missed";

    }

    if(
      result.status ===
      "completed"
    ){

      statusClass =
        "result-completed";

    }

    if(
      result.status ===
      "lateCompleted"
    ){

      statusClass =
        "result-late";

    }

    /* NOTE */

    if(
      result.type ===
      "note"
    ){

      card.innerHTML = `

        <div class="result-date">
          ${dayjs(result.date)
            .format("DD MMM YYYY")}
        </div>

        <div class="result-task">

          <div class="result-time">
            Notes
          </div>

          <div class="result-text">
            ${result.text}
          </div>

        </div>

      `;

    }

    /* TASK */

    else{

      card.innerHTML = `

        <div class="result-date">
          ${dayjs(result.date)
            .format("DD MMM YYYY")}
        </div>

        <div class="result-task ${statusClass}">

          <div class="result-time">
            ${result.slot}
          </div>

          <div class="result-text">
            ${result.text}
          </div>

        </div>

      `;

    }

    resultsContainer
    .appendChild(card);

  });

}

/* INPUT */

searchInput.addEventListener(
  "input",
  e=>{

    searchPlanner(
      e.target.value
    );

  }
);