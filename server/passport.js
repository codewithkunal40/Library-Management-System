import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
        scope: ['profile', 'email'],

      },
      function (accessToken, refreshToken, profile, callback) {
        console.log(profile);
        callback(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
