from flask import Flask, request
import requests
import json

app = Flask(__name__)

API_KEY = "AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw"

@app.route('/calculate', methods=['GET'])
def calculate_distance_between_2_zipcodes():
    start_zipcode = request.args.get('start_zipcode')
    end_zipcode = request.args.get('end_zipcode')
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + start_zipcode + "&destinations=" + end_zipcode + "&units=imperial&key=" + API_KEY
    payload={}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    output = json.loads(response.text)
    mile = output['rows'][0]['elements'][0]['distance']['text']
    return app.response_class(response=json.dumps(mile),
                              status=200,
                              mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)