def fn(controled_seed: int = 0, random_seed: int = 0): # ecuación general de la recta a partir de la principal
  m = random.randint(-5, 5)
  while m == 0:
    m = random.randint(-5, 5)
  n = random.randint(-5, 5)
  while n == 0:
    n = random.randint(-5, 5)

  a = random.randint(2, 5)
  x = sympy.Symbol('x')
  y = sympy.Symbol('y')

  math_expression = Latex.math_mode(sympy.Eq(y, sympy.Rational(m, n) * x + abs(sympy.Rational(m, n)) * a))

  A = m
  B = -n
  C = n * a

  if A < 0:
    A = -A
    B = -B
    C = -C

  return {
    'question': f'Determina la ecuación general de la recta cuya ecuación principal es: {math_expression}',
    'alternatives_texts': [
      Latex.math_mode(sympy.Eq(A*x + B*y + C, 0)),
      Latex.math_mode(sympy.Eq(A*x + B*y - C, 0)),
      Latex.math_mode(sympy.Eq(A*x - B*y + C, 0)),
      Latex.math_mode(sympy.Eq(-A*x + B*y + C, 0)),
      Latex.math_mode(sympy.Eq(B*x + A*y + C, 0)),
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
