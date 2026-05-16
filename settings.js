/* EXPORT */

document
.getElementById(
  "exportBtn"
)
.addEventListener(
  "click",
  ()=>{

    const backup = {

      plannerData:
        JSON.parse(
          localStorage.getItem(
            "plannerData"
          )
        ) || {},

      prepState:
        JSON.parse(
          localStorage.getItem(
            "prepState"
          )
        ) || {}

    };

    const blob =
      new Blob(

        [
          JSON.stringify(
            backup,
            null,
            2
          )
        ],

        {
          type:
            "application/json"
        }

      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "planner-backup.json";

    a.click();

    URL.revokeObjectURL(
      url
    );

    alert(
      "Backup exported successfully"
    );

  }
);

/* IMPORT */

document
.getElementById(
  "importInput"
)
.addEventListener(
  "change",
  e=>{

    const file =
      e.target.files[0];

    if(!file) return;

    const reader =
      new FileReader();

    reader.onload =
      event=>{

        try{

          const data =
            JSON.parse(
              event.target.result
            );

          localStorage.setItem(
            "plannerData",

            JSON.stringify(
              data.plannerData
              || {}
            )
          );

          localStorage.setItem(
            "prepState",

            JSON.stringify(
              data.prepState
              || {}
            )
          );

          alert(
            "Backup restored successfully"
          );

        }

        catch{

          alert(
            "Invalid backup file"
          );

        }

      };

    reader.readAsText(
      file
    );

  }
);

/* RESET */

document
.getElementById(
  "resetBtn"
)
.addEventListener(
  "click",
  ()=>{

    const confirmReset =
      confirm(
        "Delete all planner data?"
      );

    if(
      !confirmReset
    ){

      return;

    }

    localStorage.clear();

    alert(
      "Planner reset completed"
    );

    location.reload();

  }
);