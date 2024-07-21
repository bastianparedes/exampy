def fn(): # Factorización de polinomio de grado 2
  iteration = 0
  while True:
    iteration += 1
    a = random.randint(2, 5)
    b = random.randint(1, 5)
    c = random.randint(1, 5)

    x = Symbol('x')
    expression = expand(a * (x + b) * (x + c))

    yield {
      'question': f'Factoriza la siguiente expresión: {Latex.math_mode(expression)}',
      'alternatives_texts': [
        Latex.math_mode(factor(expression)),
        Latex.math_mode(factor(a * (x - b) * (x - c))),
        Latex.math_mode(factor(a * (x + b) * (x - c))),
        Latex.math_mode(factor(a * (x - b) * (x + c))),
        Latex.math_mode(factor(-a * (x + b) * (x + c)))
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