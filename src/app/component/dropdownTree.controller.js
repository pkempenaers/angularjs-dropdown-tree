export default class DropDownTreeController {
	constructor(
		$log,
		$document,
		$element,
		$rootScope,
		$compile,
		$scope,
		dropdownTreeService,
	) {
		'ngInject';

		this.$log = $log;
		this.$document = $document;
		this.$element = $element;
		this.$rootScope = $rootScope;
		this.$compile = $compile;
		this.$scope = $scope;
		this.dropdownTreeService = dropdownTreeService;

		this.open = false;
		this.searchText = '';
		this.selectedOptions = [];

		this.focusCounter = 0;

		this.defaultTexts = {
			optionNames: 'items',
		};
		this.texts = angular.extend({}, this.defaultTexts);

		this.defaultSettings = {
			selectionLimit: 0,
			removeFromFront: true,
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
			appendToElement: this.$element.children(),
		};

		this.settings = angular.extend({}, this.defaultSettings);
	}

	$onChanges(changes) {
		if (angular.isDefined(changes.externalTexts)) {
			this.texts = angular.extend({}, this.defaultTexts, this.externalTexts);
		}
		if (angular.isDefined(changes.externalSelection)) {
			if (angular.isArray(this.externalSelection)) {
				this.selectedOptions = angular.extend([], this.externalSelection);
				this.emitSelection();
			} else {
				this.$log.error('selection should be an array');
			}
		}
		if (angular.isDefined(changes.externalSettings)) {
			this.settings = angular.extend({}, this.defaultSettings, this.externalSettings);
		}
	}

	toggleDropdown() {
		this.open = !this.open;
		if (this.open) {
			this.$compile('<dt-dropdown-menu></dt-dropdown-menu>'.trim())(this.$scope, (element) => {
				this.appendelement = element;
				this.settings.appendToElement.append(this.appendelement);
			});
		} else {
			this.appendelement.remove();
		}
		if (this.open && this.settings.closeOnBlur) {
			this.closeToggleOnBlurBinded = this.toggleOnBlur.bind(this);
			this.$document.on('click', this.closeToggleOnBlurBinded);
		} else {
			this.$document.off('click', this.closeToggleOnBlurBinded);
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
				});
			}
		}
	}

	optionClicked(option) {
		const indexOfOption = this.selectedOptions.indexOf(option);
		if (indexOfOption >= 0) {
			this.selectedOptions.splice(indexOfOption, 1);
		} else {
			if (this.settings.selectionLimit > 0) {
				if (this.settings.selectionLimit === this.selectedOptions.length) {
					if (this.settings.removeFromFront) {
						this.selectedOptions.splice(0, 1);
					} else {
						this.selectedOptions.splice(this.selectedOptions.length - 1, 1);
					}
				}
			}
			this.selectedOptions.push(option);
		}
		this.emitSelection();
	}

	selectAllVisible() {
		const newSelection =
			this.dropdownTreeService.getSelection(this.options, this.settings, this.searchText);
		if (this.settings.selectionLimit > 0 && newSelection.length <= this.settings.selectionLimit) {
			if (!this.dropdownTreeService.areSameSelections(newSelection, this.selectedOptions)) {
				this.selectedOptions = newSelection;
			} else {
				this.selectedOptions.splice(0, this.selectedOptions.length);
			}
			this.emitSelection();
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
