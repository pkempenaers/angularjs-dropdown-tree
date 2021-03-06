﻿export default class DropDownTreeController {
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

		this.defaultTexts = {
			optionNames: 'items',
		};
		this.texts = angular.extend({}, this.defaultTexts);

		this.defaultSettings = {
			selectionLimit: 0,
			removeFromFront: true,
			displayProperty: 'name',
			childrenProperty: 'children',
			subProperty: null,
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
			subClass: [
				'glyphicon',
				'glyphicon-minus',
			],
			subClosedClass: [
				'glyphicon',
				'glyphicon-plus',
			],
			childClass: [
				'glyphicon',
				'glyphicon-file',
			],
			dropdownToggleIconClass: [
				'caret',
			],
			appendToElement: this.$element.children(),
			foldersOpen: true,
			openFolderWhenInnerSelected: false,
			closeOnSelectionLimitReached: false,
			sortByDisplayProperty: false,
		};

		this.settings = angular.extend({}, this.defaultSettings);

		const vm = this;
		function customCompare(a, b) {
			if (!vm.settings.sortByDisplayProperty) {
				return 0;
			}
			if (a.type === 'string') {
				const aLowerCase = a.value.toLowerCase();
				const bLowerCase = b.value.toLowerCase();
				if (aLowerCase < bLowerCase) {
					return -1;
				} else if (aLowerCase > bLowerCase) {
					return 1;
				}
				return 0;
			}
			if (a.value < b.value) {
				return -1;
			} else if (a.value > b.value) {
				return 1;
			}
			return 0;
		}
		vm.customCompare = customCompare;
	}

	$onChanges(changes) {
		if (angular.isDefined(changes.externalTexts)) {
			this.texts = angular.extend({}, this.defaultTexts, this.externalTexts);
		}
		if (angular.isDefined(changes.externalSelection)) {
			if (angular.isArray(this.externalSelection)) {
				this.selectedOptions = angular.extend([], this.externalSelection);
			} else {
				this.$log.error('selection should be an array');
			}
		}
		if (angular.isDefined(changes.externalSettings)) {
			this.settings = angular.extend({}, this.defaultSettings, this.externalSettings);
		}
	}

	$doCheck() {
		if (angular.isDefined(this.externalSelection) &&
			!this.dropdownTreeService.areSameSelections(this.externalSelection, this.selectedOptions)) {
			this.selectedOptions = angular.extend([], this.externalSelection);
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
		if (this.dropdownTreeService.isSelectAble(option, this.settings)) {
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
		if (angular.isArray(this.externalSelection)) {
			this.externalSelection.splice(0, this.externalSelection.length);
			this.selectedOptions.forEach((selectedOption) => {
				this.externalSelection.push(selectedOption);
			});
		}
		this.selectionChanged({ selection: this.selectedOptions });
		if (this.settings.closeOnSelectionLimitReached &&
			this.settings.selectionLimit !== 0 &&
			this.selectedOptions.length === this.settings.selectionLimit) {
			this.toggleDropdown();
		}
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
				this.catchKeydown(event);
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
				this.catchKeydown(event);
		}
	}

	catchKeydown(event) {
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
		} else {
			this.$element.find('input')[0].focus();
		}
	}

	focusNext() {
		let focusCounter = this.getFocusCounter();
		const focusableItems = this.$element[0].querySelectorAll('.focusable');
		if (focusableItems.length > focusCounter + 1) {
			focusCounter += 1;
			focusableItems[focusCounter].focus();
		}
	}

	focusPrevious() {
		let focusCounter = this.getFocusCounter();
		const focusableItems = this.$element[0].querySelectorAll('.focusable');
		if (focusCounter >= 1) {
			focusCounter -= 1;
			focusableItems[focusCounter].focus();
		} else if (!this.settings.disableSearch) {
			this.focusFirst();
		} else {
			this.focusSelf();
		}
	}

	getFocusCounter() {
		const focusableItems = this.$element[0].querySelectorAll('.focusable');
		const focussedItem = this.$document[0].activeElement;

		for (let i = 0; i < focusableItems.length; i += 1) {
			if (focusableItems[i] === focussedItem) {
				return i;
			}
		}

		return -1;
	}

	focusSelf() {
		this.$element.find('button')[0].focus();
	}

	getButtonText() {
		if (angular.isFunction(this.settings.getButtonText)) {
			return this.settings.getButtonText(this.selectedOptions, this.options, this.texts);
		}
		if (this.selectedOptions.length === 0) {
			return `Select ${this.texts.optionNames}`;
		}
		return `${this.selectedOptions.length} ${this.texts.optionNames} selected`;
	}
}
