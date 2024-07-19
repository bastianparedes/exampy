import math
import typing
import abc
import random
import copy
import fractions
import sympy


class Latex:
  def math_mode(expresion: str): return f'$ {expresion} $'
  def root(subradical: str, index: str): return fr'\sqrt[{index}]{subradical}'
  def fraction(numerator: typing.Union[str, int, float], denominator: typing.Union[str, int, float]): return fr' \dfrac{{{numerator}}}{{{denominator}}} '
  def overline(element: typing.Union[str, int, float]): return fr' \overline{{{element}}} '
  def parenthesis(expression): return fr' \left( {expression} \right) '
  def brackets(expression): return fr' \left[ {expression} \right] '
  def degree(): return r' \degree '
  def leq(): return r' \leq '
  def geq(): return r' \geq '
  def different(): return r' \neq '
  def percentage(): return r' \% '
  def alpha(): return r' \alpha '
  def beta(): return r' \beta '
  def gamma(): return r' \gamma '
  def infty(): return r' \infty '
  def pi(): return r'\pi'
  def nabla(): return r'\nabla'
  def triangle(): return r'\triangle'
  def square(): return r'\square'
  def leftarrow(): return r'\leftarrow'
  def rightarrow(): return r'\rightarrow'
  def uparrow(): return r'\uparrow'
  def downarrow(): return r'\downarrow'
  def leftrightarrow(): return r'\leftrightarrow'
  def Leftarrow(): return r'\Leftarrow'
  def Rightarrow(): return r'\Rightarrow'
  def Uparrow(): return r'\Uparrow'
  def Downarrow(): return r'\Downarrow'
  def Updownarrow(): return r'\Updownarrow'
  def space(): return r'\ '
  def line_break(): return r' \hfill \break '
  def power(base, exponent): return fr'{{{base}}}^{{{exponent}}}'


class Numeric(abc.ABC):

  @abc.abstractmethod
  def __init__(self) -> None: pass

  @abc.abstractmethod
  def simplify(self) -> typing.Self: pass

  @abc.abstractmethod
  def __copy__(self) -> typing.Self: pass

  @abc.abstractmethod
  def __deepcopy__(self) -> typing.Self: pass

  @abc.abstractmethod
  def __add__(self, other):
    raise TypeError(f'unsupported operand type(s) for +: {type(self)} and {type(other)}')

  @abc.abstractmethod
  def __mul__(self, other):
    raise TypeError(f'unsupported operand type(s) for *: {type(self)} and {type(other)}')

  @abc.abstractmethod
  def __truediv__(self, other):
    raise TypeError(f'unsupported operand type(s) for /: {type(self)} and {type(other)}')

  @abc.abstractmethod
  def __pow__(self, other):
    raise TypeError(f'unsupported operand type(s) for **: {type(self)} and {type(other)}')

  @abc.abstractmethod
  def __rpow__(self, other):
    raise TypeError(f'unsupported operand type(s) for **: {type(self)} and {type(other)}')

  @abc.abstractmethod
  def __neg__(self):
    raise TypeError(f'bad operand type for unary -: {self}')

  @abc.abstractmethod
  def __abs__(self) -> typing.Self:
    raise TypeError(f'bad operand type for abs(): {self}')

  @abc.abstractmethod
  def __str__(self) -> str:
    raise TypeError(f'bad operand type for str(): {self}')

  @abc.abstractmethod
  def __round__(self, n=0) -> float:
    raise TypeError(f'bad operand type for round(): {self}')

  @abc.abstractmethod
  def __lt__(self, other) -> bool:
    raise TypeError(f'< not supported between instances of {self} and {other}')

  @abc.abstractmethod
  def __eq__(self, other) -> bool:
    raise TypeError(f'== not supported between instances of {self} and {other}')

  @abc.abstractmethod
  def __gt__(self, other) -> bool:
    raise TypeError(f'> not supported between instances of {self} and {other}')

  @abc.abstractmethod
  def __float__(self) -> float: pass

  def __sub__(self, other):
    return self + (-other)

  def __radd__(self, other):
    return self + other

  def __rsub__(self, other):
    return -self + other

  def __rmul__(self, other):
    return self * other

  def __rtruediv__(self, other):
    if self == 0:
      raise Exception(f'Can not divide {type(other)} by {type(self)} equal Zero')
    return other * self ** (-1)


class Literal(abc.ABC):
  @abc.abstractmethod
  def __init__(self) -> None: pass

  @abc.abstractmethod
  def simplify(self) -> typing.Self: pass

  @abc.abstractmethod
  def __copy__(self) -> typing.Self: pass

  @abc.abstractmethod
  def __deepcopy__(self) -> typing.Self: pass

  @abc.abstractmethod
  def __str__(self) -> str: pass

  def __sub__(self, other):
    return self + (-other)

  def __radd__(self, other):
    return self + other

  def __rsub__(self, other):
    return -self + other

  def __rmul__(self, other):
    return self * other

  def __rtruediv__(self, other):
    if self == 0:
      raise Exception(f'Can not divide {type(other)} by {type(self)} equal Zero')
    return other * self ** (-1)


class Natural(Numeric):
  """
    self.number: int
    self.dividers: List[int]
    self.is_prime: bool
    self.is_perfect: bool
  """

  def __init__(self, number: int):
    if not isinstance(number, int):
      raise Exception(f'number in {type(self)} must be intenger')
    if not number > 0:
      raise Exception(f'number in {type(self)} must be greater than zero')

    self.number = number
    self.is_even = self.number % 2 == 0
    self.is_odd = self.number % 2 == 1
    self.dividers = self.get_dividers()
    self.is_prime = self.get_is_prime()
    self.is_perfect = self.get_is_perfect()

  def simplify(self):
    return Natural(self.number)

  def __copy__(self) -> typing.Self:
    return Natural(copy.copy(self.number))

  def __deepcopy__(self, memo) -> typing.Self:
    if id(self) in memo:
      return memo[id(self)]

    self_copy = Natural(copy.deepcopy(self.number))
    memo[id(self)] = self_copy

    return self_copy

  def get_dividers(self):
    self.dividers = []
    number = 1
    while (number <= self.number):
      if (self.number % number == 0):
        self.dividers.append(number)
      number += 1

    return self.dividers

  def get_is_prime(self):
    self.is_prime = len(self.get_dividers()) == 2
    return self.is_prime

  def get_is_perfect(self):
    self.is_perfect = sum(self.get_dividers()) / 2 == self.number
    return self.is_perfect

  def __add__(self, other):
    if isinstance(other, int):
      return Natural(self.number + other)
    if isinstance(other, float):
      return Rational(self.number, 1) + Rational.from_float(other)
    if isinstance(other, (Rational)):
      return Rational(self.number, 1) + other
    if isinstance(other, (Natural)):
      return Natural(self.number + other.number)
    return super().__add__(other)

  def __mul__(self, other):
    if isinstance(other, int):
      return Natural(int(self) * other)
    if isinstance(other, float):
      return Rational(self.number, 1) * Rational.from_float(other)
    if isinstance(other, (Rational)):
      return Rational(self.number, 1) * other
    if isinstance(other, Natural):
      return Natural(int(self) * int(other))
    return super().__mul__(other)

  def __truediv__(self, other):
    if (other == 0):
      raise Exception('Can not divide {type(self)} by Zero')
    if isinstance(other, int):
      return Rational(int(self), other).simplify()
    if isinstance(other, float):
      return Rational(self.number, 1) / Rational.from_float(other)
    if isinstance(other, (Rational)):
      return Rational(self.number, 1) / other
    if isinstance(other, Natural):
      return Rational(int(self), int(other)).simplify()
    return super().__truediv__(other)

  def __pow__(self, other):
    if isinstance(other, (int)):
      if other > 0:
        return Natural(int(self) ** other)

      if other == 0:
        if self == 0:
          raise Exception(f'Can not raise {type(self)} equals Zero to Zero')
        return Natural(1)

      # 0 ^ (-*)
      if self == 0:
        raise Exception(f'Can not raise {type(self)} equals Zero to negative number')
      return Rational(1, int(self) * abs(other))

    if isinstance(other, (Natural)):
      if other > 0:
        return Natural(int(self) ** int(other))

      if other == 0:
        if self == 0:
          raise Exception(f'Can not raise {type(self)} equals Zero to Zero')
        return Natural(1)

      # 0 ^ (-*)
      if self == 0:
        raise Exception(f'Can not raise {type(self)} equals Zero to negative number')
      return Rational(1, int(self) * abs(int(other)))

    return super().__pow__(other)

  def __rpow__(self, other): return other ** int(self)

  def __neg__(self):
    rational = Rational(-int(self), 1)
    rational.simplify()
    return rational

  def __abs__(self): return self

  def __str__(self) -> str: return str(int(self.number))

  def __round__(self, n=0): return round(self.number, n)

  def __lt__(self, other) -> bool:
    if isinstance(other, (int, float)):
      return int(self) < other
    if isinstance(other, Rational):
      return int(self) * other.denominator < other.numerator
    if isinstance(other, Natural):
      return int(self) < int(other)

    return super().__lt__(other)

  def __eq__(self, other) -> bool:
    if isinstance(other, (int, float)):
      return int(self) == other
    if isinstance(other, Rational):
      return int(self) * other.denominator == other.numerator
    if isinstance(other, Natural):
      return int(self) == int(other)

    return super().__eq__(other)

  def __gt__(self, other) -> bool:
    if isinstance(other, (int, float)):
      return int(self) > other
    if isinstance(other, Rational):
      return int(self) * other.denominator > other.numerator
    if isinstance(other, Natural):
      return int(self) > int(other)

    return super().__gt__(other)

  def __float__(self): return float(int(self))


class Rational(Numeric):
  '''
    numerator: int
    denominator: int
    is_simplified: bool
    is_decimal_loaded: bool
    integer_part: None | int
    non_periodic_decimal_part: None | str
    periodic_decimal_part: None | str
  '''

  def from_float(number: float):
    multiplier = 1 if number >= 0 else -1
    # Aquí se amplifica el numerator y el denomiandor para quitar los decimales
    numerator = str(abs(float(number)))
    denominator = str(float(1))
    while numerator[numerator.index('.'):] != '.0':
      numerator = numerator[:numerator.index('.')] + numerator[numerator.index('.') + 1:numerator.index('.') + 2] + '.' + numerator[numerator.index('.') + 2:]
      if numerator[-1] == '.':
        numerator += '0'
      denominator = denominator[:denominator.index('.')] + denominator[denominator.index('.') + 1:denominator.index('.') + 2] + '.' + denominator[denominator.index('.') + 2:]
      if denominator[-1] == '.':
        denominator += '0'
    numerator = int(float(numerator))
    denominator = int(float(denominator))
    return Rational(multiplier * numerator, denominator)


  def __init__(self, numerator: int, denominator: int):
    if denominator == 0:
      raise Exception('Denominator can not be Zero')
    self.numerator = numerator
    self.denominator = denominator
    self.is_simplified = False
    self.is_decimal_loaded = False
    self.integer_part = None
    self.non_periodic_decimal_part = None
    self.periodic_decimal_part = None

  def __copy__(self) -> typing.Self:
    return Rational(self.numerator, self.denominator)

  def __deepcopy__(self, memo) -> typing.Self:
    if id(self) in memo:
      return memo[id(self)]

    self_copy = Rational(copy.deepcopy(self.numerator), copy.deepcopy(self.denominator))
    memo[id(self)] = self_copy

    return self_copy

  def simplify(self):
    if not self.is_simplified:
      self.is_simplified = True
      fraction = fractions.Fraction(self.numerator, self.denominator)
      self.numerator = fraction.numerator
      self.denominator = fraction.denominator

    return self

  def load_decimal(self):
    if not self.is_decimal_loaded:
      self.is_decimal_loaded = True

      helper = Rational(self.numerator, self.denominator).simplify()
      numerator = helper.numerator
      denominator = helper.denominator

      # Aquí se calcula el múltiplo. self.multiplo
      multiple = 9
      while multiple % denominator != 0:
        multiple = str(multiple)
        if multiple.count('9') == 1:
          multiple = multiple.replace('0', '9')
          multiple += '9'
        else:
          lista = []
          for digito in multiple:
            lista.append(digito)
          lista[lista.count('9') - 1] = '0'
          multiple = ''
          for digito in lista:
            multiple += digito
        multiple = int(multiple)
      self.multiple = str(multiple)

      self.integer_part = int(numerator // denominator)
      self.non_periodic_decimal_part = None
      self.periodic_decimal_part = None

      # Aquí se calcula la def parte decimal no periodica
      if str(multiple).count('0') != 0:
        non_periodic_decimal_part = str(int((abs(numerator) % denominator) * multiple / denominator / int(str(multiple).replace('0', ''))))
        for i in range(0, str(multiple).count('0') - len(non_periodic_decimal_part)):
          non_periodic_decimal_part = '0' + non_periodic_decimal_part
      else:
        non_periodic_decimal_part = ''
      self.non_periodic_decimal_part = non_periodic_decimal_part

      # Aquí se calcula la parte decimal periódica
      periodic_decimal_part = str(int(((abs(numerator) % denominator) * multiple / denominator) % int(str(multiple).replace('0', ''))))
      if periodic_decimal_part == '0':
        periodic_decimal_part = ''
      else:
        for _ in range(0, str(multiple).count('9') - len(periodic_decimal_part)):
          periodic_decimal_part = '0' + periodic_decimal_part
      self.periodic_decimal_part = periodic_decimal_part

    return self

  def get_numerator(self): return self.numerator

  def get_denominator(self): return self.denominator

  def get_integer_part(self): return self.integer_part

  def __add__(self, other):
    if isinstance(other, (int)):
      return self + Rational(other, 1)
    if isinstance(other, (float)):
      return self + Rational.from_float(other)
    if isinstance(other, Rational):
      self_helper = Rational(self.numerator, self.denominator).simplify()
      other_helper = Rational(other.numerator, other.denominator).simplify()
      result = Rational(self_helper.numerator * other_helper.denominator + other_helper.numerator * self_helper.denominator, self_helper.denominator * other_helper.denominator).simplify()
      return result

    return super().__add__(other)

  def __mul__(self, other):
    if isinstance(other, (int)):
      return self * Rational(other, 1)
    if isinstance(other, (float)):
      return self * Rational.from_float(other)
    if isinstance(other, Rational):
      self_helper = Rational(self.numerator, self.denominator).simplify()
      other_helper = Rational(other.numerator, other.denominator).simplify()
      result = Rational(self_helper.numerator * other_helper.numerator, self_helper.denominator * other_helper.denominator).simplify()
      return result
    return super().__mul__(other)

  def __truediv__(self, other):
    if (other == 0):
      raise Exception(f'Can not divide {type(self)} by Zero')

    if isinstance(other, (int)):
      return self / Rational(other, 1)
    if isinstance(other, (float)):
      return self / Rational.from_float(other)
    if isinstance(other, Rational):
      self_helper = Rational(self.numerator, self.denominator).simplify()
      other_helper = Rational(other.numerator, other.denominator).simplify()
      result = Rational(self_helper.numerator * other_helper.denominator, self_helper.denominator * other_helper.numerator).simplify()
      return result

    return super().__truediv__(other)

  def __pow__(self, other):
    if isinstance(other, (int)):
      if other > 0:
        self_helper = Rational(self.numerator, self.denominator).simplify()
        return Rational(self_helper.numerator ** other, self_helper.denominator ** other).simplify()

      if other == 0:
        if self == 0:
          raise Exception(f'Can not raise {type(self)} equals Zero to Zero')
        return Rational(1, 1).simplify()

      # 0 ^ (-*)
      if self == 0:
        raise Exception(f'Can not raise {type(self)} equals Zero to negative number')

      self_helper = Rational(self.numerator, self.denominator).simplify()
      result = Rational(self_helper.denominator ** abs(other), self_helper.numerator ** abs(other)).simplify()
      return result

    return super().__pow__(other)

  def __rpow__(self, other):
    helper = Rational(self.get_numerator(), self.get_denominator()).simplify()
    if (helper.get_denominator() == 1):
      return other ** self.get_numerator()
    raise Exception(f'Can not raise {type(other)} to Rational')

  def __neg__(self): return Rational(-self.numerator, self.denominator)

  def __abs__(self): return Rational(abs(self.numerator), abs(self.denominator))

  def __str__(self):
    if self.is_decimal_loaded:
      if not isinstance(self.integer_part, int):
        raise Exception(f'integer_part in {type(self)} is None when triyng to get string')
      if not isinstance(self.non_periodic_decimal_part, str):
        raise Exception(f'non_periodic_decimal_part in {type(self)} is not str when triyng to get string')
      if not isinstance(self.periodic_decimal_part, str):
        raise Exception(f'periodic_decimal_part in {type(self)} is not str when triyng to get string')

      if self.non_periodic_decimal_part == self.periodic_decimal_part == '':
        return str(self.integer_part)
      if self.non_periodic_decimal_part == '':
        return str(self.integer_part) + ',' + Latex.overline(self.periodic_decimal_part)
      if self.periodic_decimal_part == '':
        return str(self.integer_part) + ',' + self.non_periodic_decimal_part
      return str(self.integer_part) + ',' + self.non_periodic_decimal_part + Latex.overline(self.periodic_decimal_part)

    if (self.is_simplified):
      sign = '-' if float(self) < 0 else ''
      if self.denominator == 1:
        return str(self.numerator)
      return sign + Latex.fraction(abs(self.numerator), abs(self.denominator))

    return Latex.fraction(self.numerator, self.denominator)

  def __round__(self, n=0): return round(float(self), n)

  def __lt__(self, other):
    if isinstance(other, (int)):
      return self < Rational(other, 1)
    if isinstance(other, (float)):
      return self < Rational.from_float(other)
    if isinstance(other, Rational):
      return self.numerator * other.denominator < other.numerator * self.denominator

    return super().__lt__(other)

  def __eq__(self, other):
    if isinstance(other, (int)):
      return self == Rational(other, 1)
    if isinstance(other, (float)):
      return self == Rational.from_float(other)
    if isinstance(other, Rational):
      return self.numerator * other.denominator == other.numerator * self.denominator

    return super().__eq__(other)

  def __gt__(self, other):
    if isinstance(other, (int)):
      return self > Rational(other, 1)
    if isinstance(other, (float)):
      return self > Rational.from_float(other)
    if isinstance(other, Rational):
      return self.numerator * other.denominator > other.numerator * self.denominator

    return super().__gt__(other)

  def __int__(self): return int(self.numerator / self.denominator)

  def __float__(self): return float(self.numerator / self.denominator)


class Trigonometric_function(Numeric):
  """
    self.fn_name: str
    self.degrees: int
    self.radians: int
  """

  def __init__(self, degrees: typing.Union[int, float], fn_name: str):
    self.valid_fn_names = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot']

    if not isinstance(degrees, (int, float)):
      raise Exception(f'degrees in {type(self)} must be intenger or float')

    if fn_name not in self.valid_fn_names:
      raise Exception(f'fn_name in {type(self)} must be one of {self.valid_fn_names}')

    self.fn_name = fn_name
    self.degrees = degrees
    self.radians = math.radians(degrees)

  def __copy__(self):
    return Trigonometric_function(self.degrees, self.fn_name)

  def __deepcopy__(self, memo):
    if id(self) in memo:
      return memo[id(self)]

    self_copy = Trigonometric_function(copy.deepcopy(self.degrees), copy.deepcopy(self.fn_name))
    memo[id(self)] = self_copy

    return self_copy

  def get_degrees(self): return self.degrees

  def get_radians(self): return self.radians

  def __add__(self, other): return float(self) + other

  def __mul__(self, other): return float(self) * other

  def __truediv__(self, other):
    if (other == 0):
      raise Exception(f'Can not divide {type(self)} function by Zero')
    return float(self) / other

  def __pow__(self, other):
    if self == 0 and other <= 0:
      raise Exception(f'Can not raise {type(self)} equals to Zero to lower or equals than Zero')
    return float(self) ** other

  def __rpow__(self, other): return other ** float(self)

  def __neg__(self):
    pass

  def __abs__(self): return self

  def __str__(self) -> str:
    if self.fn_name == 'sin':
      return fr'sin({self.degrees}\degree)'

    if self.fn_name == 'cos':
      return fr'cos({self.degrees}\degree)'

    if self.fn_name == 'cos':
      return fr'tan({self.degrees}\degree)'

    if self.fn_name == 'csc':
      return fr'csc({self.degrees}\degree)'

    if self.fn_name == 'sec':
      return fr'sec({self.degrees}\degree)'

    if self.fn_name == 'cot':
      return fr'cot({self.degrees}\degree)'

    raise Exception(f'fn_name in {type(self)} must be one of {self.valid_fn_names}')

  def __round__(self, n=0): return round(float(self, n))

  def __lt__(self, other) -> bool: return float(self) < float(other)

  def __eq__(self, other) -> bool: return float(self) == float(other)

  def __gt__(self, other) -> bool: return float(self) > float(other)

  def __int__(self): return int(float(self))

  def __float__(self):
    if self.fn_name == 'sin':
      return math.sin(self.radians)

    if self.fn_name == 'cos':
      return math.cos(self.radians)

    if self.fn_name == 'cos':
      return math.tan(self.radians)

    if self.fn_name == 'csc':
      return 1 / math.sin(self.radians)

    if self.fn_name == 'sec':
      return 1 / math.cos(self.radians)

    if self.fn_name == 'cot':
      return 1 / math.tan(self.radians)

    raise Exception(f'fn_name in {type(self)} must be one of {self.valid_fn_names}')


class Log(Numeric):
  pass


class Dot():
  """
    self.coordinates: List[Numeric]
    self.magnitude: float
  """

  def __init__(self, coordinates: typing.List[typing.Union[int, float, Numeric]]) -> None:
    self.is_simplified = False
    if len(coordinates) == 0:
      raise Exception("Dot's coordinates must not be empty")

    copy_coordinates = copy.deepcopy(coordinates)
    for index in range(len(copy_coordinates)):
      coordinate = copy_coordinates[index]
      if isinstance(coordinate, (int)):
        copy_coordinates[index] = Rational(coordinate, 1).simplify()
        continue
      if isinstance(coordinate, (float)):
        copy_coordinates[index] = Rational.from_float(coordinate).simplify()
        continue
    self.coordinates: typing.List[Numeric] = copy_coordinates

    magnitude = 0
    for index in range(len(self.coordinates)):
      magnitude += coordinate ** 2
    self.magnitude = math.sqrt(magnitude)

  def simplify(self) -> typing.Self:
    self.is_simplified = True
    for index in range(len(self.coordinates)):
      self.coordinates[index] = self.coordinates[index].simplify()
    return self

  def __copy__(self) -> typing.Self:
    coordinates = copy.copy(self.coordinates)
    return Dot(coordinates)

  def __deepcopy__(self) -> typing.Self:
    coordinates = copy.deepcopy(self.coordinates)
    return Dot(coordinates)

  def __add__(self, other):
    self_copy = copy.deepcopy(self).simplify()
    other_copy = copy.deepcopy(other)
    if isinstance(other, (Dot)):
      other_copy = other_copy.simplify()
      max_len = max(len(self_copy), len(other_copy))
      self_copy.extend([0] * (max_len - len(self_copy)))
      other_copy.extend([0] * (max_len - len(other_copy)))
      result_coordinates: typing.List[Numeric] = [self_copy[index] + other_copy[index] for index in range(max_len)]
    
      return Dot(result_coordinates).simplify()
    return super().__add__(other)

  def __mul__(self, other):
    self_copy = copy.deepcopy(self).simplify()
    other_copy = copy.deepcopy(other)
    if isinstance(other, (int, float, Numeric)):
      for index in range(len(self_copy.coordinates)):
        self_copy.coordinates[index] = (self_copy.coordinates[index] * other_copy).simplify()
      return Dot(self_copy.coordinates)
    return super().__mul__(other)

  def __truediv__(self, other):
    self_copy = copy.deepcopy(self).simplify()
    other_copy = copy.deepcopy(other)
    if isinstance(other, (int, float, Numeric)):
      for index in range(len(self_copy.coordinates)):
        self_copy.coordinates[index] = (self_copy.coordinates[index] / other_copy).simplify()
      return Dot(self_copy.coordinates)
    return super().__truediv__(other)

  def __neg__(self):
    self_copy = copy.deepcopy(self).simplify()
    for index in range(len(self_copy.coordinates)):
      self_copy.coordinates[index] = (-self_copy.coordinates[index]).simplify()
    return Dot(self_copy.coordinates)

  def __abs__(self):
    return self.magnitude

  def __str__(self):
    return Latex.parenthesis(', '.join([str(coordinate) for coordinate in self.coordinates]))

  def __sub__(self, other):
    return self + (-other)

  def __radd__(self, other):
    return self + other

  def __rsub__(self, other):
    return -self + other

  def __rmul__(self, other):
    return self * other



class Term(Literal):
  """
    self.numeric_part: Numeric
    self.literal_part: Dict[str, int]
  """

  def __init__(self, numeric_part: typing.Union[int, float, Numeric], literal_part: typing.Dict[str, int]):
    self.is_simplified = False
    if isinstance(numeric_part, (int)):
      self.numeric_part = Rational(numeric_part, 1).simplify()
    elif isinstance(numeric_part, (float)):
      self.numeric_part = Rational.from_float(numeric_part).simplify()
    else:
      self.numeric_part = numeric_part.simplify()
    self.literal_part = literal_part

  def __copy__(self):
    return Term(copy.copy(self.numeric_part), copy.copy(self.literal_part))

  def __deepcopy__(self, memo):
    if id(self) in memo:
      return memo[id(self)]

    self_copy = Term(copy.deepcopy(self.numeric_part), copy.deepcopy(self.literal_part))
    memo[id(self)] = self_copy

    return self_copy

  def simplify(self):
    self.is_simplified = True

    self.literal_part = {variable: exponent for variable, exponent in self.literal_part.items() if exponent != 0}
    if self.numeric_part == 0:
      self.literal_part = {}
    return self

  def __add__(self, other):
    if isinstance(other, (int, float, Numeric)):
      return Polynomial([self, Term(other, {}).simplify()]).simplify()

    if isinstance(other, (Term)):
      self_copy = copy.copy(self).simplify()
      other_copy = copy.copy(other).simplify()

      if self_copy.literal_part == other_copy.literal_part:
        return Term(self_copy.numeric_part + other_copy.numeric_part, self_copy.literal_part).simplify()

      return Polynomial([self_copy, other_copy])

    return super().__add__(other)

  def __mul__(self, other):
    if isinstance(other, (int, float, Numeric)):
      return Term(self.numeric_part * other, self.literal_part).simplify()

    if isinstance(other, (Term)):
      self_copy = copy.copy(self).simplify()
      other_copy = copy.copy(other).simplify()

      new_numeric_part = self_copy.numeric_part * other_copy.numeric_part
      new_literal_part = self_copy.literal_part

      for variable in other_copy.literal_part:
        exponent = other_copy.literal_part[variable]
        if variable not in self_copy.literal_part:
          self_copy.literal_part[variable] = 0
        self_copy.literal_part[variable] += exponent

      return Term(new_numeric_part, new_literal_part).simplify()

    return super().__mul__(other)

  def __truediv__(self, other):
    if isinstance(other, (int, float, Numeric)):
      return Term(self.numeric_part / other, self.literal_part).simplify()

    if isinstance(other, (Term)):
      self_copy = copy.copy(self).simplify()
      other_copy = copy.copy(other).simplify()

      new_numeric_part = self_copy.numeric_part * other_copy.numeric_part
      new_literal_part = self_copy.literal_part

      for variable in other_copy.literal_part:
        exponent = other_copy.literal_part[variable]
        if variable not in self_copy.literal_part:
          self_copy.literal_part[variable] = 0
        self_copy.literal_part[variable] -= exponent

      return Term(new_numeric_part, new_literal_part).simplify()

    return super().__truediv__(other)

  def __pow__(self, other):
    if isinstance(other, (int, float, Numeric)):
      self_copy = copy.copy(self)
      new_numeric_part = self_copy.numeric_part * other
      new_literal_part = self_copy.literal_part

      for variable in new_literal_part:
        new_literal_part[variable] *= other

      return Term(new_numeric_part, new_literal_part).simplify()

    return super().__pow__(other)

  def __neg__(self):
    self_copy = copy.deepcopy(self)
    return Term(-self_copy.numeric_part, self_copy.literal_part).simplify()

  def __str__(self):
    if not self.is_simplified:
      string_numeric_part = str(self.numeric_part)
      string_literal_part = ''
      for variable in self.literal_part:
        exponent = self.literal_part[variable]
        string_literal_part += Latex.power(variable, exponent)

      return string_numeric_part + string_literal_part

    string_literal_part = ''
    for variable in self.literal_part:
      exponent = self.literal_part[variable]
      if self.is_simplified and exponent == 1:
        string_literal_part += variable
        continue
      string_literal_part += Latex.power(variable, exponent)

    string_numeric_part = str(self.numeric_part)

    if self.numeric_part == 0:
      return string_numeric_part

    if string_literal_part == '':
      return string_numeric_part

    if self.numeric_part == 1:
      return string_literal_part
    
    if self.numeric_part == -1:
      return '-' + string_literal_part

    return string_numeric_part + string_literal_part

  def __eq__(self, other):
    temporal_self_term = copy.copy(self)
    if isinstance(other, (int, float, Numeric)):
      return temporal_self_term.numeric_part == other and len(temporal_self_term.literal_part) == 0

    if isinstance(other, (Term)):
      temporal_other_term = copy.copy(other)
      return temporal_self_term.numeric_part == temporal_other_term.numeric_part and temporal_self_term.literal_part == temporal_other_term.literal_part

    return super().__eq__(other)


class Polynomial(Literal):
  """
    self.terms: List[Term]
  """

  def __init__(self, terms: typing.List[Term]):
    self.is_simplified = False
    self.terms = terms

  def __copy__(self):
    return Polynomial(copy.deepcopy(self.terms))

  def __deepcopy__(self, memo):
    if id(self) in memo:
      return memo[id(self)]

    self_copy = Polynomial(copy.deepcopy(self.terms))
    memo[id(self)] = self_copy

    return self_copy

  def simplify(self):
    self.is_simplified = True
    for term in self.terms:
      term.simplify()

    new_terms: typing.List[Term] = []
    for term in self.terms:
      def are_terms_are_summable(term_1: Term, term_2: Term):
        return term_1.literal_part == term_2.literal_part
      index: int | None = next((index for index, term_in_new_terms in enumerate(new_terms) if are_terms_are_summable(term_in_new_terms, term)), None)

      if index is None:
        new_terms.append(term)
        continue
      new_terms[index] += term

    new_terms = [term for term in new_terms if term != 0]
    self.terms = new_terms
    return self

  def __add__(self, other):
    self_copy = copy.deepcopy(self).simplify()
    other_copy = copy.deepcopy(other)

    if isinstance(other, (int, float, Numeric)):
      return Polynomial([*self_copy.terms, Term(other_copy)]).simplify()

    if isinstance(other, (Term)):
      return Polynomial([*self_copy.terms, other_copy]).simplify()

    return super().__add__(other)

  def __mul__(self, other):
    self_copy = copy.deepcopy(self).simplify()
    other_copy = copy.deepcopy(other)

    new_terms = []

    if isinstance(other, (Polynomial)):
      other_copy = other_copy.simplify()
      for self_term in self_copy.terms:
        for other_term in other_copy.terms:
          new_terms.append(self_term * other_term)
      return Polynomial(new_terms).simplify()

    if isinstance(other, (int, float, Numeric, Term)):
      for term in self_copy.terms:
        new_terms.append(term * other_copy)
      return Polynomial(new_terms).simplify()

    return super().__mul__(other)

  def __truediv__(self, other):
    if isinstance(other, (int, float, Numeric)):
      return Term(self.numeric_part / other, self.literal_part).simplify()

    if isinstance(other, (Term)):
      self_copy = copy.deepcopy(self).simplify()
      other_copy = copy.deepcopy(other).simplify()

      new_numeric_part = self_copy.numeric_part * other_copy.numeric_part
      new_literal_part = self_copy.literal_part

      for variable in other_copy.literal_part:
        exponent = other_copy.literal_part[variable]
        if variable not in self_copy.literal_part:
          self_copy.literal_part[variable] = 0
        self_copy.literal_part[variable] -= exponent

      return Term(new_numeric_part, new_literal_part).simplify()

    return super().__truediv__(other)

  def __pow__(self, other):
    self_copy = copy.deepcopy(self)
    if isinstance(other, (int)):
      result = Polynomial([Term(1, {})])
      for _ in range(other):
        result *= self_copy
      return result.simplify()

    return super().__pow__(other)

  def __neg__(self):
    self_copy = copy.deepcopy(self)
    new_terms = [-term for term in self_copy.terms]
    return Polynomial(new_terms).simplify()

  def __str__(self):
    quantity_terms = len(self.terms)
    if quantity_terms == 0:
      return ''

    string = str(self.terms[0])
    if quantity_terms == 1:
      return string

    for term in self.terms[1:]:
      term_string = str(term)
      if term_string[0] == '-':
        string += term_string
        continue

      string += '+' + term_string

    return string

# random.seed(seed)