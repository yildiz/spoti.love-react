import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { createMuiTheme,  makeStyles, withStyles,makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green} from '@material-ui/core/colors';
import { ThemeProvider } from './node_modules/@material-ui/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));
  
  const ValidationTextField = withStyles({
    root: {
      '& input:valid + fieldset': {
        borderColor: 'green',
        borderWidth: 2,
      },
      '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '4px !important', // override inline-style
      },
    },
  })(TextField);

const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

class RoomLogin extends Component{
    constructor(props) {
        super(props);

        this.state = {
            odaOlustur:false,
            odayaGisisYap:false,
            girisYapilacakOdaAdi:""   
        };
        //this.girisYapilacakOdaAdifc = this.girisYapilacakOdaAdifc.bind(this);
    }
    
    odaOlusturucuMenusunuAc = ()=> this.setState({odaOlustur: true});
    odayaGirisYapmaMenusunuAc = () => this.setState({odayaGisisYap: true});
    girisYapilacakOdaAdifc = (event)=> this.setState({girisYapilacakOdaAdi:event.target.value});
    odayaGirisYapmaUygulamasınıCalıstır=()=>{
        alert("girilecek oda adı "+ this.state.girisYapilacakOdaAdi)
    }
    

    render(){
        const classes = useStyles();
        const girisKontrol=(
            <div>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="primary" className={classes.margin} onClick={this.odaOlusturucuMenusunuAc}>
                         Oda Oluştur
                    </Button>
                 </ThemeProvider>
                 <ThemeProvider theme={theme}>
                    <Button variant="contained" color="primary" className={classes.margin} onClick={this.odayaGirisYapmaMenusunuAc}>
                         Odaya Giriş Yap
                    </Button>
                 </ThemeProvider>
            </div>
        );
        if(this.state.odaOlustur){
            <form className={classes.root} noValidate>
                 <ValidationTextField
                    className={classes.margin}
                    label="CSS validation style"
                    required
                    variant="outlined"
                    defaultValue="Success"
                    id="validation-outlined-input"
                    onChange={this.girisYapilacakOdaAdifc} 
                />

                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="primary" className={classes.margin} onClick={this.odayaGirisYapmaUygulamasınıCalıstır}>
                        Odayı Oluştur
                    </Button>
                 </ThemeProvider>
                
            </form>
        }
        
        return(
        <div>  
               {girisKontrol}
        </div>
            );
        };
};

const mapStateToProps = state => {
    return{
    pozition_stamp: state.pozition_stamp,
    durationStamps: state.durationStamps
    }
}
const mapDispatchToProps = dispatch =>{
    return{
    setPozitionStamp: pozition_stamp =>
        dispatch({type: actionTypes.NOW_POZITION_STAMP,pozition_stamp})
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomLogin)