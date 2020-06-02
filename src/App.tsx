import React from 'react';
import 'chrome-extension-async';
import './App.css';

var QRCode = require('qrcode.react');
declare var chrome: any;

interface AppState {
    qr_url: string,
    qr_width: number,
    qr_top: string,
    qr_left: string,
    qr_bottom: string,
    qr_right: string
}

class App extends React.Component<{}, AppState> {

    state_default: AppState = {
        qr_url: "",
        qr_width: 120,
        qr_top: "0px",
        qr_left: "0px",
        qr_bottom: "auto",
        qr_right: "auto"
    };

    state: AppState = this.state_default;

    constructor(props: any) {
        super(props);

        this.handleClickToggle = this.handleClickToggle.bind(this);
        this.processInjection = this.processInjection.bind(this);
        this.reloadOptions = this.reloadOptions.bind(this);
    }

    handleClickToggle(e: any) {
        this.getCurrentTab().then(this.processInjection);
    }

    async getCurrentTab() {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        return tabs[0];
    }

    async processInjection(tab: any) {

        await this.reloadOptions();
        this.setState({qr_url: tab.url});

        const qr_canvas: HTMLCanvasElement | null = document.querySelector('.ExtQRCode > canvas');

        if (null === qr_canvas) {
            return;
        }

        chrome.tabs.executeScript(
            tab.id,
            {
                code: `
                if (null !== document.getElementById('injectedQRCode')) {
                    document.getElementById('injectedQRCode').remove();
                } else {
                    if (imageElement === undefined) {
                        var imageElement = null;
                    }
                    imageElement = document.createElement("img");
                    document.body.appendChild(imageElement);
                    imageElement.id = 'injectedQRCode';
                    imageElement.src = "` + qr_canvas.toDataURL() + `";
                    imageElement.style.position = 'fixed';
                    imageElement.style.top = "` + this.state.qr_top + `";
                    imageElement.style.left = "` + this.state.qr_left + `";
                    imageElement.style.bottom = "` + this.state.qr_bottom + `";
                    imageElement.style.right = "` + this.state.qr_right + `";
                    imageElement.style.zIndex = "65535";
                    imageElement.style.padding = "4px";
                    imageElement.style.backgroundColor = "#FFF";
                    imageElement.style.border = "2px solid #f90000"
                }
                `
            }
        );
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h4>QRCodeURL</h4>
                    <button onClick={this.handleClickToggle}>Toggle QR</button>
                    <button onClick={this.handleOptions}>Options</button>
                </header>
                <div className="ExtQRCode" style={{display: "none"}}>
                    <QRCode
                        value={this.state.qr_url}
                        size={this.state.qr_width}
                        level={'H'}
                    />
                </div>
            </div>
        );
    }

    handleOptions() {
        chrome.runtime.openOptionsPage();
    }

    async reloadOptions() {

        const state_default = this.state_default;

        const options = await chrome.storage.sync.get(
            Object.keys(this.state),
            function (el: any) {
                return {
                    qr_url: "",
                    qr_width: el.qr_width ?? state_default.qr_width,
                    qr_top: el.qr_top ?? state_default.qr_top,
                    qr_left: el.qr_left ?? state_default.qr_left,
                    qr_bottom: el.qr_bottom ?? state_default.qr_bottom,
                    qr_right: el.qr_right ?? state_default.qr_right,
                };
            }
        );

        this.setState(options);
    }
}

export default App;
