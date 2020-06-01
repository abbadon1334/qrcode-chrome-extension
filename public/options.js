let input, w, opt;
input = document.getElementById('qr_width');

for (w = 40; w <= 200; w++) {
    opt = document.createElement('option');
    opt.appendChild(document.createTextNode(w.toString()));
    opt.value = w;
    input.appendChild(opt);
}

let input_top = document.getElementById('qr_top');
let input_left = document.getElementById('qr_left');
let input_bottom = document.getElementById('qr_bottom');
let input_right = document.getElementById('qr_right');

for (w = -1; w <= 300; w++) {

    let getPositionOption = function (w) {
        let opt = document.createElement('option');
        opt.value = w === -1 ? 'auto' : w + 'px';
        opt.appendChild(document.createTextNode(opt.value.toString()));

        return opt;
    };

    input_top.appendChild(getPositionOption(w));
    input_left.appendChild(getPositionOption(w));
    input_bottom.appendChild(getPositionOption(w));
    input_right.appendChild(getPositionOption(w));
}

function refreshOptions() {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get({
        qr_width: 120,
        qr_top: "0px",
        qr_left: "0px",
        qr_bottom: "auto",
        qr_right: "auto"
    }, function (items) {
        document.getElementById('qr_width').value = items.qr_width;
        document.getElementById('qr_top').value = items.qr_top;
        document.getElementById('qr_left').value = items.qr_left;
        document.getElementById('qr_bottom').value = items.qr_bottom;
        document.getElementById('qr_right').value = items.qr_right;
    });
}

function save_options() {

    // eslint-disable-next-line no-undef
    chrome.storage.sync.set({
        qr_width: document.getElementById('qr_width').value,
        qr_top: document.getElementById('qr_top').value,
        qr_left: document.getElementById('qr_left').value,
        qr_bottom: document.getElementById('qr_bottom').value,
        qr_right: document.getElementById('qr_right').value
    }, function () {

        var status = document.getElementById('status');
        status.textContent = 'Options saved.';

        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

document.getElementById('save').addEventListener('click', save_options);

refreshOptions();
