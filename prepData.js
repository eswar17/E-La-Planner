/* PREPARATION RULES */

const prepRules = [

    /* DAILY PURCHASES */
  
    {
      type:"purchase",
  
      title:"Buy Essentials",
  
      items:[
  
        "Chicken"
  
      ],
  
      frequency:"daily"
    },
  
    /* NIGHT PREP */
  
    {
      type:"prep",
  
      title:"Night Preparation",
  
      items:[
  
        "Marinate chicken",
        "Soak chia, flax seeds, Almonds, Walnuts"
  
      ],
  
      frequency:"daily"
    },

    /* NIGHT PREP */
  
    {
      type:"prep",
  
      title:"Latha Night Preparation",
  
      items:[
  
        "Oats"
  
      ],
  
      days:["Thursday"]
    },
  
  
    /* WEEKLY */
  
    {
      type:"purchase",
  
      title:"Weekly Stock Refill",
  
      items:[
  
        "Vegetables - leafy, curry",
        "Paneer",
        "Soya chunks",
        "Almonds",
        "Flax",
        "Chia",
        "Pumpkin",
        "Sunflower",
        "Walnuts",
        "Curd",
        "Dal"
  
      ],
  
      days:["Sunday"]
    },
  
    {
      type:"purchase",
  
      title:"Egg Restock",
  
      items:[
  
        "1 Egg Tray"
  
      ],
  
      days:[
        "Sunday",
        "Wednesday"
      ]
    },
  
    {
      type:"purchase",
  
      title:"Fruit Refill",
  
      items:[
  
        "Apples",
        "Bananas",
        "Oranges"
  
      ],
  
      days:[
        "Sunday",
        "Tuesday",
        "Friday"
      ]
    },
    {
        type:"purchase",
    
        title:"Latha Special",
    
        items:[
    
          "Mushroom"
    
        ],
    
        days:[
          "Saturday"
        ]
      }
  
  ];