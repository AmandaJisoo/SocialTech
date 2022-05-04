import { observable, action, makeObservable } from "mobx";
import { Auth } from 'aws-amplify';

export default class AppStore {
    shelterData = undefined;
    claimStatus = {};
    highlightedComment = {};
    userProfilePic = {}
    shelterDataList = []
    username = undefined;
    zipcode = "";
    searchOption = "";
    searchQuery = "";
    showNoLocationError = false;
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
            username: observable,
            getUsername: action,
            zipcode: observable,
            setZipcode: action,
            searchOption: observable,
            setSearchOption: action,
            searchQuery: observable,
            setSearchQuery: action,
            showNoLocationError: observable,
            setShowNoLocationError: action,
        })
    }

    setShowNoLocationError(val) {
        this.showNoLocationError = val
    }

    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery
    }

    setSearchOption(searchOption) {
        this.searchOption = searchOption
    }

    setZipcode(zipcode) {
        this.zipcode = zipcode
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

    setHighlightedComment(post_id, comment) {
        this.highlightedComment = {
            ...this.highlightedComment,
            [post_id]: comment
        }
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

    async getUsername() {
        let authRes = await Auth.currentAuthenticatedUser();
        this.username = authRes.username;
    }
}