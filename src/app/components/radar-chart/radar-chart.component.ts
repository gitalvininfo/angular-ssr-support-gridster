import { Component } from "@angular/core";

@Component({
	selector: "app-radar-chart",
	templateUrl: "./radar-chart.component.html"
})
export class RadarChartComponent {
	loading = true;
	// Radar
	public radarChartLabels: string[] = [
		"Eating",
		"Drinking",
		"Sleeping",
		"Designing",
		"Coding",
		"Cycling",
		"Running"
	];

	public radarChartData: any = [
		{ data: [65, 59, 90, 81, 56, 55, 40], label: "Series A" },
		{ data: [28, 48, 40, 19, 96, 27, 100], label: "Series B" }
	];
	public radarChartType: string = "radar";

	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		console.log(e);
	}

	ngOnInit(): void {
		setTimeout(() => {
			this.loading = false
		}, 3000)
	}
}
