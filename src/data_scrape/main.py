import requests
import json
import time
# google api text search --  ambiguous search || match business search

#shelterin seattle washington
KEYWORD = 'shelter%20in%20seattle%20washington'
RADIUS = 5000
# google map api key
API_KEY = 'AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'
OUTPUT_FILE_NAME = "output.txt"

# display up to 60 results from google place api
def request_url():
    json_data = []
    next_page_token = ""
    for i in range(3):
        if next_page_token == "":
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + KEYWORD + "&radius=" + str(RADIUS) + "&key=" + API_KEY
        else:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + KEYWORD + "&pagetoken=" + next_page_token + "&radius=" + str(RADIUS) + "&key=" + API_KEY
        payload={}
        headers = {}
        response = requests.get(url, headers=headers, data=payload)
        result_dict = json.loads(response.text)
        print("Request " + str(i) + " Starts...")
        if "next_page_token" in result_dict:
            next_page_token = result_dict['next_page_token']
        json_data.append(result_dict)
        print("\tRequest " + str(i) + " Sleeping...")
        # wait 2 secs since api doesn't allow execute in a row otherwise get invalid request
        time.sleep(2)
    return json_data
        
        
def store_results_in_json(json_data): 
    f = open(OUTPUT_FILE_NAME, 'w')       
    print("Requests Done...")
    idx = 0
    print("Outputing...")
    post_list = []
    for data in json_data:
        for result in data['results']:
            post = {}
            address = result['formatted_address']
            name = result['name']
            f.write("Shelter #"+ str(idx + 1) + "\n")
            f.write("Shelter name: " + name + "\n")
            f.write("Shelter address: " + address + "\n")
            if 'opening_hours' in result: 
                open_hour = result['opening_hours']
                f.write("open hour: " + str(open_hour) + "\n")
            ratings = result['rating']
            total_num = result['user_ratings_total']
            f.write("ratings: " + str(ratings) +  "\n")
            f.write("total number of ratings: " + str(total_num) + "\n")
            f.write("\n\n")
            idx += 1
            # create dict
            address_split_by_comma = address.split(',')
            zip_code = address_split_by_comma[2].split()[1]
            state = address_split_by_comma[2].split()[0]
            post['title'] = name
            post['zipcode'] = zip_code
            post['street'] = address_split_by_comma[0]
            post['city'] = address_split_by_comma[1]
            post['state'] = state
            post['profile_pic_path'] = ""
            if 'photos' in result: 
                photo_reference = result['photos'][0]['photo_reference']
                url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" + photo_reference + "&key=" + API_KEY
                f.write("photo url: " + url + "\n")
                post['profile_pic_path'] = photo_reference
            # convert it to json object
            post_list.append(post)
    print(post_list)
    print(len(post_list))
    return post_list
           
        
if __name__ == '__main__':
    data = request_url()
    store_results_in_json(data)
    print("Done! See File: " + OUTPUT_FILE_NAME)
