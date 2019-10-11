import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import { Send, Sync, Login, Run } from "grommet-icons";
import {
  Grommet,
  TextInput,
  Heading,
  Paragraph,
  Box,
  TextArea,
  Button
} from "grommet";
import { grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import io from "socket.io-client";
const customTheme = deepMerge(grommet, {
  textInput: {
    extend: () => `
        font-size: 20px;
        background: #6af522;
        width: 300px;
        margin: 0 auto;
        &:focus {
          box-shadow: none;
          border-color: initial;
        }
      `,
    container: {
      extend: () => `
          background: #569437;
          height: 100px;
          width: 400px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          border-radius: 10px;
        `
    },
    placeholder: {
      extend: () => `
          width: 100%;
          color: #1e1a11;
        `
    },
    suggestions: {
      extend: () => `
          background: #f01a5e;
          color: #3d3522;
          li {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          }
        `
    }
  }
});

class RoomLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      odaOlustur: false,
      odayaGisisYap: false,
      odayaSevgilinBekleniyor: false,
      girisYapilacakOdaAdi: "",
      segilidenGelenSevgiliKodu: "",
      yazdigimMesaj: "",
      gelenMesaj: ""
    };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io.connect("https://spotilovebackend.herokuapp.com/");
  }
  //Mesajlaşma için Gerekli Fonksiyonlar
  yazdiginMesajıGönder = () => {
    this.socket.emit("mesaj Geldi", {
      name: this.state.yazdigimMesaj
    });
  };
  mesajGeldi = geldi => {
    console.log("gelen mesaj");
    console.log(geldi);
    //this.setState({ gelenMesaj: geldi });
  };

  //Odalarla İlgili Fonsiyonlar
  odaOlusturucuMenusunuAc = () => this.setState({ odaOlustur: true });
  odayaGirisYapmaMenusunuAc = () => this.setState({ odayaGisisYap: true });
  girisYapilacakOdaAdifc = event =>
    this.setState({ girisYapilacakOdaAdi: event.target.value });
  odayaGirisYapmaUygulamasınıCalıstır = () => {
    this.props.setYaretılanOdaAdı(this.state.girisYapilacakOdaAdi);
    this.setState({ odayaSevgilinBekleniyor: true });
  };
  odayaSevgiliGirmedenCikma = () => {
    this.setState({ odaOlustur: false });
    this.setState({ odayaGisisYap: false });
    this.setState({ odayaSevgilinBekleniyor: false });
    this.setState({ girisYapilacakOdaAdi: "" });
  };
  sevgilidenKodGeldiOdayaGirisYap = () => {
    this.props.setGirilenOdaAdi(this.state.segilidenGelenSevgiliKodu);
  };

  verigönder = sarkibilgi => {
    return new Promise((resolve, reject) => {
      if (sarkibilgi) {
        resolve(sarkibilgi);
      } else {
        reject("önce spotify a girip spoli.love dan gieleme seçeneğini seçin");
      }
    });
  };

  gelenSarkiBilgileriniCal = data => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data);
      } else {
        reject("herşey tamam");
      }
    });
  };

  senkronizeEt = async () => {
    await this.props.surebul();
    setTimeout(
      this.verigönder(this.props.song)
        .then(data => {
          let sarkisuresi = this.props.value;
          console.log("gönderilecek" + sarkisuresi);
          const gonderilecekDosya = [data, sarkisuresi];
          return gonderilecekDosya;
        })
        .then(gonderilecekDosya => {
          this.socket.emit("şarkıBilgileriniGönder", {
            sarkiadi: gonderilecekDosya[0],
            sarkizamani: gonderilecekDosya[1]
          });
          console.log("4 numarlı bağlantı gerçekleşti");
        })
        .catch(() => {
          console.log("veriler bi şekilde gitmedi bi araştır onu ");
        }),
      3000
    );
  };

  render() {
    // 1 yeni oda yaratanlar buraya düşecek
    if (this.props.yaratlanOdaAdi && !this.props.kavusma) {
      this.socket.emit("1nolu bağlantı OdayaKatıl", {
        name: this.props.yaratlanOdaAdi
      });
      console.log(this.props.yaratlanOdaAdi + " odaya katıdın");

      // 3 kavuşma sonrası beklenen an geldiğinde

      this.socket.on("3nolu bağlantı Sevdiğin Geldi", i => {
        console.log(i.kisisayisi);
        console.log("Sevgilin geldi seni dinlemeye hazır.");
        this.props.setKavusma(true);
      });
    }
    // 2 odaya katıl seçeneğinden gelenler buraya düşecek
    if (this.props.girilenOdaAdi && !this.props.kavusma) {
      this.socket.emit("1nolu bağlantı OdayaKatıl", {
        name: this.props.girilenOdaAdi
      });
      console.log("bağlantı onayı bekleniyor" + this.props.girilenOdaAdi);
      this.socket.on("3nolu bağlantı Sevdiğin Geldi", () => {
        console.log("oda adı girildi ve 3 numaralı bağlantı gerçekleşti");
        this.props.setKavusma(true);
      });
    }
    // 5 Yönlendirme komutları buraya düşer
    if (this.props.girilenOdaAdi) {
      this.socket.on("gelenŞarkıBilgileriniÇal", data => {
        console.log(data);
        this.props.sarkiyiVeSuresiniAyarla(
          data.dataSarkı.sarkiadi.track_window.current_track.uri,
          data.dataSarkı.sarkiadi.track_window.current_track.album.uri,
          data.dataSarkı.sarkizamani
        );
      });
      this.socket.on("gelen Mesaj", dataMesaj => {
        this.state.mesajGeldi(dataMesaj);
      });
    }

    if (this.props.yaratlanOdaAdi) {
      this.socket.on("gelen Mesaj", dataMesaj => {
        this.state.mesajGeldi(dataMesaj);
      });
    }
    //hekesin ilk olarak gördüğü ana pencere

    //baya bi gelişme olacak
    let girisKontrol = (
      <div>
        <Box align="center" pad="large">
          <Box direction="row" align="center" gap="small" pad="xsmall">
            <Button
              color="#BF6900"
              onClick={this.odaOlusturucuMenusunuAc}
              label="Ben Çalayım Sevgilim Dinlesin"
            />
            <br />
            <Button
              label="Sevdiğim Çalsın Ben Dinlerim"
              color="#BF6900"
              onClick={this.odayaGirisYapmaMenusunuAc}
            />
          </Box>
        </Box>
      </div>
    );
    //odayı oluşturmak üzere olanın gördüğü
    if (this.state.odaOlustur) {
      girisKontrol = (
        <div>
          <Heading level={2}>
            Oluşturulacak odanın adı sevgilin bu kod ile giriş yapacak
          </Heading>
          <form noValidate>
            <TextInput
              placeholder="Mecnun Leylaya abayı yaktı"
              value={this.state.girisYapilacakOdaAdi}
              onChange={event =>
                this.setState({ girisYapilacakOdaAdi: event.target.value })
              }
            />
            <br />
            <Button
              label="Odayı Oluştur"
              color="#BF6900"
              onClick={this.odayaGirisYapmaUygulamasınıCalıstır}
            />
          </form>
        </div>
      );
    }
    // odayı oluşturanın kavuşma olana kadar gördüğü
    if (this.state.odayaSevgilinBekleniyor) {
      girisKontrol = (
        <div>
          <Heading level={3}>Sevgili Kodu:</Heading>
          <Heading level={1}>{this.state.girisYapilacakOdaAdi}</Heading>
          <Paragraph>
            Sevdiğin insanla kalbinin aynı ritimde atması için sevdiğinin
            izlemesi gereken birkaç basit adım
            <br />
            1 : spoti.love sitesine giriş yapmak
            <br />
            2 : Spotify Preminum hesabı ile giriş yapmak
            <br />3 : odada katıl butonuna basıp oda adına belirlediğin sevgili
            kodunu girmesi
          </Paragraph>
          <Heading level={3}>Gönüllerin Efendisi Bekleniyor...</Heading>
          <Button
            icon={<Run />}
            label="Gelmeden"
            color="#BF6900"
            onClick={this.odayaSevgiliGirmedenCikma}
          />
        </div>
      );
    }
    // Gelen Sevgili kodunun yazılacağı ekran
    if (this.state.odayaGisisYap) {
      girisKontrol = (
        <div>
          <Heading level={2}>Sevdiğinden gelen sevgili kodunu girin:</Heading>
          <form noValidate>
            <TextInput
              placeholder="sevgilinin senin için belirlediği kod"
              value={this.state.segilidenGelenSevgiliKodu}
              onChange={event =>
                this.setState({ segilidenGelenSevgiliKodu: event.target.value })
              }
            />
            <br />
            <Button
              icon={<Run />}
              label="Çıkış yap"
              color="#343330"
              margin="medium"
              onClick={this.odayaSevgiliGirmedenCikma}
            />
            <Button
              icon={<Login />}
              label="Giriş Yap"
              color="#D72638"
              margin="medium"
              onClick={this.sevgilidenKodGeldiOdayaGirisYap}
            />
          </form>
        </div>
      );
    }

    // kavuşmadan sonraki alan
    if (this.props.kavusma) {
      girisKontrol = (
        <div>
          {this.props.yaratlanOdaAdi ? (
            <Button
              icon={<Sync />}
              label="Senkronize et"
              color="#D72638"
              onClick={this.senkronizeEt}
            />
          ) : (
            <h5>sadece karşı taraf senkronize edebiliyor</h5>
          )}
          <br />
          <div>{this.state.gelenMesaj}</div>
          <br />
          <TextArea
            placeholder="Örn: Sana olan aşkımı anlatan şarkı"
            value={this.state.yazdigimMesaj}
            onChange={event =>
              this.setState({ yazdigimMesaj: event.target.value })
            }
          />
          <br />
          <Button
            icon={<Send />}
            label="Gönder"
            onClick={this.yazdiginMesajıGönder}
          />
        </div>
      );
    }
    return (
      <div>
        <Grommet full theme={customTheme}>
          <Box
            border={{ color: "brand", size: "large" }}
            pad="xlarge"
            align="center"
            alignSelf="center"
          >
            {girisKontrol}
          </Box>
        </Grommet>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    yaratlanOdaAdi: state.yaratlanOdaAdi,
    girilenOdaAdi: state.girilenOdaAdi,
    pozition_stamp: state.pozition_stamp,
    kavusma: state.kavusma
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setYaretılanOdaAdı: yaratlanOdaAdi =>
      dispatch({ type: actionTypes.YARATILAN_ODA_ADI, yaratlanOdaAdi }),
    setGirilenOdaAdi: girilenOdaAdi =>
      dispatch({ type: actionTypes.GIRILEN_ODA_ADI, girilenOdaAdi }),
    setIsPlaying: isPlaying =>
      dispatch({ type: actionTypes.SET_IS_PLAYING, isPlaying }),

    setKavusma: kavusma => dispatch({ type: actionTypes.KAVUSMA, kavusma }),
    playSong: uris => dispatch(actionTypes.playSong(uris))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomLogin);
