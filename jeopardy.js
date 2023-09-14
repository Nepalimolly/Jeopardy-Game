let categories = [];

async function getCategoryIds() {
  let response = await axios.get("https://jservice.io/api/categories", {
    params: {
      count: 100,
    },
  });

  let categorieIds = response.data.map((catIds) => catIds.id);

  return _.sampleSize(categorieIds, 6);
}

async function getCategory(catId) {
  let response = await axios.get("https://jservice.io/api/category", {
    params: {
      id: `${catId}`,
    },
  });
  let categories = response.data;
  let everyClue = categories.clues;
  let randomClues = _.sampleSize(everyClue, 5);
  let clues = randomClues.map((clues) => ({
    question: clues.question,
    answer: clues.answer,
    showing: null,
  }));

  return { title: categories.title, clues };

  async function fillTable() {
    $("#game thead").empty();
    let $tr = $("<tr>");
    for (let catIndex = 0; catIndex < 6; catIndex++) {
      $tr.append($("<th>").text(categories[catIndex].title));
    }
    $("#game thead").append($tr);

    $("#game tbody").empty();
    for (let clueIndex = 0; clueIndex < 5; clueIndex++) {
      let $tr = $("<tr>");
      for (let catIndex = 0; catIndex < 6; catIndex++) {
        $tr.append($("<td>").attr("id", `${catIndex}-${clueIndex}`).text("?"));
      }
      $("#game tbody").append($tr);
    }
  }

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

  function showLoadingView() {}

  function hideLoadingView() {}

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
}
