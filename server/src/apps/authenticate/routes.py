from flask import Blueprint
from controllers.decorators import *
from constants.err_messages import *
from controllers.user_controller import register, login, logout, check_token

authenticate = Blueprint('authenticate', __name__)
 
authenticate.route('/api/register', methods=['POST'])(register)
authenticate.route('/api/login', methods = ['POST'])(login)
authenticate.route('/api/logout', methods = ['POST'])(logout)
authenticate.route('/api/check-token', methods = ['GET'])(check_token)
