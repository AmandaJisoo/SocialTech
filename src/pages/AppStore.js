import { observable, action, makeObservable } from "mobx";

export default class AppStore {
    shelterData = undefined;
    claimStatus = {};
    highlightedComment = undefined;
    userProfilePic = {}
    shelterDataList = []
    constructor() {
        makeObservable(this, {
            shelterData: observable,
            setShelterData: action,
            claimStatus: observable,
            setClaimStatus: action,
            highlightedComment: observable,
            setHighlightedComment: action,
            userProfilePic: observable,
            setUserProfilePic: action,
            shelterDataList: observable,
            setShelterDataList: action,
        })
    }

    setShelterData(shelter) {
        this.shelterData = shelter;
    }

    setClaimStatus(post_id, status) {
        this.claimStatus = {
            ...this.claimStatus,
            [post_id]: status
        }
        console.log("new claims", this.claimStatus)
    }

    setHighlightedComment(comment) {
        this.highlightedComment = comment;
    }

    setUserProfilePic(username, pathToProfileImg) {
        this.userProfilePic = {
            ...this.userProfilePic,
            [username]: pathToProfileImg
        }
        // console.log("new claims", this.claimStatus)
    }

    setShelterDataList(shelterDataList) {
        this.shelterDataList = shelterDataList
    }
}