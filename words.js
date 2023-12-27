function getReplaceWords(words, characters) {
  var replaceWords = [];
  for (let i = 0; i < words.length; i++) {
    replaceWords.push(words[i].split("").join(characters || '.'));
  }
  return replaceWords;
}

module.exports = {
  getReplaceWords: getReplaceWords
};
