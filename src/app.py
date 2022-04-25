from flask import Flask, request
import requests
import json

app = Flask(__name__)

API_KEY = "jzK3C6mNIhknwcC1KQchfWoM1m2Pih4i1U6SfF5DIGY752RFPWdvOeNWdsUOFOVB"

@app.route('/calculate', methods=['GET'])
def calculate_distance_between_2_zipcodes():
    # http://www.zipcodeapi.com/rest/DemoOnly00FRUKerspNXQ8qydUGlWRGMcRwCLH6EOULMbxd1BlPdAUvn7Y7xL8gj/distance.json/98105/94063/km
    start_zipcode = request.args.get('start_zipcode')
    end_zipcode = request.args.get('end_zipcode')
    url = "http://www.zipcodeapi.com/rest/" + API_KEY + "/distance.json/" + str(start_zipcode) + "/" + str(end_zipcode) + "/mile"
    response = json.loads(requests.get(url).content.decode('utf-8'))
    print(response['distance'])
    return str(response['distance'])


if __name__ == '__main__':
    app.run(debug=True)