from flask import Blueprint
from controllers.decorators import *
from constants.err_messages import *
from controllers.user_controller import register, login, logout, check_token

authenticate = Blueprint('authenticate', __name__)
 
authenticate.route("/register", methods=['POST'])(register)
authenticate.route('/login', methods = ['POST'])(login)
authenticate.route('/logout', methods = ['POST'])(logout)
authenticate.route('/check-token', methods = ['GET'])(check_token)
