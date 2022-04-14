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

    async uploadImageToS3AndGeneratePresignedURL(file) {
        try {
            //upload it to the s3
            const res = await Storage.put(file.name, file, {
                contentType: file.type,
                level: "private",
            });
            const key = `${res.key}`;
            //get the presigned_url
            const presignedURL = await Storage.get(key, {
                level: "private",
                expires: 3600,
            });
            return presignedURL;
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

    async loadOverview(start_zipcode, end_zipcode) {
        try {
            return await API.get('SocialTechService', "/LoadOverview", {
                queryStringParameters: {
                    start_zipcode: start_zipcode,
                    end_zipcode: end_zipcode
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    async createUser(userInformation) {
        try {
            return await API.post('SocialTechService', "/CreateUser", {
                body: userInformation
            })
        } catch (err) {
            console.log(err);
        }
    }

    async handleBookmark(post_id, username) {
        try {
            return await API.post('SocialTechService', "/HandleBookmark", {
                body: {
                    post_id: post_id, 
                    username: username
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}

