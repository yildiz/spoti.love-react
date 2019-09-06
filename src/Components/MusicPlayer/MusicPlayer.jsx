import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  CardContent,
  CardMedia
} from "@material-ui/core";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import LeakAddTwoToneIcon from '@material-ui/icons/LeakAddTwoTone';
import Slider from "@material-ui/lab/Slider";
import { TrackDetailsLink } from "../UI/TrackDetailsLink";
import RoomLogin from "../RoomLogin/RoomLogin";
import io from "socket.io-client";


class MusicPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceId: null,
      playingInfo: null,
      playing: false,
      positionSliderValue: 50,
      volumeSliderValue: 50,
      positionStamp: "00:00",
      //durationStamp: '00:00',
      player_init_error: false
    };

    this.player = null;
    this.playerCheckInterval = null;
    this.positionCheckInterval = null;
    this.socket = null;
  }

  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  senkronizeEt = ()=>{
    console.log("4 numarlı bağlantı gerçekleşti")
    this.socket.emit("şarkıBilgileriniGönder",{
      sarkiadi : this.state.playingInfo,
      sarkiZamani : this.props.pozition_stamp
    });
  };

  gelenSarkiyiCal = (sarkı,zaman)=>{
    if((sarkı === this.state.playingInfo.track_window.current_track)  && 
       ((this.props.pozition_stamp + 1000) <= zaman || (this.props.pozition_stamp-1000) <= zaman  )){
         console.log("herşey yolunda herhangi bir düzeltmeye gerek yok")
       }else{
    this.props.playSong(
      JSON.stringify({
        context_uri: sarkı.album.uri,
        offset: {
          uri: sarkı.uri
        }
      })
    );
    this.onSeekSliderChange("1.yi boş bırakmaları bence çok ilginç bekki bi ara düzeltirim",zaman)
  }};

  checkForPlayer = () => {
    const token = this.props.user.access_token;

    if (window.Spotify) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "SPOTİ.LOVE",
        getOAuthToken: cb => {
          cb(token);
        }
      });
    }

    if (this.player) {
      this.createEventHandlers();
      this.socket = io.connect("http://localhost:5000");
      this.player.connect();
    }
  };

  createEventHandlers = () => {
    this.player.on("initialization_error", e => {
      console.error("Initialization error ", e);
      this.setState({ player_init_error: true });
    });
    this.player.on("authentication_error", e =>
      console.error("Authentication error ", e)
    );
    this.player.on("account_error", e => console.error("Account error ", e));
    this.player.on("playback_error", e => console.error("Playback error ", e));

    this.player.on("player_state_changed", state => {
      if (state) {
        let { duration, position } = state;
        // duration = 100%
        // position = ?%
        let val = (position * 100) / duration;
        this.setState({
          playingInfo: state,
          playing: !state.paused,
          positionSliderValue: val
        });
        if (this.props.isPlaying === state.paused) {
          this.props.setIsPlaying(!state.paused);
        }
        if (
          !this.props.currentlyPlaying ||
          this.props.currentlyPlaying !== state.track_window.current_track.name
        ) {
          let { current_track } = state.track_window;
          this.props.setCurrentlyPlaying(current_track.name);
        }
      }
    });

    this.player.on("ready", data => {
      let { device_id } = data;
      console.log("PLAYER CONNECTED ", device_id);
      // await this.setState({ deviceId: device_id });
      this.setState({ deviceId: device_id }, () => {
        this.transferPlaybackHere();
      });
      this.player.getVolume().then(vol => {
        let volume = vol * 100;
        this.setState({ volumeSliderValue: volume });
      });
      this.positionCheckInterval = setInterval(() => {
        this.checkChangePosition();
      }, 1000);
    });
  };

  checkChangePosition = () => {
    this.player.getCurrentState().then(state => {
      if (state && this.state.playing) {
        let { duration, position } = state;
        // duration = 100%
        // position = ?%
        let val = (position * 100) / duration;
        if (val !== this.state.positionSliderValue) {
          this.setState({
            positionSliderValue: val
          });
        }

        let positionStamp = this.milisToMinutesAndSeconds(state.position);
        let durationStamp = this.milisToMinutesAndSeconds(state.duration);

        this.setState({ positionStamp, durationStamp });
        this.props.setPozitionStamp(state.position);
        this.props.setDurationStamps(state.duration);
        console.log(state.duration);
      }
    });
  };

  transferPlaybackHere = () => {
    // ONLY FOR PREMIUM USERS - transfer the playback automatically to the web app.
    // for normal users they have to go in the spotify app/website and change the device manually
    // user type is stored in redux state => this.props.user.type
    if (this.props.user.product === "premium") {
      const { deviceId } = this.state;
      fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.props.user.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false
        })
      })
        .then(res => console.log(res))
        .catch(e => console.error(e));
    } else {
      console.log(
        "Cannot transfer playback automatically because you are not a premium user."
      );
    }
  };

  onPrevClick = () => {
    this.player.previousTrack();
  };

  onPlayClick = () => {
    this.player.togglePlay();
  };

  onNextClick = () => {
    this.player.nextTrack();
  };

  onSeekSliderChange = (e, val) => {
    // duration = 100%
    // ? = val%
    let dur = this.state.playingInfo.duration;
    let seek = Math.floor((val * dur) / 100); // round number
    this.setState({ positionSliderValue: val });
    console.log("valu değeri  " + val);
    console.log("e değeri:  " + e);
    this.player.seek(seek).then(() => {
      console.log(`Seek song to ${seek} ms`);
    });
  };

  onVolumeSliderChange = (e, val) => {
    let volume = val / 100; // val is between 0-100 and the volume accepted needs to be between 0-1
    this.setState({ volumeSliderValue: val });
    this.player.setVolume(volume);
  };

  milisToMinutesAndSeconds = mil => {
    let minutes = Math.floor(mil / 60000);
    let seconds = ((mil % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  render() {
    // 1 yeni oda yaratanlar buraya düşecek
    if (this.props.yaratlanOdaAdi && !this.props.kavusma ) {
      this.socket.emit("1nolu bağlantı OdayaKatıl", { name: this.props.yaratlanOdaAdi });
      console.log(this.props.yaratlanOdaAdi + " odaya katıdın");

       // 3 kavuşma sonrası beklenen an geldiğinde
      this.socket.on("3nolu bağlantı Sevdiğin Geldi", (i) => {
        console.log(i.kisisayisi)
        alert("Sevgilin geldi seni dinlemeye hazır.")
        this.props.setKavusma(true);
        this.senkronizeEt();
      
      });
    } 
    
    // 2 odaya katıl seçeneğinden gelenler buraya düşecek
    if (this.props.girilenOdaAdi) {
      this.socket.emit("1nolu bağlantı OdayaKatıl", { name: this.props.girilenOdaAdi } );
      console.log('bağlantı onayı bekleniyor'+this.props.girilenOdaAdi);
      this.socket.on('3nolu bağlantı Sevdiğin Geldi',()=>{
        console.log("oda adı girildi ve 3 numaralı bağlantı gerçekleşti")
        this.props.setKavusma(true); 
      })
           
    };    
    
   
    
    // Yönlendiren komutları buradan sunucuya gönderecek
    if (this.props.yaratlanOdaAdi && this.props.kavusma){
      console.log("sevdiğiniz geldi artık siz yönlendiricisiniz.");
      //ilk bağlanıldığında şarkı adını, zamanını  gönder
      // 4 şarkı bilgilerini gönder
      // sonrasında buton koyup ara ara tekrar senkronize etmek için fonksiyon olarak kaydettim
      this.senkronizeEt();

    };
    
    // 5 Yönlendirme komutları buraya düşer 
    if (this.props.girilenOdaAdi && this.props.kavusma){
      console.log("sevgiline bağlandın artık yönlendirinsin")
      this.socket.on('gelenŞarkıBilgileriniÇal', (data) => {
        console.log(data)
        console.log(data.dataSarkı.sarkiZamani)
        //this.gelenSarkiyiCal(data.dataSarkı.sarkiadi.track_window.current_track+data.dataSarkı.sarkiZamani)
      })
    };
    
    let mainContent = (
      <Card
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: 100
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          style={{ marginTop: 20 }}
        >
          Oynatıcıyı etkinleştirmek için Spotify uygulamasına gidin, cihazlara
          tıklayın ve SPOTİ.LOVE uygulamasını seçin
        </Typography>
      </Card>
    );

    if (this.state.player_init_error) {
      mainContent = (
        <Typography variant="h3">
          Cihazınız Spotify WEP SDK'yı desteklemiyor Lütfen Bilgisayar
          tarayıcısı kullanmayı deneyin
        </Typography>
      );
    }

    if (this.player && this.state.playingInfo) {
      
      mainContent = (
        <Card style={{ position: "fixed", bottom: 0, width: "100%" }}>
          <Grid
            container
            justify="space-between"
            spacing={0}
            style={{ width: "100%", margin: 0 }}
          >
            <Grid item xs={3}>
              <Card
                style={{
                  display: "flex",
                  height: "100%",
                  boxShadow: "none"
                }}
              >
                <CardMedia
                  style={{
                    width: 80,
                    height: 80,
                    margin: 10
                  }}
                  image={
                    this.state.playingInfo.track_window.current_track.album
                      .images[0].url
                  }
                  title={this.state.playingInfo.track_window.current_track.name}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "16",
                    paddingBottom: "16"
                  }}
                >
                  <CardContent style={{ flex: "1 0 auto" }}>
                    <Typography variant="h5">
                      {this.state.playingInfo.track_window.current_track.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      <TrackDetailsLink
                        to={
                          "/album/" +
                          this.state.playingInfo.track_window.current_track.album.uri.substring(
                            14
                          )
                        }
                      >
                        {
                          this.state.playingInfo.track_window.current_track
                            .album.name
                        }
                      </TrackDetailsLink>
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <div style={{ textAlign: "center" }}>
                <IconButton
                  disabled={
                    this.state.playingInfo.track_window.previous_tracks
                      .length === 0
                  }
                  aria-label="Previous"
                  onClick={this.onPrevClick}
                >
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton aria-label="Play/Pause" onClick={this.onPlayClick}>
                  {this.state.playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton aria-label="Play/Pause" onClick={this.senkronizeEt}>
                  {this.props.kavusma ? <LeakAddTwoToneIcon/> : <PlayArrowIcon />}
                </IconButton>

                <IconButton
                  disabled={
                    this.state.playingInfo.track_window.next_tracks.length === 0
                  }
                  aria-label="Next"
                  onClick={this.onNextClick}
                >
                  <SkipNextIcon />
                </IconButton>
              </div>
              <Grid container>
                <Grid
                  item
                  xs={2}
                  style={{
                    textAlign: "center",
                    marginTop: 5
                  }}
                >
                  <Typography>{this.state.positionStamp}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Slider
                    value={this.state.positionSliderValue}
                    onChange={this.onSeekSliderChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{
                    textAlign: "center",
                    marginTop: 5
                  }}
                >
                  <Typography>{this.state.durationStamp}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <div style={{ marginTop: 53 }}>
                <Slider
                  value={this.state.volumeSliderValue}
                  onChange={this.onVolumeSliderChange}
                />
              </div>
            </Grid>
          </Grid>
        </Card>
      );
    }
    return (
      <div>
        <RoomLogin></RoomLogin>
        <CssBaseline>{mainContent}</CssBaseline>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.current_user,
    playNow: state.play_now,
    currentlyPlaying: state.currently_playing,
    isPlaying: state.isPlaying,
    pozition_stamp: state.pozition_stamp,
    durationStamps: state.durationStamps,
    yaratlanOdaAdi: state.yaratlanOdaAdi,
    girilenOdaAdi: state.girilenOdaAdi,
    kavusma: state.kavusma
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPlayNow: () => dispatch({ type: actionTypes.RESET_PLAY_NOW }),
    setCurrentlyPlaying: song =>
      dispatch({ type: actionTypes.SET_CURRENTLY_PLAYING, song }),
    setIsPlaying: isPlaying =>
      dispatch({ type: actionTypes.SET_IS_PLAYING, isPlaying }),
    setPozitionStamp: pozition_stamp =>
      dispatch({ type: actionTypes.NOW_POZITION_STAMP, pozition_stamp }),
    setDurationStamps: durationStamps =>
      dispatch({ type: actionTypes.DURATION_STAMP, durationStamps }),
    setKavusma: kavusma => dispatch({ type: actionTypes.KAVUSMA, kavusma }),
    playSong: uris => dispatch(actionTypes.playSong(uris))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MusicPlayer);
