def fn(controled_seed: int = 0, random_seed: int = 0): # Factorización de polinomio de grado 2
  random.seed(controled_seed + random_seed)
  a = random.randint(2, 5)
  b = random.randint(1, 5)
  c = random.randint(1, 5)

  x = sympy.Symbol('x')
  expression = sympy.expand(a * (x + b) * (x + c))
  factorized_expression = sympy.factor(expression)

  return {
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