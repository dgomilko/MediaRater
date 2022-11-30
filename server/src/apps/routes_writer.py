from flask import Blueprint

def view_maker(name, f):
  f.__name__ = name
  return f

def register_routes(bp: Blueprint, routes_fns: dict):
  for route, fn in routes_fns.items():
    name = route.split('/')[-1]
    underscored = '_'.join(name.split('-'))
    bp.add_url_rule(
      route,
      methods=['POST'],
      view_func=view_maker(underscored, fn)
    )
