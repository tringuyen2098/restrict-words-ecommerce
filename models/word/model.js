'use strict';

const WordSchema = require('./schema');

async function list() {
    let response = [];
    try {
        const data = await WordSchema.find();
        if (data && data.length > 0) {
            response = data;
        }
    } catch (error) {}

    return response;
}

async function create(payload) {
    let response = [];

    try {
        const data = await WordSchema.create(payload);

        if(data && data._id) {
            response = data;
        }    
    } catch (error) {}

    return response;
}

module.exports = {
    create: create,
    list: list
};