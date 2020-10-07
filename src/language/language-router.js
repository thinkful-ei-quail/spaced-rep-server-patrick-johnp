const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonBodyParser = express.json();
const LinkedList = require('../data_structures/linked-list');
const { listen } = require('../app');
const xss = require('xss');

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const word = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id
    );
    const { original, correct_count, incorrect_count, totalScore } = word;
    res.json({
      nextWord: original,
      totalScore,
      wordCorrectCount: correct_count,
      wordIncorrectCount: incorrect_count,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  let { guess } = req.body;
  if (!guess) {
    return res.status(400).send({ error: `Missing 'guess' in request body` });
  }
  guess = xss(guess);
  guess = guess.toLowerCase();
  try {
    //Create linked list of words
    const words = await LanguageService.getWordsList(req.app.get('db'), req.language.id, new LinkedList());
    const word = words.head.value;
    //Determine right or wrong
    const isCorrect = word.translation === guess;
    if(isCorrect) {
      word.memory_value *= 2;
      word.correct_count++;
      req.language.total_score++;
    }
    else {
      word.memory_value = 1;
      word.incorrect_count++;
    }
    //Shift
    words.remove(word);
    let shiftedSpot = words.head;
    for(let i = 1; i < word.memory_value % words.length(); i++) {
      shiftedSpot = shiftedSpot.next;
    }
    shiftedSpot.value.next = word.id;
    if(!shiftedSpot.next) {
      word.next = null;
    }
    else {
      word.next = shiftedSpot.next.value.id;
    }
    //Persist updated data
    const otherWord = shiftedSpot.value;
    const nextWord = words.head.value;
    req.language.head = nextWord.id;
    await LanguageService.updateWord(req.app.get('db'), word.id, word);
    await LanguageService.updateWord(req.app.get('db'), otherWord.id, otherWord);
    await LanguageService.updateLanguage(req.app.get('db'), req.language.id, req.language);
    res.status(200).json({
      nextWord: nextWord.original,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      totalScore: req.language.total_score,
      answer: word.translation,
      isCorrect
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
