def fn():
  iteration = 0
  while True:
    iteration += 1
    # Coeficientes de las ecuaciones
    a = random.randint(-5, 5)
    b = random.randint(-5, 5)
    c = random.randint(-5, 5)
    d = random.randint(-5, 5)
    e = random.randint(-5, 5)
    f = random.randint(-5, 5)

    # Asegurar que el sistema tenga una única solución
    while a*e - b*d == 0:
      a = random.randint(-5, 5)
      b = random.randint(-5, 5)
      c = random.randint(-5, 5)
      d = random.randint(-5, 5)
      e = random.randint(-5, 5)
      f = random.randint(-5, 5)

    # Resolver el sistema de ecuaciones
    x = sympy.Symbol('x')
    y = sympy.Symbol('y')
    solution = sympy.solve((a*x + b*y - c, d*x + e*y - f), (x, y))

    # Extraer las soluciones
    x_solution = solution[x]
    y_solution = solution[y]

    ecuation_1 = sympy.Eq(a*x + b*y, c)
    ecuation_2 = sympy.Eq(d*x + e*y, f)

    return {
      'question': fr'Resuelve el siguiente sistema de ecuaciones:\\{Latex.math_mode(ecuation_1)}\\{Latex.math_mode(ecuation_2)}',
      'alternatives_texts': [
        Latex.math_mode(sympy.Tuple(x_solution, y_solution)),
        Latex.math_mode(sympy.Tuple(-x_solution, y_solution)),
        Latex.math_mode(sympy.Tuple(x_solution, -y_solution)),
        Latex.math_mode(sympy.Tuple(-x_solution, -y_solution)),
        Latex.math_mode(sympy.Tuple(y_solution, x_solution))
      ],
      'alternatives_identifiers': [
        [Latex.math_mode(sympy.Tuple(x_solution, y_solution))],
        [Latex.math_mode(sympy.Tuple(-x_solution, y_solution))],
        [Latex.math_mode(sympy.Tuple(x_solution, -y_solution))],
        [Latex.math_mode(sympy.Tuple(-x_solution, -y_solution))],
        [Latex.math_mode(sympy.Tuple(y_solution, x_solution))]
      ],
      'question_identifiers': [a, b, c, d, e, f]
    }