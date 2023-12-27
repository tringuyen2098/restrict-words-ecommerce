'use strict';

const FeedbackSchema = require('./schema');

async function list() {
    let response = [];
    try {
        const data = await FeedbackSchema.find();
        if (data && data.length > 0) {
            response = data;
        }
    } catch (error) {}

    return response;
}

async function create(payload) {
    let response = [];

    try {
        const data = await FeedbackSchema.create(payload);

        if(data && data._id) {
            response = data;
        }    
    } catch (error) {}

    return response;
}

async function remove(payload) {
    let response = [];

    try {
        const data = await FeedbackSchema.findByIdAndDelete(payload);

        if(data && data._id) {
            response = data;
        }    
    } catch (error) {}

    return response;
}

async function getById(id) {

    let response = [];

    try {
        const data = await FeedbackSchema.findById(id);

        if(data && data._id) {
            response = data;
        }    
    } catch (error) {}

    return response;
}



module.exports = {
    create: create,
    list: list,
    remove: remove,
    getById: getById
};