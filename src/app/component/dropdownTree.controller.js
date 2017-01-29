export default class DropDownTreeController {
	constructor(
		$log,
	) {
		'ngInject';

		this.$log = $log;
	}

	$onInit() {
		this.open = false;
		this.selectedOptions = [];

		this.texts = {
			optionNames: 'items',
		};

		this.settings = {
			displayProperty: 'name',
			childrenProperty: 'children',
			selectedClass: [
				'glyphicon',
				'glyphicon-ok',
			],
		};
	}

	$onChanges(changes) {
		if (angular.isDefined(changes.externalTexts)) {
			angular.extend(this.texts, this.externalTexts);
		}
		if (angular.isDefined(changes.externalSelection)) {
			if (angular.isArray(changes.externalSelection)) {
				this.selectedOptions = changes.externalSelection;
				this.emitSelection();
			} else {
				this.$log.error('selection should be an array');
			}
		}
		if (angular.isDefined(changes.settings)) {
			angular.extend(this.settings, changes.settings);
		}
	}

	toggleDropdown() {
		this.open = !this.open;
	}

	optionClicked(option) {
		const indexOfOption = this.selectedOptions.indexOf(option);
		if (indexOfOption >= 0) {
			this.selectedOptions.splice(indexOfOption, 1);
		} else {
			this.selectedOptions.push(option);
		}
		this.emitSelection();
	}

	emitSelection() {
		this.selectionChanged({ selection: this.selectedOptions });
	}
}
