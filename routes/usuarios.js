const express = require('express');
const router = express.Router();
const User = require("../models/usuario.js");
const passport = require('passport');

//identifica o login
router.get('/login',(req,res)=>{
    res.render('login'); //renderiza a view
})
router.get('/registro',(req,res)=>{
    res.render('registro') //renderiza a view
    })
//identifica o registro
router.post('/registro',(req,res)=>{

    const {name, email, password, password2} = req.body;
    let errors = [];
    console.log(' nome: ' + name+ ' email :' + email+ ' senha:' + password);

    if(!name || !email || !password || !password2) {
    errors.push({msg : "Por favor, preencha os campos"})
    }

    if(password !== password2) {
    errors.push({msg : "As senhas não são iguais"});
    }

    if(password.length < 6 ) {
    errors.push({msg : 'A senha deve ter no mínimo 6 caracteres'})
    }

    if(errors.length > 0 ) {
    res.render('registro', {
    errors : errors,
    name : name,
    email : email,
    password : password,
    password2 : password2})
    } else {
    //validation passed
    User.findOne({email : email}).exec((err,user)=>{
    console.log(user);   
    
        if(user) {
        errors.push({msg: 'Email já existe'});
        res.render('registro',{errors,name,email,password,password2})
        
        } else {
        const newUser = new User({
            name : name,
            email : email,
            password : password
        });
            newUser.save().then((value)=>{
            console.log(value)
            req.flash('success_msg','Cadastro realizado com sucesso!');
            res.redirect('/usuarios/login');
        }).catch(value=> console.log(value));
        }
    })
    }
}) 

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
        })(req,res,next);
})

//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Logout realizado.');
res.redirect('/usuarios/login');
})

module.exports  = router;