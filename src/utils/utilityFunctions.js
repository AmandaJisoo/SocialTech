const MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD = 145

export function truncateReview(review) {
    return review.length > MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD ? 
        review.subString(0, MAX_LENGTH_OF_REVIEW_IN_SHELTERCARD + 1) + "....." : 
        review;
}

export const FILTER_OPTIONS = ["Current Location", "Star Rating", "Likes"];

export const DEFAULT_UNIT = "km"

export function isShelterFavorited(userFavoritedShelterSet, shelterId) {
    return userFavoritedShelterSet.has(shelterId)
}

export function isReviewFavorited(userFavoritedReview, reviewId) {
    return userFavoritedReview.has(reviewId)
}