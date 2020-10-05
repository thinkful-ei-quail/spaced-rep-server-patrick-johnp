const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
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
        'incorrect_count',
      )
      .where({ language_id })
  },

  getHeadWord(db, language_id) {
    return db
    .from('language')
    .select('head', 'total_score')
    .where({id: language_id})
    .first()
    .then((res) => {
      return db
      .from('word')
      .select('original', 'correct_count', 'incorrect_count')
      .where({language_id, id: res.head})
      .first()
      .then(word => {
        word.totalScore = res.total_score;
        return word;
      });
    });
  }
}

module.exports = LanguageService
