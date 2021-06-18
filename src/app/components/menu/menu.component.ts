import { DashboardService } from '../../services/dashboard.service';
import { WidgetModel, DashboardModel } from "../../../models/dashboard.model";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {

	constructor(private _ds: DashboardService) {};

	// Components variables
	public toggle: boolean = true;
	public modal: boolean;
	public widgetCollection: WidgetModel[];
	public dashboardCollection: DashboardModel[];

	// On component init we store Widget Marketplace in a WidgetModel array
	ngOnInit(): void {
		// We make a get request to get all widgets from our REST API
		this._ds.getWidgets().subscribe(widgets => {
			this.widgetCollection = widgets;
		});

		// We make get request to get all dashboards from our REST API
		this._ds.getDashboards().subscribe(dashboards => {
			this.dashboardCollection = dashboards;
			console.warn(this.dashboardCollection);
		});
	}

	onDrag(event, identifier) {
		console.warn(event)
		event.dataTransfer.setData('widgetIdentifier', identifier);
	}
	// Method call when toggle button is clicked in navbar
	toggleMenu(): void {
		this.toggle = !this.toggle;
	}
}
