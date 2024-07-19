import flask
import flask_restful
import flask_restful.reqparse
import requests
import urllib
import datetime
import os
import math
import dotenv
import typing
import api.db as db


dotenv.load_dotenv()

PATHS = {
    'health': '/',
    'exercises_by_filters': '/exercises_by_filters',
    'exercises_by_ids': '/exercises_by_ids',
    'exercise_not_existing': '/exercise',
    'exercise_existing': '/exercise/<int:id>',
    'pdf': '/pdf_url',
    'header_code': '/header_code',
    'header_code_simplified': '/header_code_simplified',
    'examples': '/examples',
    'login': '/login',
    'post_login': '/post_login',
    'user_data': '/user_data',
    'logout': '/logout',
}

app = flask.Flask(__name__)
api = flask_restful.Api(app)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')


def get_user_data(access_token: typing.Union[str, None] = None) -> typing.Union[dict, None]:
  access_token = access_token if access_token is not None else flask.request.cookies.get('access_token')

  if access_token is None:
    return None

  response = requests.get('https://api.github.com/user', headers={
      'Authorization': f'Bearer {access_token}'
  })

  if not response.ok:
    return None

  user_data = response.json()
  return user_data


class Endpoint_exercises_by_filters(flask_restful.Resource):
  def __init__(self):
    self.parser_get = flask_restful.reqparse.RequestParser()

    def validate_columns(value, field):
      valid_columns = [
          db.Exercises.id.column_name,
          db.Exercises.name.column_name,
          db.Exercises.description.column_name,
          db.Exercises.code.column_name,
          db.Exercises.last_modified_date.column_name,
          db.Exercises.user_id.column_name]
      if value not in valid_columns:
        raise Exception(f'Value "{value}" in "{field}" is not one of valid values: {", ".join(valid_columns)}')
      return value

    def validate_page_number(value, field):
      number = int(value)
      if number < 0:
        raise Exception(f'Value "{value}" in "{field}" must be positive integer o Zero')
      return number

    def validate_items_per_page(value, field):
      limit = 100
      number = int(value)
      if not number > 0:
        raise Exception(f'Value "{value}" in "{field}" must be positive integer')
      if number > limit:
        raise Exception(f'Value "{value}" in "{field}" must be lower or equal to {limit}')
      return number

    self.parser_get.add_argument('columns', type=validate_columns, action='append', location='args', required=True)
    self.parser_get.add_argument('page_number', type=validate_page_number, location='args', required=False, default=1)
    self.parser_get.add_argument('items_per_page', type=validate_items_per_page, location='args', required=False, default=100)
    self.parser_get.add_argument('query', type=str, location='args', required=False, default='')

  def get(self):
    args = self.parser_get.parse_args()
    columns = list(set(args['columns']))
    page_number = args['page_number']
    items_per_page = args['items_per_page']
    query = args['query']

    exercises = db.Exercises.select(*[getattr(db.Exercises, column) for column in columns]).order_by(db.Exercises.id).paginate(page_number + 1,items_per_page).where(db.Exercises.name.contains(query) | db.Exercises.description.contains(query)).dicts()
    total_exercises = db.Exercises.select(*[getattr(db.Exercises, column) for column in columns]).where(db.Exercises.name.contains(query) | db.Exercises.description.contains(query)).count()

    return flask.jsonify({
        'exercises': list(exercises),
        'total': total_exercises
    })


api.add_resource(Endpoint_exercises_by_filters, PATHS['exercises_by_filters'])


class Endpoint_exercises_by_ids(flask_restful.Resource):
  def __init__(self):
    self.parser_get = flask_restful.reqparse.RequestParser()

    def validate_columns(value, field):
      valid_columns = [
          db.Exercises.id.column_name,
          db.Exercises.name.column_name,
          db.Exercises.description.column_name,
          db.Exercises.code.column_name,
          db.Exercises.last_modified_date.column_name,
          db.Exercises.user_id.column_name]
      if value not in valid_columns:
        raise Exception(f'Value "{value}" in "{field}" is not one of valid values: {", ".join(valid_columns)}')
      return value

    def validate_ids(value):
      return int(value)

    self.parser_get.add_argument('columns', type=validate_columns, action='append', location='args', required=True)
    self.parser_get.add_argument('ids', type=validate_ids, action='append', location='args', required=False, default=[])

  def get(self):
    args = self.parser_get.parse_args()
    columns = list(set(args['columns']))
    ids = list(set(args['ids']))

    exercises = db.Exercises.select(*[getattr(db.Exercises, column) for column in columns]).where(db.Exercises.id.in_(ids))

    return flask.jsonify({
        'exercises': list(exercises.dicts())
    })


api.add_resource(Endpoint_exercises_by_ids, PATHS['exercises_by_ids'])


class Endpoint_specific_exercise(flask_restful.Resource):
  def __init__(self):
    self.parser_post = flask_restful.reqparse.RequestParser()
    self.parser_put = flask_restful.reqparse.RequestParser()

    for column in [db.Exercises.name.column_name, db.Exercises.description.column_name, db.Exercises.code.column_name]:
      self.parser_post.add_argument(column, type=str, location='json', required=True)
      self.parser_put.add_argument(column, type=str, location='json', required=True)

  def post(self, id: typing.Union[int, None] = None):
    user_data = get_user_data()
    if user_data is None:
      return flask.jsonify(None), 401

    args = self.parser_post.parse_args()
    new_user = db.Exercises.create(
        name=args[db.Exercises.name.column_name],
        description=args[db.Exercises.description.column_name],
        code=args[db.Exercises.code.column_name],
        user_id=user_data['id']
    )

    return {
        db.Exercises.id.column_name: new_user.id,
        db.Exercises.name.column_name: new_user.name,
        db.Exercises.description.column_name: new_user.description,
        db.Exercises.code.column_name: new_user.code
    }

  def put(self, id: typing.Union[int, None] = None):
    user_data = get_user_data()
    if user_data is None:
      return flask.jsonify(None), 401

    args = self.parser_put.parse_args()
    db.Exercises \
        .update({
            db.Exercises.name: args[db.Exercises.name.column_name],
            db.Exercises.description: args[db.Exercises.description.column_name],
            db.Exercises.code: args[db.Exercises.code.column_name],
            db.Exercises.last_modified_date: datetime.datetime.now()
        }) \
        .where(db.Exercises.id == id) \
        .where(db.Exercises.user_id == user_data['id']) \
        .returning(db.Exercises) \
        .execute()

    return flask.jsonify({
        db.Exercises.id.name: id,
        db.Exercises.name.name: args[db.Exercises.name.column_name],
        db.Exercises.description.name: args[db.Exercises.description.column_name],
        db.Exercises.code.name: args[db.Exercises.code.column_name]
    })


api.add_resource(Endpoint_specific_exercise, PATHS['exercise_not_existing'], PATHS['exercise_existing'])


@app.route('/pdf_url', methods=['POST'])
def endpoint_pdf_url():
  request_data = flask.request.get_json()
  latex_code = request_data['latex_code']
  response = requests.post(
      'https://texlive.net/cgi-bin/latexcgi',
      files={
          'filecontents[]': ('document.tex', latex_code, 'text/plain'),
          'filename[]': 'document.tex',
          'engine': 'pdflatex',
          'return': 'pdf'
      })
  return response.url


@app.route(PATHS['header_code'], methods=['GET'])
def endpoint_header_code():
  with open('./src/codes/header_code.py', 'r') as file:
    contenido = file.read()
    return flask.Response(contenido, content_type='text/plain'), 200


@app.route(PATHS['header_code_simplified'], methods=['GET'])
def endpoint_header_code_simplified():
  with open('./src/codes/header_code_simplified.py', 'r') as file:
    contenido = file.read()
    return flask.Response(contenido, content_type='text/plain'), 200



class Endpoint_exmaples(flask_restful.Resource):
  def __init__(self):
    self.parser_get = flask_restful.reqparse.RequestParser()

    def validate_positive_integer(value, field):
      quantity = int(value)
      if quantity >= 1:
        return quantity
      raise Exception(f'Value "{value}" in "{field}" must be positive integer')

    self.parser_get.add_argument('quantity', type=validate_positive_integer, location='args', required=False, default=1)

  def get(self):
    args = self.parser_get.parse_args()
    quantity = args['quantity']
    file_contents: typing.List[str] = []
    folder_path = os.path.join('src', 'codes','examples')

    for filename in os.listdir(folder_path)[:quantity]:
      file_path = os.path.join('src', 'codes','examples', filename)
      if os.path.isfile(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
          content = file.read()
          file_contents.append(content)

    return flask.jsonify({
      'examples': file_contents
    })


api.add_resource(Endpoint_exmaples, PATHS['examples'])




@app.route(PATHS['health'], methods=['GET'])
def endpoint_health():
  return flask.Response('Ok', content_type='text/plain'), 200


@app.route(PATHS['login'], methods=['GET'])
def endpoint_login():

  base_url = "https://github.com/login/oauth/authorize"
  authorize_params = {
      "client_id": CLIENT_ID,
      "response_type": "code",
  }

  authorize_url = base_url + '?' + urllib.parse.urlencode(authorize_params)
  return flask.redirect(authorize_url)


@app.route(PATHS['post_login'], methods=['GET'])
def endpoint_post_login():
  query_params = flask.request.args

  response_token = requests.post(
      'https://github.com/login/oauth/access_token', data={
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET,
          'code': query_params.get('code'),
          'scope': 'user',
          'expires_in': 3600
      },
      headers={'Accept': 'application/json'}
  )

  if not response_token.ok:
    raise Exception('Could not get token from code')

  token_json = response_token.json()
  access_token = token_json['access_token']

  user_data = get_user_data(access_token=access_token)
  if user_data is not None:
    user_is_already_saved = db.Users.select(db.Users.id).where(db.Users.id == user_data['id']).first() is not None
    if not user_is_already_saved:
      db.Users.create(
          id=user_data['id'],
          name=user_data['name'],
          email=user_data['email']
      )

  response = flask.make_response(flask.redirect('/exercises'))
  response.set_cookie('access_token', access_token, secure=True, max_age=3600)
  return response


@app.route(PATHS['user_data'], methods=['GET'])
def endpoint_user_data():
  user_data = get_user_data()
  return flask.jsonify(user_data)


@app.route(PATHS['logout'], methods=['GET'])
def endpoint_logout():
  cookies = flask.request.cookies
  access_token = cookies.get('access_token')

  if (access_token is None):
    return flask.redirect('/')

  requests.delete(
      f'https://api.github.com/applications/{CLIENT_ID}/token',
      headers={
          'Authorization': f'token {access_token}',
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
      },
      auth=(CLIENT_ID, CLIENT_SECRET),
      json={
          'access_token': access_token
      }
  )

  response_api = flask.make_response(flask.redirect('https://github.com/logout'))
  response_api.set_cookie('access_token', '', secure=True, max_age=0)
  return response_api


''' @app.route('/dev')
def endpoint_dev():
  if not github.authorized:
    return flask.redirect(flask.url_for('github.login'))
  resp = github.get('/user')
  assert resp.ok
  return 'You are @{login} on GitHub'.format(login=resp.json()['login'])
'''
