def fn(): # Descomposición y suma de raícez cuadradas
  iteration = 0
  while True:
    iteration += 1
    base = random.choice([2, 3, 5, 6])
    multipliers = [1, 2, 3, 4]
    random.shuffle(multipliers)
    [b1, b2, b3] = multipliers[:3]

    r1 = sqrt(b1**2 * base)
    r2 = sqrt(b2**2 * base)
    r3 = sqrt(b3**2 * base)
    
    expression = Add(r1, r2, r3)

    yield {
      'question': f'¿Cuál es el resultado de {Latex.math_mode(expression)}?',
      'alternatives_texts': [
        Latex.math_mode(simplify(r1 + r2 + r3)),
        Latex.math_mode(simplify(r1 * r2 * r3)),
        Latex.math_mode(simplify(sqrt(b1**2 * base + b2**2 * base + b3**2 * base))),
        Latex.math_mode(simplify(Number(b1**2 * base + b2**2 * base + b3**2 * base))),
        Latex.math_mode(simplify(Number(base)))
      ],
      'alternatives_identifiers': [
        [str(simplify(r1 + r2 + r3))],
        [str(simplify(r1 * r2 * r3))],
        [str(simplify(sqrt(b1**2 * base + b2**2 * base + b3**2 * base)))],
        [str(b1**2 * base + b2**2 * base + b3**2 * base)],
        [str(base)],
      ],
      'question_identifiers': [base, b1, b2, b3]
    }