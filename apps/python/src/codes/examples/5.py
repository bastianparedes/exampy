def fn(): # Descomposición y suma de raícez cuadradas
  iteration = 0
  while True:
    iteration += 1
    base = random.choice([2, 3, 5, 6])
    multipliers = [1, 2, 3, 4]
    random.shuffle(multipliers)
    [b1, b2, b3] = multipliers[:3]

    r1 = sympy.sqrt(b1**2 * base, evaluate=False)
    r2 = sympy.sqrt(b2**2 * base, evaluate=False)
    r3 = sympy.sqrt(b3**2 * base, evaluate=False)
    
    expression = sympy.Add(r1, r2, r3, evaluate=False)

    yield {
      'question': f'¿Cuál es el resultado de {Latex.math_mode(expression)}?',
      'alternatives_texts': [
        Latex.math_mode((r1 + r2 + r3).simplify()),
        Latex.math_mode((r1 * r2 * r3).simplify()),
        Latex.math_mode(sympy.sqrt(b1**2 * base + b2**2 * base + b3**2 * base)),
        Latex.math_mode(sympy.Number(b1**2 * base + b2**2 * base + b3**2 * base)),
        Latex.math_mode(sympy.Number(base))
      ],
      'alternatives_identifiers': [
        [str(r1 + r2 + r3)],
        [str(r1 * r2 * r3)],
        [str(sympy.sqrt(b1**2 * base + b2**2 * base + b3**2 * base))],
        [str(b1**2 * base + b2**2 * base + b3**2 * base)],
        [str(base)],
      ],
      'question_identifiers': [base, b1, b2, b3]
    }