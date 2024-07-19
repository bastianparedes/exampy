def fn(controled_seed: int = 0, random_seed: int = 0): # ecuación principal de la recta a partir de dos puntos
  x1 = random.randint(-10, 10)
  y1 = random.randint(-10, 10)
  x2 = random.randint(-10, 10)
  y2 = random.randint(-10, 10)

  while x1 == x2 or y1 == y2:
    x1 = random.randint(-10, 10)
    y1 = random.randint(-10, 10)
    x2 = random.randint(-10, 10)
    y2 = random.randint(-10, 10)

  m = sympy.Rational(y2 - y1, x2 - x1)
  n = sympy.Rational(y1 * (x2 - x1) - x1 * (y2 - y1), x2 - x1)

  point_1 = sympy.Tuple(x1, y1)
  point_2 = sympy.Tuple(x2, y2)

  x = sympy.Symbol('x')
  y = sympy.Symbol('y')
  math_expression = Latex.math_mode(sympy.Eq(y, m * x + n))

  return {
    'question': f'Determina la ecuación de la recta que pasa por los puntos {Latex.math_mode(point_1)} y {Latex.math_mode(point_2)}.',
    'alternatives_texts': [
      Latex.math_mode(sympy.Eq(y, m*x + n)),
      Latex.math_mode(sympy.Eq(y, m*x - n)),
      Latex.math_mode(sympy.Eq(y, -m*x + n)),
      Latex.math_mode(sympy.Eq(y, -m*x - n)),
      Latex.math_mode(sympy.Eq(x, m*y + n))
    ],
    'alternatives_identifiers': [
      [m.numerator, m.denominator, n.numerator, n.denominator],
      [m.numerator, m.denominator, -n.numerator, n.denominator],
      [-m.numerator, m.denominator, n.numerator, n.denominator],
      [-m.numerator, m.denominator, -n.numerator, n.denominator],
      ['x', m.numerator, m.denominator, n.numerator, n.denominator]
    ],
    'question_identifiers': [x1, y1, x2, y2]
  }