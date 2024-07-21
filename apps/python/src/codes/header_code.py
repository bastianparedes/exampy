import copy
import random
import math
import sympy
from sympy import *

sympy.core.parameters.global_parameters.evaluate = False


class Latex:
  def math_mode(expresion): return f'$ {sympy.latex(expresion).replace(r'\frac', r'\dfrac')} $'
  def root(subradical, index): return fr'\sqrt[{index}]{subradical}'
  def fraction(numerator, denominator): return fr' \dfrac{{{numerator}}}{{{denominator}}} '
  def overline(element): return fr' \overline{{{element}}} '
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

def decorator_fix(fn):
  def wrapper(*args, **kwargs):
    sympy.core.parameters.global_parameters.evaluate = True
    result = fn(*args, **kwargs)
    sympy.core.parameters.global_parameters.evaluate = False
    return result
  return wrapper

@decorator_fix
def simplify(*args, **kwargs):
  return sympy.simplify(*args, **kwargs)

@decorator_fix
def expand(*args, **kwargs):
  return sympy.expand(*args, **kwargs)

@decorator_fix
def factor(*args, **kwargs):
  return sympy.factor(*args, **kwargs)

@decorator_fix
def solve(*args, **kwargs):
  return sympy.solve(*args, **kwargs)
