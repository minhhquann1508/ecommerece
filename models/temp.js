import { MongoClient } from 'mongodb';
import {
    ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    {
        '$match': {
            'product': new ObjectId('6538c6341a683bcc9b382564')
        }
    }, {
        '$group': {
            '_id': null,
            'averangeRating': {
                '$avg': '$rating'
            },
            'numberOfReview': {
                '$sum': 1
            }
        }
    }
];

const client = await MongoClient.connect(
    'mongodb+srv://minhhquann1508:quan1508@cluster0.acquxah.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db('data').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();