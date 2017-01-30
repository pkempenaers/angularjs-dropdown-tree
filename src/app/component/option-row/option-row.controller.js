export default class OptionRow {
	constructor() {
		if (this.isFolder()) {
			this.isOpen = true;
		}
	}

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

	toggleFolder() {
		this.isOpen = !this.isOpen;
	}

	keyDown(event) {
		switch (event.key) {
		case 'Enter':
			if (!this.isFolder() || this.settings.folderSelectable) {
				this.innerClicked({ innerOption: this.option });
				event.preventDefault();
			}
			break;
		case 'ArrowDown':
			this.focusNext();
			event.preventDefault();
			break;
		case 'ArrowUp':
			this.focusPrevious();
			event.preventDefault();
			break;
		default:
			this.catchKeydown({ event });
			break;
		}
	}
}
