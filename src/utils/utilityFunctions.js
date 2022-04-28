export const MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD = 145
export const DEFAULT_COUNTRY = "USA"
export const DEFAULT_PROFILE_PATH = "" 
export const MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD = {
	width: "20em",
	height: "15em"
}
export const MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL = {
	width: "100%",
	height: "20em"
}

export const TAG_CATEGORY_PLACE_HOLDER = ["Cleaness", "Safety", "Warmth", "Utilities", "Others"]
export const TAGS_FOR_SPECIFIC_CATEGORY = new Map([
    ["Cleaness", ["Very clean", "Clean", "So-so", "Not clean", "Messy", "Dirty"]],
    ["Safety", ["Very safe", "safe", "unsafe", "Dangerous"]],
    ["Warmth", ["Warm", "Not worm"]],
    ["Utilities", ["Fully-equipipped", "Just okay", "Lack utilities "]],
    ["Others", ["free clothes", "free hygiene kits", "employment help center"]]
])


export function truncateReview(review) {
    return review.length > MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD ? 
        review.substring(0, MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD + 1) + "....." : 
        review;
}

export function handleReviewDateFormatting(date) {
	// TODO: handle date formatting
    return date;
}

export function getHighLightedReivew(reviews) {
	// TODO: handle choosing highlighted review (either reviews with most likes or star rating)
    return reviews[0];
}

export function formatShelterAddress(data) {
	// TODO: handle choosing highlighted review (either reviews with most likes or star rating)
    return data.title + ", " + data.street + ", " + data.city + ", " + data.state + ", " + data.zipcode
}
 
/* 
inputs: 
	zipcode1: number
	zipcode2: number
outputs:
	distance: number
*/

export function getDistanceBetweenTwoZipcode(zipcode1, zipcode2) {
	// TODO: handle calcuate distance
    return null
}

export const SORT_OPTIONS = ["Distance", "Rating", "Rating (reversed)", "Favorite", "Most Reviewed", "Name"];

export const DEFAULT_UNIT = "km"

export function isShelterFavorited(userFavoritedShelterSet, shelterId) {
    return userFavoritedShelterSet.has(shelterId)
}

export function isReviewFavorited(userFavoritedReview, reviewId) {
    return userFavoritedReview.has(reviewId)
}

//sets a local storage variable with an expiration 
//from https://www.sohamkamani.com/blog/javascript-localstorage-with-ttl-expiry/
export function setWithExpiry(key, value, ttl) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

//gets a local storage variable with expiration
//https://www.sohamkamani.com/blog/javascript-localstorage-with-ttl-expiry/
export function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

export function GetCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') {
		c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
		return c.substring(name.length, c.length);
		}
	}
	return ""
}

export function SetCookie(cname, cvalue, seconds) {
	var d = new Date();
	d.setTime(d.getTime() + (seconds*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

