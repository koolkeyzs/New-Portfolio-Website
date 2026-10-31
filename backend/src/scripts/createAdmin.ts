import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config"
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import readline from "node:readline/promises"
import { stdin as input , stdout as output } from "node:process"

import connectDb from "../config/db"
import Admin from "../models/admin"

const rl = readline.createInterface({input , output})

const createAdmin = async ()=>{
   try{
    await connectDb()

    const existingAdmin = await Admin.findOne()

    if (existingAdmin){
        console.log('An admin as already been created')
        return
    }

    const name = await rl.question('Enter Admin name: ')
    const email = await rl.question('Enter Admin email: ')
    const password = await rl.question('Enter Admin password: ')

    if(!name.trim() || !email.trim() || !password.trim()){
        throw new Error ('All field required')
    }

    if(password.length < 8){
        throw new Error ('Password must be greater that 8')
    }


    const hashedPassword = await bcrypt.hash(password , 12)

    Admin.create({
        name,
        email,
        password: hashedPassword
    })
       
    console.log('Admin account successfuly created')
   }catch(error){
       console.error('Admin creation failed' , error)
   }finally{
    rl.close()
    await mongoose.disconnect()
   }

}


    createAdmin()