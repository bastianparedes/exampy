def fn():# Suma de fracciones
  iteration = 0
  while True:
    iteration += 1

    n1 = sympy.Rational(random.randint(1, 15), random.randint(1, 15))
    n2 = sympy.Rational(random.randint(1, 15), random.randint(1, 15))

    # Obliga que las fracciones tengan distintos denominadores y estos sean distintos de 1
    while not (n1.denominator != n2.denominator and n1.denominator != 1 and n2.denominator != 1):
      n1 = sympy.Rational(random.randint(1, 15), random.randint(1, 15))
      n2 = sympy.Rational(random.randint(1, 15), random.randint(1, 15))

    math_expression = Latex.math_mode(sympy.Add(n1, n2, evaluate=False))

    yield {
      'question': f'¿Cuál es el resultado de {math_expression}?',  # Debe ser string. Es el texto LaTeX que contiene a la pregunta del ejercicio
      'alternatives_texts': [  # Deben ser strings. Son los textos LaTeX que se mostrarán en las alternativas
        Latex.math_mode(n1 + n2),  # Esta debe ser la respuesta correcta
        Latex.math_mode(sympy.Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator)),
        Latex.math_mode(sympy.Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator)),
        Latex.math_mode(sympy.Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator)),
        Latex.math_mode(n1 * n2)
      ],
      'alternatives_identifiers': [  # Deben ser arrays primitivos. Deben representar las 'alternatives_texts'. 'alternatives_texts' y 'alternatives_identifiers' deben tener el mismo largo. Se usa para determinar si hay respuestas repetidas en 'alternatives_texts'
        [(n1 + n2).numerator, (n1 + n2).denominator],
        [sympy.Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator).numerator, sympy.Rational(n1.numerator + n2.denominator, n1.denominator + n2.numerator).denominator],
        [sympy.Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator).numerator, sympy.Rational(n1.denominator + n2.numerator, n1.numerator + n2.denominator).denominator],
        [sympy.Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator).numerator, sympy.Rational(n1.numerator + n2.numerator, n1.denominator + n2.denominator).denominator],
        [(n1 * n2).numerator, (n1 * n2).denominator]
      ],
      'question_identifiers': [  # Deben ser strings o numbers o boolean o null. Se usan para determinar si otro ejercicio tiene la misma 'question' que este
        n1.numerator, n1.denominator, n2.numerator, n2.numerator
      ]
    }
