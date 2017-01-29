export default class MainController {
	constructor($log) {
		'ngInject';

		this.$log = $log;
	}

	$onInit() {
		this.options = [
			{
				name: 'testoption',
			},
			{
				name: 'test folder',
				children: [
					{
						name: 'test child option',
					},
				],
			},
		];
	}

	selectionChanged(selection) {
		this.$log.debug(selection);
	}
}