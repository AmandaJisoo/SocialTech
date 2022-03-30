import { API } from 'aws-amplify';

export default class APIStorage {
    async getUserStatus(username) {
        try {
            return await API.get('SocialTechService', "/GetUserStatus", {
                queryStringParameters: {
                    username: username
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}
