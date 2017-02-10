export default class MainController {
	constructor($log) {
		'ngInject';

		this.$log = $log;
	}

	$onInit() {
		this.options = [
			{
				name: 'testoption',
				label: 'testoption label',
			},
			{
				name: 'test folder',
				label: 'test folder label',
				children: [
					{
						name: 'test child option',
						label: 'test child option label',
					},
				],
				childoptions: [
					{
						name: 'test child option',
						label: 'test child option label',
					},
				],
			},
		];

		this.settings = {
			selectionLimit: 0,
			removeFromFront: true,
			displayProperty: 'name',
			childrenProperty: 'children',
			disableSearch: false,
			closeOnBlur: true,
			folderSelectable: true,
		};
	}

	selectionChanged(selection) {
		this.$log.debug(selection);
	}

	changeSettings() {
		this.settings.selectionLimit = parseInt(this.settings.selectionLimit, 10);
		this.settings = angular.extend({}, this.settings);
	}
}
