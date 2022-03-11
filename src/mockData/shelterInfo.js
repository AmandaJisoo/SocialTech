import reviews from './reviews.json';

const shelterData = {
    "shelters": [
        {
            "id" : "1",
            "name": "Roots Young Adult Shelter",
            "starRating": 3.6,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview": "Great friday meal, a little hard for handicap to gain access.",
            "imgAddr": "/assets/imgs/roots.jpeg",
            "isFavorite": false,
            "reviews": reviews.review_shelter_1

        },
        {
            "id" : "2",
            "name": "Sacred Heart Shelter",
            "starRating": 3.6,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview":  "They discriminate you if you aren't with a whole family.",
            "imgAddr": "/assets/imgs/sacred.jpeg",
            "isFavorite": true,
            "reviews": reviews.review_shelter_2
        },
        {
            "id" : "3",
            "name": "Seattle's Union Gospel Mission",
            "starRating": 3.8,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview": "Great place to sleep and relax great staff and food here",
            "imgAddr": "/assets/imgs/union.jpeg",
            "isFavorite": false,
            "reviews": reviews.review_shelter_3
        },
        {
            "id" : "4",
            "name": "The Inn Enhanced Shelter",
            "starRating": 4.1,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview": "Very friendly staff great place helps people of ALL ages",
            "imgAddr": "/assets/imgs/inn.jpeg",
            "isFavorite": false,
            "reviews": reviews.review_shelter_4
        },
        {
            "id" : "5",
            "name": "The bridge shelter",
            "starRating": 3.3,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview": "Needed to donate warm clothing, staff was excellent helping to coordinate pickup.",
            "imgAddr": "/assets/imgs/bridge.jpeg",
            "isFavorite": false,
            "reviews": reviews.review_shelter_5
        },
        {
            "id" : "6",
            "name": "St Martin De Porres Shelter",
            "starRating": 4.5,
            "distanceToUserLocation": "2",
            "tags": [{
                "id": "clean",
                "text": "clean"
                },
                {
                    "id": "warm",
                    "text": "warm"
                },
                {
                    "id": "friendly",
                    "text": "friendly"
                }],
            "highlightedReview": "Meal each day, clean bedding, showers and a clothing room.",
            "imgAddr": "/assets/imgs/st martin.jpeg",
            "isFavorite": false,
            "reviews": reviews.review_shelter_6
        }
    ]
}  

export default shelterData;
