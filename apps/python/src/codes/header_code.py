import math
import typing
import random
import fractions
import sympy

class Latex:
  def math_mode(expresion: str): return f'$ {sympy.latex(expresion).replace(r'\frac', r'\dfrac')} $'
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

class Sympy_class:
  def __init__(self, sympy_element_not_evaluated=None):
    self.ZERO = sympy.Integer(0)
    self.ONE = sympy.Integer(1)
    self.no_evaluated = sympy_element_not_evaluated
    self.evaluated = None if sympy_element_not_evaluated is None else sympy_element_not_evaluated.simplify()

  def __add__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Add(self.no_evaluated, other_element, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __radd__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Add(other_element, self.no_evaluated, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __sub__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Add(self.no_evaluated, -self.ONE*other_element,  evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __rsub__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Add(self.ONE*other_element, -self.ONE*self.no_evaluated,  evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __mul__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Mul(self.no_evaluated, other_element, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __rmul__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Mul(other_element, self.no_evaluated, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result

  def __truediv__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Mul(self.no_evaluated, self.ONE/other_element, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __pow__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Pow(self.no_evaluated, other_element, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def __rpow__(self, other):
    other_element = other.no_evaluated if isinstance(other, Sympy_class) else other
    result = Sympy_class()
    result.no_evaluated = sympy.Pow(other_element, self.no_evaluated, evaluate=False)
    result.evaluated = result.no_evaluated.simplify()
    return result
  
  def simplify(self):
    return self.evaluated
  
  def __str__(self):
    return str(self.no_evaluated)

def get_class(sympy_class):
  class Decorated_class(Sympy_class):
    def __init__(self, *args, **kwargs):
      self.evaluated = sympy_class(*args, **kwargs)
      self.no_evaluated = self.evaluated.simplify()
  return Decorated_class


Rational = get_class(sympy.Rational)
Integer = get_class(sympy.Integer)
Symbol = get_class(sympy.Symbol)

def Add(*args):
  new_args = []
  for arg in args:
    new_args.append(arg.no_evaluated if isinstance(arg, Sympy_class) else arg)
  return Sympy_class(sympy.Add(*new_args, evaluate=False))

def Mul(*args):
  new_args = []
  for arg in args:
    new_args.append(arg.no_evaluated if isinstance(arg, Sympy_class) else arg)
  return Sympy_class(sympy.Mul(*new_args, evaluate=False))
