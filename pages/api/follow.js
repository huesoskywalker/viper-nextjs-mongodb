import clientPromise from "../../lib/mongodb"

export default async function handler(req, res){

    const client = await clientPromise
    const db = client.db("viperDb")
    const viper = db.collection("user").findOne()



    
}