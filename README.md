# Requirements

1. Mongo DB
..* set connection parameter in config/default.json


# How To Use

1. Npm install
2. To Run - node bin/www
3. Starting point of API http://localhost:3000/api/v1/
..* messages
..* conversations
..* stations
..* users
..* posts
..* departments
4. use postman to test API https://www.getpostman.com/
5. for postman use basic authorization - any username and password will work. use same username across requests
5. exampleData/POPULATE_DB_ORDER.txt for order of adding items to DB
6. exampleData/* has example for adding each item. IDs will need to be altered to match your DB items


#Populate database

1. debug/populateDb.js will populate the database with - department, station,two users, 7 posts
2. username for the posts is fire
3. make sure mongo server is running before calling the script

# Structure

1. models - schema for mongo
2. routes - REST routes
3. models/all_schema.js - add any new models here
4. routes/index.js - add any new API routes here
5. config/default.json - Mongo connection params


#Create mongo user

1. run mongo from command line
2. use fire
3. db.createUser({user:'fire',pwd:'fire',roles:['readWrite','dbAdmin']});
