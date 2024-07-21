def fn(): # Operaciones con fracciones
  iteration = 0
  while True:
    iteration += 1
    option = (iteration % 2) + 1

    if option == 1:
      while True:
        f1 = simplify(-Rational(random.randint(2, 6), random.randint(2, 6)))
        f2 = simplify(-Rational(random.randint(2, 6), random.randint(2, 6)))
        f3 = simplify(-Rational(random.randint(2, 6), random.randint(2, 6)))
        f4 = simplify(-Rational(random.randint(2, 6), random.randint(2, 6)))
        if f1.denominator != 1 and f2.denominator != 1 and f3.denominator != 1 and f4.denominator != 1:
          break

      expression = Mul(Add(1, f1), Add(1, f2), Add(1, f3), Add(1, f4))

      yield {
        'question': f'¿Cuál es el valor de {Latex.math_mode(expression)}?',
        'alternatives_texts': [
          Latex.math_mode(simplify(expression)),
          Latex.math_mode(simplify(f1 * f2 * f3 * f4)),
          Latex.math_mode(simplify(f1 + f2 + f3 + f4)),
          Latex.math_mode(simplify(1 + f1)),
          Latex.math_mode(simplify(Rational(1+f1.numerator,1+f1.denominator) * Rational(1+f2.numerator,1+f2.denominator) * Rational(1+f3.numerator,1+f3.denominator) * Rational(1+f3.numerator,1+f3.denominator)))
        ],
        'alternatives_identifiers': [
          [float(expression)],
          [float(f1 * f2 * f3 * f4)],
          [float(f1 + f2 + f3 + f4)],
          [float(1 + f1)],
          [float(Rational(1+f1.numerator,1+f1.denominator) * Rational(1+f2.numerator,1+f2.denominator) * Rational(1+f3.numerator,1+f3.denominator) * Rational(1+f3.numerator,1+f3.denominator))]
        ],
        'question_identifiers': [f1.numerator, f1.denominator, f2.numerator, f2.denominator, f3.numerator, f3.denominator, f3.numerator, f3.denominator]
      }
    
    if option == 2:
      while True:
        f1 = simplify(random.choice([-1, 1]) * Rational(random.randint(1, 5), random.randint(2, 5)))
        f2 = simplify(random.choice([-1, 1]) * Rational(random.randint(1, 5), random.randint(2, 5)))
        f3 = simplify(random.choice([-1, 1]) * Rational(random.randint(1, 5), random.randint(2, 5)))
        f4 = simplify(random.choice([-1, 1]) * Rational(random.randint(1, 5), random.randint(2, 5)))
        f5 = simplify(random.choice([-1, 1]) * Rational(random.randint(1, 5), random.randint(2, 5)))
        if f1.denominator != 1 and f2.denominator != 1 and f3.denominator != 1 and f4.denominator != 1 and f1 != 0 and f2 != 0 and f3 != 0 and f4 != 0 and (f3 + f4 + f5) != 0:
          break

      expression = Add(f1, f2) / Add(f3, f4, f5)

      yield {
        'question': f'¿Cuál es el valor de {Latex.math_mode(expression)}?',
        'alternatives_texts': [
          Latex.math_mode(simplify(expression)),
          Latex.math_mode(simplify((f1 + f2) * (f3 + f4 + f5))),
          Latex.math_mode(simplify(f1 + f2)),
          Latex.math_mode(simplify(f3 + f4 + f5)),
          Latex.math_mode(simplify(Rational(f1.numerator + f2.numerator, f1.denominator + f2.denominator) / Rational(f3.numerator + f4.numerator + f5.numerator, f3.denominator + f4.denominator + f5.denominator)))
        ],
        'alternatives_identifiers': [
          [float(expression)],
          [float((f1 + f2) * (f3 + f4 + f5))],
          [float(f1 + f2)],
          [float(f3 + f4 + f5)],
          [float(Rational(f1.numerator + f2.numerator, f1.denominator + f2.denominator) / Rational(f3.numerator + f4.numerator + f5.numerator, f3.denominator + f4.denominator + f5.denominator))]
        ],
        'question_identifiers': [f1.numerator, f1.denominator, f2.numerator, f2.denominator, f3.numerator, f3.denominator, f4.numerator, f4.denominator, f5.numerator, f5.denominator]
      }