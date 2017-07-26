export default class OptionRow {
	constructor(
		dropdownTreeService,
		$element,
	) {
		'ngInject';

		this.dropdownTreeService = dropdownTreeService;
		this.$element = $element;

		this.previousSelected = [];

		if (this.isFolder()) {
			this.isOpen = this.dropdownTreeService
				.shouldFolderBeOpen(this.option, this.settings, this.selectedOptions);
		}
	}

	$doCheck() {
		if (angular.isDefined(this.selectedOptions) &&
			!this.dropdownTreeService.areSameSelections(this.selectedOptions, this.previousSelected) &&
			this.isFolder()) {
			const newSelection = [];
			this.selectedOptions.forEach((selectedOption) => {
				if (this.previousSelected.indexOf(selectedOption) < 0) {
					newSelection.push(selectedOption);
				}
			});

			this.getChildOptions().some((childOption) => {
				if (newSelection.indexOf(childOption) >= 0) {
					this.isOpen = true;
					return true;
				}
				return false;
			});

			this.previousSelected = angular.extend([], this.selectedOptions);
		}
	}

	getDisplayText() {
		return this.dropdownTreeService.getDisplayText(this.option, this.settings);
	}

	isFolder() {
		return this.dropdownTreeService.isFolder(this.option, this.settings);
	}

	isSubFolder() {
		return this.dropdownTreeService.isSubFolder(this.option, this.settings);
	}

	getChildOptions() {
		return this.dropdownTreeService.getChildOptions(this.option, this.settings);
	}

	innerClicked(option) {
		if (this.selectedOptions.indexOf(option) < 0 && this.settings.openFolderWhenInnerSelected) {
			this.isOpen = true;
		}
		this.optionClicked({ option });
	}

	selectAllChilds() {
		const selectionChanged =
			this.dropdownTreeService.selectAllChildOptions(
				this.option,
				this.settings,
				this.selectedOptions,
				this.searchText,
			);
		if (selectionChanged) {
			this.optionClicked({ option: this.option });
		}
	}

	isSelected() {
		return this.selectedOptions.indexOf(this.option) >= 0;
	}

	toggleFolder() {
		this.isOpen = !this.isOpen;
		this.$element[0].querySelectorAll('.focusable')[0].focus();
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
			case 'ArrowRight':
				if (this.isFolder()) {
					this.isOpen = true;
					event.preventDefault();
				}
				break;
			case 'ArrowLeft':
				if (this.isFolder()) {
					this.isOpen = false;
					event.preventDefault();
				}
				break;
			default:
				this.catchKeydown({ event });
				break;
		}
	}
}
