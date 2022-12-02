from http import HTTPStatus
from werkzeug.exceptions import HTTPException
from apps.err_messages import err_response, ErrMsg

def register_err_handler(app):

  @app.errorhandler(Exception)
  def server_error(err):
    app.logger.exception(err)
    http_err = isinstance(err, HTTPException)
    return err_response(err.description, err.code) if http_err else \
      err_response(ErrMsg.INTERNAL, HTTPStatus.INTERNAL_SERVER_ERROR)
