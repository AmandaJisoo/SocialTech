from flask import Flask
import requests

app = Flask(__name__)

API_KEY = "jzK3C6mNIhknwcC1KQchfWoM1m2Pih4i1U6SfF5DIGY752RFPWdvOeNWdsUOFOVB"

@app.route('/calculate/<int:start_zip_code>/<int:end_zip_code>', methods=['GET'])
def calculate_distance_between_2_zipcodes(start_zip_code, end_zip_code):
    # http://www.zipcodeapi.com/rest/DemoOnly00FRUKerspNXQ8qydUGlWRGMcRwCLH6EOULMbxd1BlPdAUvn7Y7xL8gj/distance.json/98105/94063/km
    url = "http://www.zipcodeapi.com/rest/" + API_KEY + "/distance.json/" + str(start_zip_code) + "/" + str(end_zip_code) + "/mile"
    response = requests.get(url)
    return response.content


if __name__ == '__main__':
    app.run(debug=True)