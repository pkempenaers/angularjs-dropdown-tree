export default class MainController {
	constructor($log) {
		'ngInject';

		this.$log = $log;
	}

	$onInit() {
		this.options = [
			{
				name: 'b',
				label: 'testoption label',
			},
			{
				name: 'a',
				label: 'test folder label',
				children: [
					{
						name: 'c',
						label: 'test child option c',
					},
					{
						name: 'fa',
						label: 'test child option f',
					},
					{
						name: 'd',
						label: 'test child option d',
						subChildren: [
							{
								name: 'cc',
								label: 'test child option c',
							},
							{
								name: 'ff',
								label: 'test child option f',
							},
						],
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
			subProperty: 'subChildren',
			disableSearch: false,
			closeOnBlur: true,
			folderSelectable: true,
			getButtonText(selection) {
				if (selection.length > 0) {
					return selection.map(v => v.name).join(', ');
				}
				return 'Select items';
			},
			foldersOpen: true,
			openFolderWhenInnerSelected: false,
			closeOnSelectionLimitReached: false,
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
