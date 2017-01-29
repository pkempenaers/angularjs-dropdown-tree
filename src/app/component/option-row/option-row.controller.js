export default class OptionRow {
	getDisplayText() {
		return this.option[this.settings.displayProperty];
	}

	isFolder() {
		return Object.prototype.hasOwnProperty.call(this.option, this.settings.childrenProperty) &&
			angular.isArray(this.option[this.settings.childrenProperty]);
	}

	getChildOptions() {
		return this.option[this.settings.childrenProperty];
	}

	innerClicked(option) {
		this.optionClicked(option);
	}

	isSelected() {
		return this.selectedOptions.indexOf(this.option) >= 0;
	}
}
