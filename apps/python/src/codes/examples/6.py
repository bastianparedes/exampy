def fn(): # Factorización de polinomio de grado 2
  iteration = 0
  while True:
    iteration += 1
    a = random.randint(2, 5)
    b = random.randint(1, 5)
    c = random.randint(1, 5)

    x = sympy.Symbol('x')
    expression = sympy.expand(a * (x + b) * (x + c))
    factorized_expression = sympy.factor(expression)

    yield {
      'question': f'Factoriza la siguiente expresión: {Latex.math_mode(expression)}',
      'alternatives_texts': [
        Latex.math_mode(factorized_expression),
        Latex.math_mode(a * (x - b) * (x - c)),
        Latex.math_mode(a * (x + b) * (x - c)),
        Latex.math_mode(a * (x - b) * (x + c)),
        Latex.math_mode(-a * (x + b) * (x + c))
      ],
      'alternatives_identifiers': [
        [a, b, c],
        [a, -b, -c],
        [a, b, -c],
        [a, -b, c],
        [-a, b, c]
      ],
      'question_identifiers': [a, b, c]
    }