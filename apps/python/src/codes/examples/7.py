def fn(): # Operaciones con fracciones
  iteration = 0
  while True:
    iteration += 1
    option = (iteration % 2) + 1

    if option == 1:
      f1 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
      f2 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
      f3 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
      f4 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))

      while f1.denominator == 1 or f2.denominator == 1 or f3.denominator == 1 or f4.denominator == 1:
        f1 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
        f2 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
        f3 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))
        f4 = -sympy.Rational(random.randint(2, 6), random.randint(2, 6))

      expression = sympy.Mul(sympy.Add(1, f1, evaluate=False), sympy.Add(1, f2, evaluate=False), sympy.Add(1, f3, evaluate=False), sympy.Add(1, f4, evaluate=False), evaluate=False)

      yield {
        'question': f'¿Cuál es el valor de {Latex.math_mode(expression)}?',
        'alternatives_texts': [
          Latex.math_mode(expression.simplify()),
          Latex.math_mode(f1 * f2 * f3 * f4),
          Latex.math_mode(f1 + f2 + f3 + f4),
          Latex.math_mode(1 + f1),
          Latex.math_mode(sympy.Rational(1+f1.numerator,1+f1.denominator) * sympy.Rational(1+f2.numerator,1+f2.denominator) * sympy.Rational(1+f3.numerator,1+f3.denominator) * sympy.Rational(1+f3.numerator,1+f3.denominator))
        ],
        'alternatives_identifiers': [
          [float(expression)],
          [float(f1 * f2 * f3 * f4)],
          [float(f1 + f2 + f3 + f4)],
          [float(1 + f1)],
          [float(sympy.Rational(1+f1.numerator,1+f1.denominator) * sympy.Rational(1+f2.numerator,1+f2.denominator) * sympy.Rational(1+f3.numerator,1+f3.denominator) * sympy.Rational(1+f3.numerator,1+f3.denominator))]
        ],
        'question_identifiers': [f1.numerator, f1.denominator, f2.numerator, f2.denominator, f3.numerator, f3.denominator, f3.numerator, f3.denominator]
      }
    
    if option == 2:
      f1 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
      f2 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
      f3 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
      f4 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
      f5 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))

      while f1.denominator == 1 or f2.denominator == 1 or f3.denominator == 1 or f4.denominator == 1 or f1 == 0 or f2 == 0 or f3 == 0 or f4 == 0 or (f3 + f4 + f5) == 0:
        f1 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
        f2 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
        f3 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
        f4 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))
        f5 = random.choice([-1, 1]) * sympy.Rational(random.randint(1, 5), random.randint(2, 5))

      expression = sympy.Mul(sympy.Add(f1, f2, evaluate=False), 1 / sympy.Add(f3, f4, f5, evaluate=False), evaluate=False)

      yield {
        'question': f'¿Cuál es el valor de {Latex.math_mode(expression)}?',
        'alternatives_texts': [
          Latex.math_mode(expression.simplify()),
          Latex.math_mode((f1 + f2) * (f3 + f4 + f5)),
          Latex.math_mode(f1 + f2),
          Latex.math_mode(f3 + f4 + f5),
          Latex.math_mode(sympy.Rational(f1.numerator + f2.numerator, f1.denominator + f2.denominator) / sympy.Rational(f3.numerator + f4.numerator + f5.numerator, f3.denominator + f4.denominator + f5.denominator))
        ],
        'alternatives_identifiers': [
          [float(expression)],
          [float((f1 + f2) * (f3 + f4 + f5))],
          [float(f1 + f2)],
          [float(f3 + f4 + f5)],
          [float(sympy.Rational(f1.numerator + f2.numerator, f1.denominator + f2.denominator) / sympy.Rational(f3.numerator + f4.numerator + f5.numerator, f3.denominator + f4.denominator + f5.denominator))]
        ],
        'question_identifiers': [f1.numerator, f1.denominator, f2.numerator, f2.denominator, f3.numerator, f3.denominator, f4.numerator, f4.denominator, f5.numerator, f5.denominator]
      }