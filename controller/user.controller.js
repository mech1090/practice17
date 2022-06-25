const userService = require('../service/user.service')
const bcrypt = require('bcrypt')
const config = require('config')
const {userValidation} = require('../validation/user.validation')

const getLoginForm = (req,res)=>{
    return res.render('login/layout')
}

const login = async(req,res)=>{
    const {email,password} = req.body
    const fields = {email,password}
    const findEmail = await userService.getEmail({email})
    if(!findEmail){
        return res.render('signup/layout',{message:"User does not Exist Signup"})
    }
    const matchPassword = await bcrypt.compare(password,findEmail.password)
    if(!matchPassword){
        return res.render('login/layout',{message:'Credentials Mismatched'})
    }
    return res.render('user/layout')

}

const getSignupForm = (req,res)=>{
    return res.render('signup/layout')
}

const signup = async(req,res)=>{
    const {email,password} = req.body
    const fields = {email,password}
    const {error,value} = userValidation(fields)
    if(error){
        return res.render('signup/layout',{message:error.details[0].message})
    }
    const findEmail = await userService.getEmail({email})
    if(findEmail){
        return res.render('login/layout',{message:"User Exist Login Here"})
    }
    const hashPassword = await bcrypt.hash(password,config.get('hash.salt'))
    const createUser = await userService.createEntries({email,password:hashPassword})
    return res.render('signup/layout',{message:'User Created'})
    
}

module.exports = {getLoginForm,login,getSignupForm,signup}