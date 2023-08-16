import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

// Credentials GitHub App
// App ID: 375198
// Client ID: Iv1.3f7e3abf7ce67250
// Secret Key: 252d28ea7dfd4747d2f2192fb1ed85980508091d

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    //======== Passport Github =========//
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.3f7e3abf7ce67250',
            clientSecret: '252d28ea7dfd4747d2f2192fb1ed85980508091d',
            callbackURL: 'http://127.0.0.1:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserModel.findOne({ email: profile._json.email });
                if(user){
                    console.log('User already exist');
                    return done(null, user);
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    age: 99,
                    email: profile._json.email,
                    password: profile._json.email,
                    rol: 'user'
                }

                const result = await UserModel.create(newUser);
                return done(null, result);

            } catch (e) {
                console.log('Error: ' + e.message);
                return done('Error login github: ' + e.message);
            }
        }
    ));
    //==================================//

    //======== Passport Local =========//
    // Register es el nombre para registra con local TODO: Falta obtener todos los campos del form
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age, email, password: password1, rol } = req.body;

            try{
                const user = await UserModel.findOne({ email: username });
                if(user){
                    console.log('El usuario existe');
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password),
                    rol
                }

                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch(e){
                console.log('Error: ' + e.message);
            }
        }));

    // Login es el nombre para iniciar sesión con local
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({email: username}).lean().exec();
                if(!user){
                    console.log('Usuario No existe');
                    return done(null, false);
                }

                if(!isValidPassword(user, password)) {
                    console.log('Password invalido');
                    return done(null, false);
                }

                return done(null, user);
            } catch (e) {
                console.log('Error: ' + e.message);
            }
        }
    ));
    //==================================//

    // Serializar info necesaria
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    });
}

export default initializePassport;