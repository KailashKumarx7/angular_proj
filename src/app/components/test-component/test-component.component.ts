import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // Detect connected devices
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        for (const device of devices) {
          const deviceInfo = {
            type: device.kind,
            operatingSystem: device.label,
            browser: navigator.userAgent,
            screenResolution: window.screen.width + 'x' + window.screen.height
          };

          // Do something with the device info
          console.log(deviceInfo);
        }
      })
      .catch(error => {
        console.error('Error enumerating devices:', error);
      });
  }
}
