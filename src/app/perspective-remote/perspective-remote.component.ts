import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
//import perspective from "@finos/perspective";
declare var perspective;
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'perspective-remote',
  templateUrl: './perspective-remote.component.html'
})

export class PerspectiveRemoteComponent implements OnInit {
  @Input() sourceTable: string;
  @Input() sourceUrl: string;
  @Input() height: number = undefined;
  @Input() width: number = undefined;
  websocket: any = undefined;
  view: any = undefined;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      console.log("ngOnChanges", propName, changes[propName]);
      // request if its an actual change to function id
      if (propName === "sourceTable") {
        this.onCreateView()
      } else if (propName === "sourceUrl") {
        this.onCreatWebSocket()
        this.onCreateView()
      } else if (propName === "height" || propName === "width") {
        setTimeout(() => {
          const perspectiveViewer = document.getElementById("perspective-viewer-source") as any;
          console.log("resize perspective")
          perspectiveViewer.notifyResize()
        }, 500);
      }
    }
  }

  async onCreateView() {
    if (this.sourceTable != null && this.websocket != null) {
      const perspectiveViewer = document.getElementById("perspective-viewer-source") as any;
      const table = this.websocket.open_table(this.sourceTable);
      if (this.view != null) {
        perspectiveViewer.reset()
        this.view.delete();
      }
      if (table != null) {
        this.view = table.view({
          columns: await table.columns(),
          row_pivots: [],
          aggregates: {},
          filter: [],
          sort: []
        });
        await perspectiveViewer.load(this.view);
        await perspectiveViewer.setAttribute('columns', JSON.stringify(await table.columns()));
        perspectiveViewer.plugin = "hypergrid"
      }
    }
  }

  onCreatWebSocket() {
    if (this.sourceUrl != null) {
      this.websocket = (perspective as any).websocket(this.sourceUrl);
    }
  }

  ngAfterViewInit() {
    const perspectiveViewer = document.getElementById("perspective-viewer-source") as any;
    perspectiveViewer.toggleConfig();
    perspectiveViewer.addEventListener("perspective-config-update", function () {
      var config = perspectiveViewer.save();
      console.log("The view() config has changed to " + JSON.stringify(config));
    });
    const shadowRoot: DocumentFragment = document.getElementById("perspective-viewer-source").shadowRoot;
    shadowRoot.getElementById("config_button").style.display = 'none'
    shadowRoot.getElementById("menubar").style.display = 'none'
    shadowRoot.getElementById("vis_selector_container").style.marginLeft = '0px';
    shadowRoot.getElementById("side_panel__actions").style.display = 'none'
    shadowRoot.getElementById("add-computed-column").style.display = 'none'
  }
}
