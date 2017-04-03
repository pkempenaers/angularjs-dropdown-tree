export default class OptionRow {
	constructor(
		dropdownTreeService,
	) {
		'ngInject';

		this.dropdownTreeService = dropdownTreeService;
		if (this.isFolder()) {
			this.isOpen = true;
		}
	}

	getDisplayText() {
		return this.dropdownTreeService.getDisplayText(this.option, this.settings);
	}

	isFolder() {
		return this.dropdownTreeService.isFolder(this.option, this.settings);
	}

	getChildOptions() {
		return this.dropdownTreeService.getChildOptions(this.option, this.settings);
	}

	innerClicked(option) {
		this.optionClicked({ option });
	}

	isSelected() {
		return this.selectedOptions.indexOf(this.option) >= 0;
	}

	toggleFolder() {
		this.isOpen = !this.isOpen;
	}

	shouldBeVisible() {
		return this.dropdownTreeService.isVisible(this.option, this.settings, this.searchText);
	}

	keyDown(event) {
		switch (event.key) {
			case 'Enter':
				if (!this.isFolder() || this.settings.folderSelectable) {
					this.innerClicked(this.option);
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
