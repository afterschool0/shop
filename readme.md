
db.createUser({user: "admin",pwd: "Nipp0nbashi7",roles:[{role: "userAdminAnyDatabase",db: "admin"}]})


use contact
db.createUser({user:"webshopmaster",pwd: "Nipp0nbashi7",roles:[ "readWrite", "dbOwner" ]})

