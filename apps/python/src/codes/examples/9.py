def fn():
  iteration = 0
  while True:
    iteration += 1
    word = random.choice(['campo','bruma','viento','rapido','sabore','vomito','tunica','formula','docilas','plenito','sandwich','centrado','pintores','nerviosa'])
    word_length = len(word)

    yield {
      'question': f'¿Cuántas palabras de 4 letras se pueden formar con la palabra "{word}"?',
      'alternatives_texts': [
        Latex.math_mode(math.factorial(word_length) // math.factorial(word_length - 4)),
        Latex.math_mode(math.factorial(4)),
        Latex.math_mode(word_length),
        Latex.math_mode(word_length**4),
        Latex.math_mode(math.factorial(word_length))
      ],
      'alternatives_identifiers': [
        [math.factorial(word_length) // math.factorial(word_length - 4)],
        [math.factorial(4)],
        [word_length],
        [word_length**4],
        [math.factorial(word_length)]
      ],
      'question_identifiers': [word]
    }