const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections.js');
const informative = mongoCollections.informative;
const students = require('./students')
const valid = require("./valid");


module.exports = {
    async createPost(title, description, createdBy) {
        // console.log("Here in 1.1")
        title = await valid.checkString(title, 'title');
        description = await valid.checkString(description, 'description');
        createdBy = await valid.checkSessionId(createdBy);
        // console.log("Here in 1.2");
        let isUser = await students.getStudentById(createdBy);
        // console.log("Here in 1.3", isUser);
        if (!isUser) {
            throw "User Not Found!!!";
        }
        // console.log("Here in 1.4");
        let dataToInsert = {
            title: title,
            description: description,
            discussion: [],
            createdBy: ObjectId(createdBy),
            createdAt: new Date()
        };
        // console.log("Here in 1.5");
        const informativeCollection = await informative();
        const insertInfo = await informativeCollection.insertOne(dataToInsert);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            return null
        }
        else {
            const newId = insertInfo.insertedId.toString();
		    const post = await this.getPost(newId)
            return post
        }
    },
    async getAllPost(searchParam, my, studentId) {
        let filter = {};
        if (searchParam) {
            filter.title = {
                $regex: `${searchParam}`,
                $options: 'i'
            };
            filter.description = {
                $regex: `${searchParam}`,
                $options: 'i'
            };
        }
        if (my === 'true') {
            filter.createdBy = ObjectId(studentId);
        }
        const informativeCollection = await informative();
        const posts = await informativeCollection.aggregate([
            {
                $match: filter
            }, {
                $lookup:
                {
                    from: "students",
                    localField: "createdBy",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            firstName: 1,
                            lastName: 1
                        }
                    }],
                    as: "createdBy"
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    totalComments: { $size: '$discussion' },
                    createdBy: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: "America/New_York" } },
                }
            }]).toArray();
        if (posts) {
            return posts;
        }
    },
    async getPost(id) {
        id = await valid.id(id);
        const informativeCollection = await informative();
        let posts = await informativeCollection.aggregate([
            {
                $match: { _id: ObjectId(id) }
            }, {
                $lookup:
                {
                    from: "students",
                    localField: "createdBy",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            firstName: 1,
                            lastName: 1
                        }
                    }],
                    as: "createdBy"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    totalComments: { $size: '$discussion' },
                    createdBy: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: "America/New_York" } },
                }
            }]).toArray();
        if (posts.length > 0) {
            let discussion = await this.getCommentsOfPost(id);
            let sendData = posts[0];
            sendData.comments = discussion;
            return sendData;
        } else {
            throw "Post Not Found";
        }
    },
    async getCommentsOfPost(id) {
        id = await valid.id(id);
        const informativeCollection = await informative();
        const posts = await informativeCollection.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            { $unwind: "$discussion" },
            {
                $lookup:
                {
                    from: "students",
                    localField: "discussion.commentBy",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            _id: 0,
                            firstName: 1,
                            lastName: 1,
                            profileUrl: 1
                        }
                    }],
                    as: "discussion.commentBy"
                }
            },
            {
                $project: {
                    _id: 0,
                    commentBy: "$discussion.commentBy",
                    comment: "$discussion.comment",
                    commentDate: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: "America/New_York" } }
                }
            }
        ]).toArray();
        return posts;
    },
    async addCommentsToPost(postId, comment, userId) {
        postId = await valid.id(postId);
        comment = await valid.checkString(comment, 'comment');
        userId = await valid.id(userId);
        //find post
        const informativeCollection = await informative();
        const post = await informativeCollection.findOne({ _id: ObjectId(postId) });
        // console.log("Post Found");
        if (!post) {
            throw 'Post not found!!';
        }
        let commentToAdd = {
            _id: new ObjectId(),
            commentBy: ObjectId(userId),
            comment: comment,
            commentDate: new Date()
        }
        // console.log("Adding to update")
        const updateInfo = await informativeCollection.updateOne(
            { _id: ObjectId(postId) },
            { $addToSet: { discussion: commentToAdd } }
        );
        // console.log("Adding to update")
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return true;
        // update post 
    }
}