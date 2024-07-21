def fn():
  iteration = 0
  while True:
    iteration += 1

    while True:
      # Coeficientes de las ecuaciones
      a = random.randint(-5, 5)
      b = random.randint(-5, 5)
      c = random.randint(-5, 5)
      d = random.randint(-5, 5)
      e = random.randint(-5, 5)
      f = random.randint(-5, 5)

      # Asegurar que el sistema tenga una única solución
      if a*e - b*d != 0:
        break

    # Resolver el sistema de ecuaciones
    x = Symbol('x')
    y = Symbol('y')
    solution = solve((a*x + b*y - c, d*x + e*y - f), (x, y))

    # Extraer las soluciones
    x_solution = solution[x]
    y_solution = solution[y]

    ecuation_1 = Eq(simplify(a*x + b*y), c)
    ecuation_2 = Eq(simplify(d*x + e*y), f)

    yield {
      'question': fr'Resuelve el siguiente sistema de ecuaciones:\\{Latex.math_mode(ecuation_1)}\\{Latex.math_mode(ecuation_2)}',
      'alternatives_texts': [
        Latex.math_mode(simplify(Tuple(x_solution, y_solution))),
        Latex.math_mode(simplify(Tuple(-x_solution, y_solution))),
        Latex.math_mode(simplify(Tuple(x_solution, -y_solution))),
        Latex.math_mode(simplify(Tuple(-x_solution, -y_solution))),
        Latex.math_mode(simplify(Tuple(y_solution, x_solution)))
      ],
      'alternatives_identifiers': [
        [Latex.math_mode(Tuple(x_solution, y_solution))],
        [Latex.math_mode(Tuple(-x_solution, y_solution))],
        [Latex.math_mode(Tuple(x_solution, -y_solution))],
        [Latex.math_mode(Tuple(-x_solution, -y_solution))],
        [Latex.math_mode(Tuple(y_solution, x_solution))]
      ],
      'question_identifiers': [a, b, c, d, e, f]
    }