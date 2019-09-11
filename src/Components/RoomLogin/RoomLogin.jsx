import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { createMuiTheme,  makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green} from '@material-ui/core/colors';
import { ThemeProvider } from 'styled-components'
import TextField from '@material-ui/core/TextField';
import { Grommet,TextInput,Heading,Paragraph,Box} from 'grommet';
import { grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import io from "socket.io-client";
import { reject } from 'q';


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

class RoomLogin extends Component{
    constructor(props) {
        super(props);

        this.state = {
            odaOlustur:false,
            odayaGisisYap:false,
            odayaSevgilinBekleniyor:false,
            girisYapilacakOdaAdi:"",
            segilidenGelenSevgiliKodu:"",
        };
        this.socket = null;
        
    }

    componentDidMount() {
        this.socket = io.connect("http://localhost:5000/");  
    }
    
    
    odaOlusturucuMenusunuAc = ()=> this.setState({odaOlustur: true});
    odayaGirisYapmaMenusunuAc = () => this.setState({odayaGisisYap: true});
    girisYapilacakOdaAdifc = (event)=> this.setState({girisYapilacakOdaAdi:event.target.value});
    odayaGirisYapmaUygulamasınıCalıstır=()=>{
        alert("girilecek oda adı "+ this.state.girisYapilacakOdaAdi);
        this.props.setYaretılanOdaAdı(this.state.girisYapilacakOdaAdi)
        this.setState({odayaSevgilinBekleniyor:true})};
    odayaSevgiliGirmedenCikma = () =>{
        alert(" belki gelirdi biraz ecele ettin sanki  ");
        this.setState({odaOlustur: false});
        this.setState({odayaGisisYap: false});
        this.setState({odayaSevgilinBekleniyor: false});
        this.setState({girisYapilacakOdaAdi: ""});};
    sevgilidenKodGeldiOdayaGirisYap = () =>{
        alert("sevgilinin odasına bağlandın"+this.state.segilidenGelenSevgiliKodu+"odasına bağlandın")
        this.props.setGirilenOdaAdi(this.state.segilidenGelenSevgiliKodu)
    };

    verigönder =(sarkibilgi)=>{
      return new Promise((resolve, reject)=>{
        if(sarkibilgi){
          resolve(sarkibilgi)
        }else{
          reject("önce spotify a girip spoli.love dan gieleme seçeneğini seçin")
        }
      })
    }
    
    gelenSarkiBilgileriniCal = (data) =>{
      return new Promise((resolve,reject)=>{
        //Aynı şarkı ve yakın zamanlardaysa  
        if ((data.dataSarkı.sarkiadi.track_window.current_track.id === this.props.song.track_window.current_track.id)&& !((this.props.song.position+1000>= data.dataSarkı.sarkiadi.position) || (this.props.song.position-1000<= data.dataSarkı.sarkiadi.position))
           ){
            reject("herşey tamam")
          }else{//ikisinden biri farklıysa ayarlama başlasın
            resolve(data)
          }

      })
    }
    
/*
    gelenSarkiyiCal = (sarki,zaman)=>{
        console.log("gelen şarkı süresi: ");
        console.log(zaman);
        console.log("sistemdeki şarkı süresi: ");
        console.log(this.props.song );
        
        //çalan şarkı ile gelen şarkının aynı olup olmadığını kontrol et
        if(sarki.id === this.props.song.track_window.current_track.id){
             console.log("Şarkı aynı değiştirmeye gerek yok ")
           }else{//farklı ise gelen şarkıyı çal
        this.props.playSong(
          JSON.stringify({
            context_uri: sarki.album.uri,
            offset: {
              uri: sarki.uri
            }
          })
        );
        //şarkı süresi ile gelen şarkı süresi karşılaştır aynı ise bişey yapma farklı ise değiştir
        if( !((this.props.song.position+1000>= zaman) || (this.props.song.position-1000<= zaman))){          
          this.props.zamanagit(zaman)
        }
     }
    
    };
*/
    senkronizeEt = ()=>{    
        console.log("4 numarlı bağlantı gerçekleşti")
        this.verigönder(this.props.song)
          .then((data)=>{
            this.props.surebul()
          })
          .then((data)=>{
            let sarkisuresi = this.props.pozition_stamp;
            console.log(sarkisuresi)
            const gonderilecekDosya=[ data,sarkisuresi]
            return gonderilecekDosya
          }).then((gonderilecekDosya)=>{

            this.socket.emit("şarkıBilgileriniGönder",{
              sarkiadi : gonderilecekDosya[0],
              sarkizamani : gonderilecekDosya[1]
            });
          })
        
        

      };
    

    render(){
        // 1 yeni oda yaratanlar buraya düşecek
    if (this.props.yaratlanOdaAdi && (!this.props.kavusma) ) {
        this.socket.emit("1nolu bağlantı OdayaKatıl", { name: this.props.yaratlanOdaAdi });
        console.log(this.props.yaratlanOdaAdi + " odaya katıdın");
  
         // 3 kavuşma sonrası beklenen an geldiğinde
        
        this.socket.on("3nolu bağlantı Sevdiğin Geldi", (i) => {
          console.log(i.kisisayisi)
          console.log("Sevgilin geldi seni dinlemeye hazır.")
          this.props.setKavusma(true);
        
        });
      };
      // 2 odaya katıl seçeneğinden gelenler buraya düşecek
      if (this.props.girilenOdaAdi && (!this.props.kavusma)) {
        this.socket.emit("1nolu bağlantı OdayaKatıl", { name: this.props.girilenOdaAdi } );
        console.log('bağlantı onayı bekleniyor'+this.props.girilenOdaAdi);
        this.socket.on('3nolu bağlantı Sevdiğin Geldi',()=>{
          console.log("oda adı girildi ve 3 numaralı bağlantı gerçekleşti")
          this.props.setKavusma(true); 
        })
             
      }; 
      // 5 Yönlendirme komutları buraya düşer 
      if (this.props.girilenOdaAdi && this.props.kavusma){
        this.socket.on('gelenŞarkıBilgileriniÇal', (data) => {
          console.log(data)
          this.gelenSarkiBilgileriniCal(data)
            .then((data)=>{
              if( data.dataSarkı.sarkiadi.track_window.current_track.id === this.props.song.track_window.current_track.id){
                console.log("şarkı aynı ayrı birdüzeltmeye gerek yok")
                return data
              }else{
                console.log("şarkı farklı değiştiriliyor")
                this.props.playSong(
                  JSON.stringify({
                    context_uri: data.dataSarkı.sarkiadi.track_window.current_track.album.uri,
                    offset: {
                      uri: data.dataSarkı.sarkiadi.track_window.current_track.uri
                    }
                  })
                ); 
                return data
              };
            })
          .then((data)=>{
            if( !((this.props.song.position+1000>= data.dataSarkı.sarkiadi.position) || (this.props.song.position-1000<= data.dataSarkı.sarkiadi.position)))
              {
                console.log("şarkı zamanı ayarlanıyor")
              }else 
              this.props.zamanagit(data.sarkizamani)
              console.log("şarkı zamanı aynı")
            return data            
            })
          .catch((herseyTamOlmasıGrektigiGibi)=>{
            console.log(herseyTamOlmasıGrektigiGibi);
          });
        });

          //this.gelenSarkiyiCal(data.dataSarkı.sarkiadi.track_window.current_track,data.dataSarkı.sarkiadi.position)
      };




        let girisKontrol=(
            <div>
                 <Box align="center" pad="large">
                    <Box direction="row" align="center" gap="small" pad="xsmall">
                        <Button variant="contained" color="primary" onClick={this.odaOlusturucuMenusunuAc}>
                            Ben Çalayım Sevgilim Dinlesin
                        </Button>
                        <br></br>

                        <Button variant="contained" color="primary"  onClick={this.odayaGirisYapmaMenusunuAc}>
                            Sevdiğim Çalsın Ben Dinlerim
                        </Button>
                    </Box>
                </Box>
            </div>
        );
        if(this.state.odaOlustur){
          girisKontrol=(
            <form  noValidate>
                 <TextInput
                    value={this.state.girisYapilacakOdaAdi}
                    onChange={event => this.setState({ girisYapilacakOdaAdi: event.target.value })}
                />
                <br/>
                <Button variant="contained" color="primary"  onClick={this.odayaGirisYapmaUygulamasınıCalıstır}>
                      Odayı Oluştur
                </Button>

            </form>
          )
        };
        if(this.state.odayaSevgilinBekleniyor){
            girisKontrol=(
                <div>
                <Heading level={3}>Sevgili Kodu:</Heading>
                <Heading level={1}>{this.state.girisYapilacakOdaAdi}</Heading>
                <Paragraph>
                Sevdiğin insanla kalbinin aynı ritimde atması için sevdiğinin izlemesi gereken birkaç basit adım<br />
                1 : spoti.love sitesine giriş yapmak<br />
                2 : Spotify Preminum hesabı ile giriş yapmak<br />
                3 : odada katıl butonuna basıp oda adına belirlediğin sevgili kodunu girmesi 
                </Paragraph>
                <Heading level={3}>Gönüllerin Efendisi Bekleniyor...</Heading>
                <Button variant="contained" color="primary"  onClick={this.odayaSevgiliGirmedenCikma}>
                      Çıkış yap
                </Button>
                </div>
            );
        };
        if(this.state.odayaGisisYap){
            girisKontrol=(
                <div>
                <Heading margin="small"> Sevdiğinden gelen sevgili kodunu girin</Heading>
                <form  noValidate>
                <TextInput
                    placeholder={<span>Sevgili Kodu</span>}
                    value={this.state.segilidenGelenSevgiliKodu}
                    onChange={event => this.setState({ segilidenGelenSevgiliKodu: event.target.value })}
                /><br/>
                <Button variant="contained" color="primary"  onClick={this.odayaSevgiliGirmedenCikma}>
                      Çıkış yap
                </Button>
                <Button variant="contained" color="primary"  onClick={this.sevgilidenKodGeldiOdayaGirisYap}>
                      Giriş Yap
                </Button>
                </form>
                </div>
            );
        }
             
        if (this.props.yaratlanOdaAdi  && this.props.kavusma){
            girisKontrol=(
                <div>
                    <Button variant="contained" color="primary"  onClick={this.senkronizeEt}>
                        Senkronize et
                    </Button>
                </div>
            )
        }
        return(
        <div>  
            <Grommet full theme={customTheme}>
                <Box border={{ color: 'brand', size: 'large' }} pad='xlarge' align="center" alignSelf="center" >
                {girisKontrol}
                </Box>
            </Grommet>
        </div>
            );
        };
};

const mapStateToProps = state => {
    return{
    yaratlanOdaAdi: state.yaratlanOdaAdi,
    girilenOdaAdi: state.girilenOdaAdi,
    pozition_stamp: state.pozition_stamp,
    kavusma: state.kavusma,
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        setYaretılanOdaAdı: yaratlanOdaAdi =>
            dispatch({type: actionTypes.YARATILAN_ODA_ADI,yaratlanOdaAdi}),
        setGirilenOdaAdi: girilenOdaAdi =>
            dispatch({type: actionTypes.GIRILEN_ODA_ADI,girilenOdaAdi}),
        setIsPlaying: isPlaying =>
            dispatch({ type: actionTypes.SET_IS_PLAYING, isPlaying }),
        
        setKavusma: kavusma => dispatch({ type: actionTypes.KAVUSMA, kavusma }),
        playSong: uris => dispatch(actionTypes.playSong(uris)),
        };
    }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomLogin)