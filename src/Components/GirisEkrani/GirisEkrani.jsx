import React from "react";
import { grommet, Grommet, Box, Heading, Button, Text } from "grommet";
import {
  Login,
  UserFemale,
  FormNextLink,
  Spotify,
  Italic,
  Send,
  Connectivity,
  User
} from "grommet-icons";
import "./GirisEkranıArkaplan.css";

import logo from "../../images/lovelogo.png";
function Girisekrani(props) {
  return (
    <div>
      <div>
        <Grommet style={{ height: "100vh" }} theme={grommet}>
          <Box align="center" justify="center" pad="small" alignSelf="center">
            <Box
              align="center"
              justify="center"
              pad="small"
              direction="row"
              elevation="xlarge"
              round="large"
              animation={{ type: "pulse", size: "medium" }}
            >
              <Heading textAlign="center" truncate={false} color="accent-1">
                Spoti
              </Heading>
              <Heading textAlign="center" truncate={false} color="#b72a38">
                Love
              </Heading>
              <div>
                <img src={logo} alt="Logo" />
              </div>
            </Box>
            <Box
              align="center"
              justify="center"
              pad="small"
              elevation="xlarge"
              round="large"
            >
              <Button
                label="Uygulamaya gir"
                disabled={false}
                color="#b72a38"
                hoverIndicator={false}
                icon={<Login />}
                plain={false}
                primary={true}
                reverse={true}
                type="button"
                href="https://spotilove.herokuapp.com/app"
              />
              <Heading
                color="dark-2"
                level="3"
                margin="xsmall"
                size="medium"
                textAlign="center"
                truncate={false}
              >
                Sevgiyle beraber aynı şarkıda hayeller kurmak için geliştirildi
              </Heading>
            </Box>
          </Box>
          <Box
            justify="around"
            pad="small"
            fill="horizontal"
            align="center"
            direction="row"
          >
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <UserFemale size="large" />
                <FormNextLink size="large" />
                <Spotify size="large" color="accent-1" />
              </Box>
              <Text>Spotify'a giriş yap</Text>
            </Box>
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <Italic size="large" />
                <Send size="large" />
              </Box>
              <Text textAlign="center">Odayı Oluştur</Text>
            </Box>
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <Connectivity size="large" />
              </Box>
            </Box>
          </Box>
          <Box
            justify="around"
            pad="small"
            fill="horizontal"
            align="center"
            direction="row"
          >
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <User size="large" />
                <FormNextLink size="large" />
                <Spotify size="large" color="accent-1" />
              </Box>
              <Text>Spotify'a giriş yap</Text>
            </Box>
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <Italic size="large" />
                <Login size="large" />
              </Box>
              <Text textAlign="center">Odaya Gir</Text>
            </Box>
            <Box
              align="center"
              justify="center"
              pad="small"
              wrap={false}
              alignSelf="center"
            >
              <Box
                align="start"
                justify="start"
                pad="small"
                direction="row"
                wrap={false}
                alignSelf="center"
                elevation="none"
              >
                <Connectivity size="large" />
              </Box>
            </Box>
          </Box>
        </Grommet>
      </div>
    </div>
  );
}

export default Girisekrani;
