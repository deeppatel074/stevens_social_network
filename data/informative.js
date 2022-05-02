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
            return false;
        }
        else {
            return true;
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
    async getPost() { }
}