import { observable, action, makeObservable } from "mobx";

export default class AppStore {
    shelterData = undefined;
    claimStatus = {};
    highlightedComment = undefined;
    constructor() {
        makeObservable(this, {
            shelterData: observable,
            setShelterData: action,
            claimStatus: observable,
            setClaimStatus: action,
            highlightedComment: observable,
            setHighlightedComment: action,
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

}