import { API, Storage, Auth } from 'aws-amplify';

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

    async uploadImageToS3(file) {
        try {
            const res = await Storage.put(file.name, file, {
                contentType: file.type,
                level: "private",
            });
            const credentials = await Auth.currentUserCredentials();
            const identityId = credentials.identityId;
            const path_to_image = `private/${identityId}/${res.key}`;
            console.log("path_to_image", path_to_image);
            //ex)private/us-east-1:bc3dbc1e-2f58-47a2-824f-28ee91c077d5/Screen Shot 2022-03-10 at 12.13.54 AM.png
            return path_to_image;
        } catch (err) {
            console.log(err);
        }
    }

    //TODO Lynos: you can set up google map and call this end point to save shelters to our db
    //check backend documentation for object form 
    async upsertPost(postInformation) {
        try {
            return await API.post('SocialTechService', "/UpsertPost", {
                body: postInformation
            })
        } catch (err) {
            console.log(err);
        }
    }

    async createComment(comment) {
        try {
            return await API.post('SocialTechService', "/CreateComment", {
                body: comment
            })
        } catch (err) {
            console.log(err);
        }
    }

    async updateComment(updatedCommentInformation) {
        try {
            return await API.post('SocialTechService', "/UpdateComment", {
                body: updatedCommentInformation
            })
        } catch (err) {
            console.log(err);
        }
    }

    async deleteComment(comment_id) {
        try {
            return await API.post('SocialTechService', "/DeleteComment", {
                body: {
                    comment_id: comment_id
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    async loadComment(post_id) {
        try {
            return await API.get('SocialTechService', "/LoadComment", {
                queryStringParameters: {
                    post_id: post_id
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    async handleLike(comment_id, post_id, usernmae) {
        try {
            return await API.post('SocialTechService', "/HandleLike", {
                body: {
                    comment_id: comment_id,
                    post_id: post_id,
                    usernmae: usernmae
                }
            })
        } catch (err) {
            console.log(err);
        }

    }
}

