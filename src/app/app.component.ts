import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portal';
  wifis: Array<string>;
  ssid: string;
  psk: string;
  num1: number = 0;
  num2: number = 0;
  hidden: boolean = false;
  connected: string;
  state: boolean;
  getClass (wifi) {
    if (wifi == this.connected) { 
      return 'list-group-item active waves-light'
    } else {
      return 'list-group-item waves-light'
    }
  }
  getStatus () {
    axios.get('http://192.168.27.1:8080/status')
    .then((response) => {
      // handle success
      if (response.data.payload.state === 'COMPLETED') {
        this.connected = response.data.payload.ssid
        this.state = 'connected'
      }
      else
        this.state = 'fail'
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log('scan wifi');
    });
  }
  ngOnInit() {
    this.reFreshWifi()
    this.getStatus()
  }
  SelectSsid(ssid) {
    this.ssid = ssid
    this.hidden = false
  }
  setHiddenWifi () {
    this.hidden = true
    this.ssid = ''
    this.psk = ''
  }
  setPsk (psk) {
    this.psk = psk
  }
  setSsid (ssid) {
    this.ssid = ssid
  }
  configWifi () {
    let data = {
      ssid: this.ssid,
      psk: this.psk
    }
    axios({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: data,
      url: 'http://192.168.27.1:8080/connect',
    })
    .then((response) => {
      console.log(response);
      if (response.data.payload.state === 'COMPLETED') {
        this.connected = response.data.payload.ssid
        this.state = 'connected'
      }
      else 
        this.state = 'fail'
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log('config wifi');
    });
  }
  reFreshWifi() {
    /* this.wifis = ['Flukz_2.4GHz',
      'Hmunuy',
      'Katoy@WIFI',
      'MODEN ONE HOME',
      'Pharkpoom',
      'bbmds_2.4GHz'] */
    axios.get('http://192.168.27.1:8080/scan')
    .then((response) => {
      // handle success
      this.wifis = Object.keys(response.data.payload)
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log('scan wifi');
    });
  }
}
