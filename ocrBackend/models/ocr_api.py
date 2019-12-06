# -*- coding: utf-8 -*- 
import cv2
import numpy as np
from PIL import Image
from aip import AipOcr

config = {
    'appId': '17939669',
    'apiKey': 'mC2NOexwu6Z0SQf9DVdCsxsM',
    'secretKey': 'Q5bDKoGXzVx2kHI3SI9V82rYuymU4MLN'
}

client = AipOcr(**config)

def get_file_content(file):
    with open(file, 'rb') as fp:
        return fp.read()
        
def pre_processing(img):

    # convert to gray scale & binarize
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    #ret,img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
    img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # dilation and erosion
    kernel = np.ones((1, 1), np.uint8)
    img = cv2.dilate(img, kernel, iterations = 5)
    img = cv2.erode(img, kernel, iterations = 5)
    
    #cv2.imwrite("removed_noise.png", img)
    return img


def make_prediction(img):
    
    is_success, im_buf_arr = cv2.imencode(".png", img)

    im_buf_arr.tofile('removed_noise.png')
    
    image = get_file_content('removed_noise.png')
    result = client.basicGeneral(image)
    if 'words_result' in result:
        print(result)
        print(result['words_result'])
        return '\n'.join([w['words'] for w in result['words_result']])
    else:
        return 'nothing detected...'
    #result = pytesseract.image_to_string(img,lang="eng", config="-psm 7")
    
    #print(result)










