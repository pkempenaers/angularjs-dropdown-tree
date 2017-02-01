export default class DropDownTreeController {
	constructor(
		$log,
		$document,
		$element,
		$rootScope,
		dropdownTreeService,
	) {
		'ngInject';

		this.$log = $log;
		this.$document = $document;
		this.$element = $element;
		this.$rootScope = $rootScope;
		this.dropdownTreeService = dropdownTreeService;

		this.open = false;
		this.searchText = '';
		this.selectedOptions = [];

		this.focusCounter = 0;

		this.texts = {
			optionNames: 'items',
		};

		this.settings = {
			displayProperty: 'name',
			childrenProperty: 'children',
			disableSearch: false,
			closeOnBlur: true,
			folderSelectable: true,
			selectedClass: [
				'glyphicon',
				'glyphicon-ok',
			],
			folderClass: [
				'glyphicon',
				'glyphicon-folder-open',
			],
			folderClosedClass: [
				'glyphicon',
				'glyphicon-folder-close',
			],
			childClass: [
				'glyphicon',
				'glyphicon-file',
			],
		};
	}

	$onChanges(changes) {
		if (angular.isDefined(changes.externalTexts)) {
			angular.extend(this.texts, this.externalTexts);
		}
		if (angular.isDefined(changes.externalSelection)) {
			if (angular.isArray(changes.externalSelection)) {
				this.selectedOptions = this.externalSelection;
				this.emitSelection();
			} else {
				this.$log.error('selection should be an array');
			}
		}
		if (angular.isDefined(changes.externalSettings)) {
			angular.extend(this.settings, this.externalSettings);
		}
	}

	toggleDropdown() {
		this.open = !this.open;
		if (this.open && this.settings.closeOnBlur) {
			this.closeToggleOnBlurBinded = this.toggleOnBlur.bind(this);
			this.$document.on('click', this.closeToggleOnBlurBinded);
		}
	}

	toggleOnBlur(e) {
		if (e.target && e.target.parentElement) {
			let target = e.target.parentElement;
			let parentFound = false;

			while (angular.isDefined(target) && target !== null && !parentFound) {
				if (!!target.className.split && target.className.split(' ').indexOf('dropdown-tree-parent') >= 0 && !parentFound) {
					if (target === this.$element.children()[0]) {
						parentFound = true;
					}
				}
				target = target.parentElement;
			}

			if (!parentFound) {
				this.$rootScope.$apply(() => {
					this.toggleDropdown();
					this.$document.off('click', this.closeToggleOnBlurBinded);
				});
			}
		}
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

	selectAllVisible() {
		this.selectedOptions.splice(0, this.selectedOptions.length);
		this.options.forEach((option) => {
			this.selectAllChildVisible(option);
		});
		this.emitSelection();
	}

	selectAllChildVisible(option) {
		if (this.dropdownTreeService.isVisible(option, this.settings, this.searchText)) {
			if (this.dropdownTreeService.isFolder(option, this.settings)) {
				if (this.settings.folderSelectable &&
					this.dropdownTreeService.isVisibleItem(option, this.settings, this.searchText)) {
					this.selectedOptions.push(option);
				}
				this.dropdownTreeService.getChildOptions(option, this.settings)
				.forEach((childOption) => {
					this.selectAllChildVisible(childOption);
				});
			} else {
				this.selectedOptions.push(option);
			}
		}
	}

	emitSelection() {
		this.selectionChanged({ selection: this.selectedOptions });
	}

	dropdownToggleKeyDown(event) {
		switch (event.key) {
		case 'ArrowDown':
			if (this.open) {
				this.focusFirst();
				event.preventDefault();
			}
			break;
		default:
			this.catchKeyDown(event);
		}
	}

	searchKeydown(event) {
		switch (event.key) {
		case 'ArrowDown':
			this.focusNext();
			event.preventDefault();
			break;
		case 'ArrowUp':
			this.focusSelf();
			event.preventDefault();
			break;
		case 'Enter':
			this.selectAllVisible();
			event.preventDefault();
			break;
		default:
			this.catchKeyDown(event);
		}
	}

	catchKeyDown(event) {
		switch (event.key) {
		case 'Escape':
			if (this.open) {
				this.toggleDropdown();
				this.focusSelf();
				event.preventDefault();
			}
			break;
		default:
			break;
		}
	}

	focusFirst() {
		if (this.settings.disableSearch) {
			this.$element[0].querySelectorAll('.focusable')[0].focus();
			this.focusCounter = 0;
		} else {
			this.$element.find('input')[0].focus();
			this.focusCounter = -1;
		}
	}

	focusNext() {
		const focusableItems = this.$element[0].querySelectorAll('.focusable');
		if (focusableItems.length > this.focusCounter + 1) {
			this.focusCounter += 1;
			focusableItems[this.focusCounter].focus();
		}
	}

	focusPrevious() {
		const focusableItems = this.$element[0].querySelectorAll('.focusable');
		if (this.focusCounter >= 1) {
			this.focusCounter -= 1;
			focusableItems[this.focusCounter].focus();
		} else if (!this.settings.disableSearch) {
			this.focusFirst();
		} else {
			this.focusSelf();
		}
	}

	focusSelf() {
		this.$element.find('button')[0].focus();
	}
}
