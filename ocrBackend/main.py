import datetime
from flask import Flask, make_response, jsonify
from flask_restful import Api
from resources.imageMobile import ImageMobile

app = Flask(__name__)
api = Api(app)



@app.route('/')
def root():
    return make_response(jsonify({'message': 'connnection success'}), 200)
    
    
    
api.add_resource(ImageMobile, '/imageMobile')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
