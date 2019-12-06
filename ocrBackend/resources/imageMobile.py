
from flask_restful import Resource
from flask import make_response, jsonify, request
import logging
import numpy as np
import cv2
import urllib.request
from models.ocr_api import pre_processing
from models.ocr_api import make_prediction
from unidecode import unidecode

LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"


class ImageMobile(Resource):

    def __init__(self):
        self.log = logging
        self.log.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

    def post(self):
        # get image from frontend
        data = request.get_json()
        img_src = data['r_img_url']
        
        # convert that image url to mat
        resp = urllib.request.urlopen(img_src)
        img = np.asarray(bytearray(resp.read()),dtype="uint8")
        img = cv2.imdecode(img,cv2.IMREAD_COLOR)
        
        # pre-process image
        img = pre_processing(img)
        #
        text = make_prediction(img)
        # for debugging purposes
        #ret, jpeg = cv2.imencode('.png', img)
        #response = make_response(jpeg.tobytes())
        #response.headers['Content-Type'] = 'image/png'
        #return response
            
        return make_response(jsonify({"message": text}), 200)