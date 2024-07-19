def fn():
  iteration = 0
  while True:
    iteration += 1
    a = random.randint(-5, 5)
    while a == 0:
      a = random.randint(-5, 5)

    b = random.randint(-10, 10)
    c = random.randint(-10, 10)

    xv = sympy.Rational(-b, 2 * a)
    yv = sympy.Rational(-(b**2) + 4 * a * c, 4 * a)

    x = sympy.symbols('x')
    f = sympy.Function('f')(x)

    yield {
      'question': f'¿Cuál es el vértice de la función {Latex.math_mode(sympy.Eq(f, a *x**2 + b*x + c))}?',
      'alternatives_texts': [
        Latex.math_mode(sympy.Tuple(xv, yv)),
        Latex.math_mode(sympy.Tuple(xv, -yv)),
        Latex.math_mode(sympy.Tuple(-xv, yv)),
        Latex.math_mode(sympy.Tuple(-xv, -yv)),
        Latex.math_mode(sympy.Tuple(-b, c)),
      ],
      'alternatives_identifiers': [
        [xv.numerator, xv.numerator, yv.denominator, yv.numerator],
        [xv.denominator, xv.numerator, -yv.denominator, yv.numerator],
        [-xv.denominator, xv.numerator, yv.denominator, yv.numerator],
        [-xv.denominator, xv.numerator, -yv.denominator, yv.numerator],
        [-b, c]
      ],
      'question_identifiers': [a, b, c]
    }