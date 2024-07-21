def fn(): # ecuación general de la recta a partir de la principal
  iteration = 0
  while True:
    iteration += 1

    while True:
      m = random.randint(-5, 5)
      n = random.randint(-5, 5)
      if m != 0 and n != 0:
        break

    a = random.randint(2, 5)
    x = Symbol('x')
    y = Symbol('y')

    math_expression = Latex.math_mode(Eq(y, simplify(Rational(m, n) * x + abs(Rational(m, n)) * a)))

    A = m
    B = -n
    C = n * a

    if A < 0:
      A = -A
      B = -B
      C = -C

    yield {
      'question': f'Determina la ecuación general de la recta cuya ecuación principal es: {math_expression}',
      'alternatives_texts': [
        Latex.math_mode(Eq(Add(A*x, B*y, C), 0)),
        Latex.math_mode(Eq(Add(A*x, B*y, - C), 0)),
        Latex.math_mode(Eq(Add(A*x, - B*y, C), 0)),
        Latex.math_mode(Eq(Add(-A*x, B*y, C), 0)),
        Latex.math_mode(Eq(Add(B*x, A*y, C), 0)),
      ],
      'alternatives_identifiers': [
        [A, B, C],
        [A, B, -C],
        [A, -B, C],
        [-A, B, C],
        [B, A, C]
      ],
      'question_identifiers': [m, n, a]
    }