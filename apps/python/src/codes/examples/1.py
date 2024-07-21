def fn():# Suma de fracciones
  iteration = 0
  while True:
    iteration += 1

    while True:
      n1 = Rational(random.randint(1, 15), random.randint(1, 15))
      n2 = Rational(random.randint(1, 15), random.randint(1, 15))

      if n1.denominator != n2.denominator and n1.denominator != 1 and n2.denominator != 1:
        break


    math_expression = Latex.math_mode(Add(n1, n2))

    yield {
      'question': f'¿Cuál es el resultado de {math_expression}?',  # Debe ser string. Es el texto LaTeX que contiene a la pregunta del ejercicio
      'alternatives_texts': [  # Deben ser strings. Son los textos LaTeX que se mostrarán en las alternativas
        Latex.math_mode(simplify(n1 + n2)),  # Esta debe ser la respuesta correcta
        Latex.math_mode(Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator)),
        Latex.math_mode(Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator)),
        Latex.math_mode(Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator)),
        Latex.math_mode(simplify(n1 * n2))
      ],
      'alternatives_identifiers': [  # Deben ser arrays primitivos. Deben representar las 'alternatives_texts'. 'alternatives_texts' y 'alternatives_identifiers' deben tener el mismo largo. Se usa para determinar si hay respuestas repetidas en 'alternatives_texts'
        [simplify(n1 + n2).numerator, simplify(n1 + n2).denominator],
        [Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator).numerator, Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator).denominator],
        [Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator).numerator, Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator).denominator],
        [Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator).numerator, Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator).denominator],
        [simplify(n1 * n2).numerator, simplify(n1 * n2).denominator]
      ],
      'question_identifiers': [  # Deben ser strings o numbers o boolean o null. Se usan para determinar si otro ejercicio tiene la misma 'question' que este
        n1.numerator, n1.denominator, n2.numerator, n2.denominator
      ]
    }