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

    

    render(){
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
    girilenOdaAdi: state.girilenOdaAdi
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        setYaretılanOdaAdı: yaratlanOdaAdi =>
            dispatch({type: actionTypes.YARATILAN_ODA_ADI,yaratlanOdaAdi}),
        setGirilenOdaAdi: girilenOdaAdi =>
            dispatch({type: actionTypes.GIRILEN_ODA_ADI,girilenOdaAdi})
        };
    }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomLogin)