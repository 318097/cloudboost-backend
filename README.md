# cloudboost-backend
Cloudboost backend challenge

'npm install' to install all the dependencies
'npm start' runs the application

There are a total of 3 APIs
> the login api : Takes a username & password. creates a JWT based on it and sends it back in response.
> Json patching api : Takes two fields using post method. the json object & the json patch object. finds the patch result using 'jsonpatch' and send the result back.
> Thumbnail api : Takes in a URL using post method. Downloads the image using 'request' & then resizes the image using 'Jimp' module.
(There is a problem with executing both the requests as they are asynchronous.)

The frontend is on angularjs
