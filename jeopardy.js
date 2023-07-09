// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  // This returns me an array of 100 total categories (maximum category limit)
  let response = await axios.get("https://jservice.io/api/categories", {
    params: {
      count: 100,
    },
  });
  ////////////////////////////////////////////////////////////////////////
  //
  // This loops through each array using map function to return just the id's in the array
  let categorieIds = response.data.map((catIds) => catIds.id);
  ////////////////////////////////////////////////////////////////////////
  //
  // This was in the loadash documentation, will pick 6 random id's from the array we pass through
  return _.sampleSize(categorieIds, 6);
  ////////////////////////////////////////////////////////////////////////////////
  //
  //   console.log(response);
  //   console.log(categorieIds);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  // creating a get request to the API to gather information based the paticular category id we pass in
  let response = await axios.get("https://jservice.io/api/category", {
    params: {
      id: `${catId}`,
    },
  });
  // set categories to equal the information (id, title and clues)
  let categories = response.data;
  // set everyClue to equal every clue info (id, answer and question)
  let everyClue = categories.clues;
  // used _.sampleSize to grab 5 random clues from every clue info
  let randomClues = _.sampleSize(everyClue, 5);
  // used map to loop through the sampled randomClues and return an object with question, answer & showing
  let clues = randomClues.map((clues) => ({
    question: clues.question,
    answer: clues.answer,
    showing: null,
  }));

  // returns the title and the 5 random clues for that category

  return { title: categories.title, clues };
  // console.log(response);
  // console.log(categories);
  // console.log(everyClue);
  // console.log(randomClues);
  // console.log(clues);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  //This is to add the categories into the table headers
  $("#game thead").empty();
  //creating a table row element
  let $tr = $("<tr>");
  for (let catIndex = 0; catIndex < 6; catIndex++) {
    $tr.append($("<th>").text(categories[catIndex].title));
  }
  $("#game thead").append($tr);

  // Adding rows with questions for each catergory
  $("#game tbody").empty();
  for (let clueIndex = 0; clueIndex < 5; clueIndex++) {
    let $tr = $("<tr>");
    for (let catIndex = 0; catIndex < 6; catIndex++) {
      $tr.append($("<td>").attr("id", `${catIndex}-${clueIndex}`).text("?"));
    }
    $("#game tbody").append($tr);
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let id = evt.target.id;
  console.log(evt);
  let [catIndex, clueIndex] = id.split("-");
  let clue = categories[catIndex].clues[clueIndex];

  let msg;

  if (!clue.showing) {
    msg = clue.question;
    clue.showing = "question";
  } else if (clue.showing === "question") {
    msg = clue.answer;
    clue.showing = "answer";
  } else {
    return;
  }

  $(`#${catIndex}-${clueIndex}`).html(msg);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  let catIndexs = await getCategoryIds();

  categories = [];

  for (let catIndex of catIndexs) {
    categories.push(await getCategory(catIndex));
  }
  fillTable();
}
$("#reset").on("click", setupAndStart);

$(async function () {
  setupAndStart();
  $("#game").on("click", "td", handleClick);
});
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
