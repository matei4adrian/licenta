const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const config = require("../config/config.json");
const User = require("../models").User;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id } });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: `${config.backend_url}api/auth/google/callback`,
    },
    async function (token, tokenSecret, profile, email, done) {
      await User.findOne({ where: { email: email.emails[0].value } })
        .then((currentUser) => {
          if (currentUser) {
            if (currentUser.nume == null) {
              User.update(
                {
                  nume: email.name.familyName,
                  prenume: email.name.givenName,
                  username: email.displayName,
                },
                {
                  where: {
                    id: currentUser.id,
                  },
                }
              );
            }
            return done(null, currentUser);
          } else {
            console.log("Nu ai acces!");
            return done(null, null);
          }
        })
        .catch((err) => {
          console.log(err);
          return done(err, profile);
        });
    }
  )
);
