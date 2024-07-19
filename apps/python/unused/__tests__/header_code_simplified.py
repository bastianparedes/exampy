import math
import typing
import abc
import random
import copy
import fractions
import sympy


class Latex:
  def math_mode(expresion: str): return f'$ {expresion} $'
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
    pass




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
  def __init__(self, numerator: int, denominator: int):
    pass


class Trigonometric_function(Numeric):
  """
    self.fn_name: str
    self.degrees: int
    self.radians: int
  """
  def __init__(self, degrees: typing.Union[int, float], fn_name: str):
    pass


class Log(Numeric):
  pass


class Dot():
  """
    self.coordinates: List[Numeric]
    self.magnitude: float
  """
  def __init__(self, coordinates: typing.List[typing.Union[int, float, Numeric]]) -> None:
    pass


class Term(Literal):
  """
    self.numeric_part: Numeric
    self.literal_part: Dict[str, int]
  """
  def __init__(self, numeric_part: typing.Union[int, float, Numeric], literal_part: typing.Dict[str, int]):
    pass


class Polynomial(Literal):
  """
    self.terms: List[Term]
  """
  def __init__(self, terms: typing.List[Term]):
    pass
