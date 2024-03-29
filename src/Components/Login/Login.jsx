import React from "react";
import { Grid, Typography } from "@material-ui/core";

const Login = () => (
  <Grid container>
    <Grid item style={{ margin: "0 auto" }}>
      {/* <a
                href="http://spotify-test-backend.herokuapp.com/login"
                style={{ textDecoration: "none" }}
            > */}
      {console.log(
        "process eyv de neler oluyor" + process.env.REACT_APP_SPOTIFY_CLIENT_ID
      )
      /* prod */
      }
      <a
        href={`https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&scope=${process.env.REACT_APP_SPOTIFY_SCOPE}&response_type=token`}
        style={{ textDecoration: "none" }}
      >
        <Typography variant="h1">
          Spotify giriş ekranına yönlendiriliyor
        </Typography>
      </a>
    </Grid>
  </Grid>
);

export default Login;
