import {
  Component,
  OnInit,
  AfterViewInit
}

  from '@angular/core';

declare var perspective;

@Component({
  selector: 'app-perspective',
  templateUrl: './perspective.component.html',
  styleUrls: ['./perspective.component.scss',
    '../../../node_modules/@finos/perspective-viewer/dist/umd/material.dark.css'
  ],
}

) export class PerspectiveComponent {

  constructor() {
    this.initPrespective();
  }

  initPrespective() {
    window.addEventListener('WebComponentsReady', async function () {

      // Create two perspective interfaces, one remotely via WebSocket, 
      // and one local via WebWorker.
      //debugger;
      const websocket = perspective.websocket('ws://localhost:8080');
      const worker = perspective.worker();
      worker.initialize_profile_thread();

      // Get a proxy for a view named "data_source_one", registered on
      // the server with a reciprocal call to `host_view()`.
      // No data is transferred, `view` is a virtual handle for data on
      // the server.
      const view = websocket.open_view('data_source_one');

      // Create a `table` from this, owned by the local WebWorker.
      // Data is transferred from `view` to the local WebWorker, both
      // the current state and all future updates, as Arrows.
      const table = worker.table(view, {
        limit: 10000
      }

      );

      // Load this in the `<perspective-viewer>`.
      (<any>document.getElementById('view1')).load(table);
    }
    );
  }
}