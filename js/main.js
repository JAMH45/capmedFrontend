// Movil
import { Card }  from './components/movil/Card.js';
import { Modal } from './components/movil/Modal.js';
import {LoginMv} from './components/movil/Login.js';
import { HeaderMv } from './components/movil/Header.js';
import { FooterMv } from './components/movil/Footer.js';
//Web
import { Header } from './components/pc/Header.js';
import { FooterWb } from './components/pc/Footer.js';
import { LoginWb } from './components/pc/Login.js';
import { CardWb } from './components/pc/Card.js';
//Movil
window.Card  = Card;
window.Modal = Modal;
window.LoginMv = LoginMv;
window.HeaderMv = HeaderMv;
window.FooterMv = FooterMv;


//Web
window.Header = Header;
window.FooterWb = FooterWb;
window.LoginWb = LoginWb;
window.CardWb = CardWb;
// Monta cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  PetiteVue.createApp().mount();
});
