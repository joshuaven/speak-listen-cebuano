var sentences = [
  "Maka-istorya ba ka ug English?",
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

function newSentence() {
  var randomNumber = Math.floor(Math.random() * sentences.length);
  document.getElementById("lineDisplay").innerHTML = sentences[randomNumber];
  document.getElementById("lineNumber").innerHTML = randomNumber;
}
