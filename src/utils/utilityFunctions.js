export const MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD = 145
export const LENGTH_OF_AUTO_SIGN_IN = 259200000 // 3 days in ms
export const AUTH_TOKEN_KEYNAME = "auth_token"

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

export const FILTER_OPTIONS = ["Current Location", "Star Rating"];

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

