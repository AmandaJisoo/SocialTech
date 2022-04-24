import {React, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import ShelterList from "../pages/ShelterList";
import { useStore } from '../pages/Hook';

//TODO: Yichi only show this when user is logged in as a part of menu
const Bookmarks = props => {
    const { apiStore } = useStore();
    const [loaderActive, setLoaderActive] = useState(true);
    const [shelterData, setShelterData] = useState([])

    const loadBookmarks = async () => {
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            console.log("username for bookmarks", username);
            let bookmarksResponse = await apiStore.getSavedBookmarks(username);
            let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
            //we can keep this code in case we want to load one by one async
            // bookmarksResponse.forEach(async (post_id) => {
            //     const shelterDataResponse = await apiStore.loadSummary(post_id);
            //     shelterData.push(shelterDataResponse)
            //     setShelterData(shelterData)
            //     setLoaderActive(false)
            // })
            setLoaderActive(false);
            setShelterData(shelterDataResponse)
          } catch {
            //do pop up?
        }
    }

    useEffect(() => {
        loadBookmarks();
    }, [])

    // this.context
    return <ShelterList loaderActive={loaderActive} user={props.user} setUser={props.setUser} shelterData={shelterData} setShelterData={setShelterData}/>
};

export default Bookmarks;
