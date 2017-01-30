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

	shouldBeVisible(item = this.option) {
		if (item[this.settings.childrenProperty] && !this.shouldBeVisibleItem(item)) {
			return this.option[this.settings.childrenProperty]
				.some(childItem => this.shouldBeVisible(childItem));
		}
		return this.shouldBeVisibleItem(item);
	}

	shouldBeVisibleItem(item = this.option) {
		if (this.searchText.length > 0) {
			return item[this.settings.displayProperty].toLowerCase()
				.indexOf(this.searchText.trim().toLowerCase()) >= 0;
		}
		return true;
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
