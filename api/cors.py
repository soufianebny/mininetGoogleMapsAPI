#from bottle import response
#from bottle import Bottle, get, post, request, route, hook, response
from bottle import request, response
class EnableCors(object):
    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers   
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token, X-HTTP-Method-Override'

            if request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)
        
        return _enable_cors