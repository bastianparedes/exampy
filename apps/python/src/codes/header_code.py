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

