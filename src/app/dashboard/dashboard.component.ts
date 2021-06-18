// GRIDSTER & ANGULAR
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from "angular-gridster2";
import { DashboardService } from "../services/dashboard.service";
import { DashboardModel, DashboardContentModel } from "../../models/dashboard.model";

// COMPONENTS
import { LineChartComponent } from "../components/line-chart/line-chart.component";
import { RadarChartComponent } from "../components/radar-chart/radar-chart.component";
import { DoughnutChartComponent } from "../components/doughnut-chart/doughnut-chart.component";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
	constructor(private _route: ActivatedRoute, private _ds: DashboardService) {}

	public options: GridsterConfig;
	public dashboardId: number;
	public dashboardCollection: DashboardModel;
	public dashboardArray: DashboardContentModel[] = [];
	public componentCollection = [
		{ name: "Line Chart", componentInstance: LineChartComponent },
		{ name: "Doughnut Chart", componentInstance: DoughnutChartComponent },
		{ name: "Radar Chart", componentInstance: RadarChartComponent }
	];

	ngOnInit() {
		// this.options
		// Grid options
		this.options = {
			gridType: "fixed",
			enableEmptyCellDrop: true,
			enableOccupiedCellDrop: true,
			emptyCellDropCallback: this.onDrop,
			pushItems: false,
			swap: false,
			pushDirections: { north: false, east: false, south: false, west: false },
			resizable: { enabled: true },
			itemChangeCallback: this.itemChange.bind(this),
			draggable: {
				enabled: true,
				// ignoreContent: true,
				dropOverItems: true,
				// dragHandleClass: "drag-handler",
				// ignoreContentClass: "no-drag",
			},
			displayGrid: "onDrag&Resize",
			minCols: 1,
			maxCols: 15,
			minRows: 1,
			maxRows: 15,
			fixedColWidth: 105,
      		fixedRowHeight: 105,
			allowMultiLayer: true,
			defaultLayerIndex: 1,
			baseLayerIndex: 2,
			maxLayerIndex: 2,
			disableScrollHorizontal: true,
		};
		this.getData();
	}
	
	getData() {
		// We get the id in get current router dashboard/:id
		this._route.params.subscribe(params => {
			// + is used to cast string to int
			this.dashboardId = +params["id"];
			// We make a get request with the dashboard id
			this._ds.getDashboard(this.dashboardId).subscribe(dashboard => {
				// We fill our dashboardCollection with returned Observable
				this.dashboardCollection = dashboard;
				// We parse serialized Json to generate components on the fly
				this.parseJson(this.dashboardCollection);
				// We copy array without reference
				this.dashboardArray = this.dashboardCollection.dashboard.slice();
				console.warn('get data', this.dashboardArray)
			});
		});
	}

	// Super TOKENIZER 2.0 POWERED BY NATCHOIN
	parseJson(dashboardCollection: DashboardModel) {
		// We loop on our dashboardCollection
		dashboardCollection.dashboard.forEach(dashboard => {
			// We loop on our componentCollection
			this.componentCollection.forEach(component => {
				// We check if component key in our dashboardCollection
				// is equal to our component name key in our componentCollection
				if (dashboard.component === component.name) {
					// If it is, we replace our serialized key by our component instance
					dashboard.component = component.componentInstance;
				}
			});
		});
	}

	serialize(dashboardCollection) {
		// We loop on our dashboardCollection
		dashboardCollection.forEach(dashboard => {
			// We loop on our componentCollection
			this.componentCollection.forEach(component => {
				// We check if component key in our dashboardCollection
				// is equal to our component name key in our componentCollection
				if (dashboard.name === component.name) {
					dashboard.component = component.name;
				}
			});
		});
	}
	
	itemChange() {
		this.dashboardCollection.dashboard = this.dashboardArray;
		let tmp = JSON.stringify(this.dashboardCollection);
		let parsed: DashboardModel = JSON.parse(tmp);
		this.serialize(parsed.dashboard);
		this._ds.updateDashboard(this.dashboardId, parsed).subscribe();
	}

	onDrop(ev) {

		const componentType = ev.dataTransfer.getData("widgetIdentifier");

		if(!this.dashboardArray) {
			this.dashboardArray = [];
		}

		switch (componentType) {
			case "radar_chart":
				return this.dashboardArray.push({
					cols: 4,
					rows: 3,
					x: 0,
					y: 0,
					// maxItemRows: 3, 
					// maxItemCols: 4,
					layerIndex: 2,
					component: RadarChartComponent,
					name: "Radar Chart"
				});
			case "line_chart":
				return this.dashboardArray.push({
					cols: 4,
					rows: 3,
					x: 0,
					y: 0,
					// maxItemRows: 3, 
					// maxItemCols: 4,
					// layerIndex: 1,
					layerIndex: 3,
					component: LineChartComponent,
					name: "Line Chart"
				});
			case "doughnut_chart":
				return this.dashboardArray.push({
					cols: 4,
					rows: 3,
					x: 0,
					y: 0,
					// maxItemRows: 3, 
					// maxItemCols: 4,
					// layerIndex: 1,
					layerIndex: 4,
					component: DoughnutChartComponent,
					name: "Doughnut Chart"
				});
		}
	}

	changedOptions() {
		this.options.api.optionsChanged();
	}

	removeItem(item) {
		this.dashboardArray.splice(
			this.dashboardArray.indexOf(item),
			1
		);
		this.itemChange();
	}

	display($event) {
		console.warn($event)
	}
}
