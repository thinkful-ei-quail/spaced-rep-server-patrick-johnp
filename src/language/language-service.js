const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getHeadWord(db, language_id) {
    return db
      .from('language')
      .select('head', 'total_score')
      .where({ id: language_id })
      .first()
      .then((res) => {
        return db
          .from('word')
          .select('original', 'correct_count', 'incorrect_count')
          .where({ language_id, id: res.head })
          .first()
          .then((word) => {
            word.totalScore = res.total_score;
            return word;
          });
      });
  },

  getWordsList(db, language_id, list) {
    return db
      .from('word')
      .select('*')
      .where({ language_id })
      .orderBy('id')
      .then((words) => {
        return db('language')
          .select('head')
          .where({ id: language_id })
          .first()
          .then((head) => {
            head = head.head;
            const startIndex = words.findIndex((word) => word.id === head);
            if (startIndex < 0) {
              return list;
            }
            let word = words[startIndex % words.length];
            while (word) {
              list.insertLast(word);
              word = words[(word.next - 1) % words.length];
            }
            return list;
          });
      });
  },

  updateWord(db, id, word) {
    return db('word').where({ id }).update(word);
  },

  updateLanguage(db, id, language) {
    return db('language').where({id}).update(language);
  }
};

module.exports = LanguageService;
