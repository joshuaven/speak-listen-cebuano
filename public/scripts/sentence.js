var cebuano = [
  "Maka-istorya ba ka og English?",
  "Asa dapit ang Ayala dire?",
  "Unsa ang jeep sakyan padung sa pier?",
  "Maayong buntag! Kumusta man ka?",
  "Salamat kaayo!",
  "Walay sapayan!",
  "Wa ko kabalo!",
  "Tagpila man kini?",
  "Palihug hinay-hinaya pagsulti",
  "Mangaon ta ninyo!"
];

function displaySentence(lineNumber) {
  document.getElementById("lineDisplay").innerHTML = cebuano[lineNumber];
  document.getElementById("english").innerHTML = english[lineNumber];
  return {
    cebuano: cebuano[lineNumber],
    english: english[lineNumber]
  }
}
var english = [
  "Can you speak in English?",
  "Where is Ayala located?",
  "Which jeepney should I ride to get to the pier?",
  "Good Morning! How are you?",
  "Thank you very much!",
  "You're welcome!",
  "I don't know!",
  "How much is this?",
  "Please speak slowly",
  "Let's eat!"
];

function newSentence() {
  var randomNumber = Math.floor(Math.random() * cebuano.length);
  document.getElementById("lineDisplay").innerHTML = cebuano[randomNumber];
  document.getElementById("lineNumber").innerHTML = randomNumber;
  document.getElementById("english").innerHTML =
    "Translation: " + english[randomNumber];
}
