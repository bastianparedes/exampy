def fn(): # ecuación principal de la recta a partir de dos puntos
  iteration = 0
  while True:
    iteration += 1

    while True:
      x1 = random.randint(-10, 10)
      y1 = random.randint(-10, 10)
      x2 = random.randint(-10, 10)
      y2 = random.randint(-10, 10)
      if x1 != x2 and y1 != y2:
        break

    m = Rational(y2 - y1, x2 - x1)
    n = Rational(y1 * (x2 - x1) - x1 * (y2 - y1), x2 - x1)

    point_1 = Tuple(x1, y1)
    point_2 = Tuple(x2, y2)

    x = Symbol('x')
    y = Symbol('y')

    yield {
      'question': f'Determina la ecuación de la recta que pasa por los puntos {Latex.math_mode(point_1)} y {Latex.math_mode(point_2)}.',
      'alternatives_texts': [
        Latex.math_mode(Eq(y, simplify(m*x + n))),
        Latex.math_mode(Eq(y, simplify(m*x - n))),
        Latex.math_mode(Eq(y, simplify(-m*x + n))),
        Latex.math_mode(Eq(y, simplify(-m*x - n))),
        Latex.math_mode(Eq(x, simplify(m*y + n)))
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