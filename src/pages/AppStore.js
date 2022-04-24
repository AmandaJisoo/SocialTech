import { observable, action, makeObservable } from "mobx";

export default class AppStore {
    shelterData = undefined;

    constructor() {
        makeObservable(this, {
            shelterData: observable,
            setShelterData: action,
        })
    }

    setShelterData(shelter) {
        this.shelterData = shelter;
    }

}