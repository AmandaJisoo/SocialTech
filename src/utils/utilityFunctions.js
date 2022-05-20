export const MAX_LENGTH_OF_COMMNET_IN_SHELTERCARD = 145
export const DEFAULT_COUNTRY = "USA"
export const DEFAULT_PROFILE_PATH = "" 
export const MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD = {
	width: "20em",
	height: "15em",
	radius: "10px"
}


export const MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD_MOBILE = {
	width: "100%",
	height: "15em",
	radius: "10px"
}

export const MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL = {
	width: "100%",
	height: "20em"
}

export const MAX_NUMBER_OF_TAGS_IN_SHELTER_CARD = 6

export const TAG_CATEGORY_PLACE_HOLDER = ["Cleaness", "Safety", "Temperature", "Utilities"]
export const TAGS_FOR_SPECIFIC_CATEGORY = new Map([
    ["Cleaness", ["Very clean", "Clean", "Avg clean", "Not clean", "Messy", "Dirty"]],
    ["Safety", ["Very safe", "safe", "unsafe", "Dangerous"]],
    ["Temperature", ["Good temperature", "Avg temperature", "Unreasonable temperature"]],
    ["Utilities", ["Fully equipipped", "Reasonably equipipped", "Sparsely equipipped "]]
])

export const LOADING_SPINNER_SIZE = {
    small: "15vh",
	medium: "25vh",
    large: "80vh"
}

export const SORT_OPTIONS = ["Distance", "Rating", "Rating (reversed)", "Favorite", "Most Reviewed", "Name"];

export const SHELTER_CARD_DISPLAY_STATUS = {
	regular: "REGULAR",
	shelterClaim: "SHELTER_CLAIM"
}

export const ICON_RESPONSIVE_FONTSIZE  = {
	fontSize: {
		lg: 50,
		md: 30,
		sm: 30,
	}
}

export function truncateComment(comment) {
    return comment.length > MAX_LENGTH_OF_COMMNET_IN_SHELTERCARD ? 
		comment.substring(0, MAX_LENGTH_OF_COMMNET_IN_SHELTERCARD + 1) + "....." : 
		comment;
}

export function formatShelterAddress(data) {
    return data.title + ", " + data.street + ", " + data.city + ", " + data.state + ", " + data.zipcode
}