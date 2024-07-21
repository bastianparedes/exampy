def fn():
  iteration = 0
  while True:
    iteration += 1

    while True:
      a = random.randint(-5, 5)
      if a != 0:
        break

    b = random.randint(-10, 10)
    c = random.randint(-10, 10)

    xv = Rational(-b, 2 * a)
    yv = Rational(-(b**2) + 4 * a * c, 4 * a)

    x = symbols('x')
    f = Function('f')(x)

    yield {
      'question': f'¿Cuál es el vértice de la función {Latex.math_mode(simplify(Eq(f, a *x**2 + b*x + c)))}?',
      'alternatives_texts': [
        Latex.math_mode(Tuple(xv, yv)),
        Latex.math_mode(Tuple(xv, -yv)),
        Latex.math_mode(Tuple(-xv, yv)),
        Latex.math_mode(Tuple(-xv, -yv)),
        Latex.math_mode(Tuple(-b, c)),
      ],
      'alternatives_identifiers': [
        [Latex.math_mode(Tuple(xv, yv))],
        [Latex.math_mode(Tuple(xv, -yv))],
        [Latex.math_mode(Tuple(-xv, yv))],
        [Latex.math_mode(Tuple(-xv, -yv))],
        [Latex.math_mode(Tuple(-b, c))],
      ],
      'question_identifiers': [a, b, c]
    }