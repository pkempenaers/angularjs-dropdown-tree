/*
	eslint class-methods-use-this: "off"
*/
export default class DropdownTreeService {
	getDisplayText(option, settings) {
		return option[settings.displayProperty];
	}

	isFolder(option, settings) {
		return (Object.prototype.hasOwnProperty.call(option, settings.childrenProperty) &&
			angular.isArray(option[settings.childrenProperty])) ||
			(Object.prototype.hasOwnProperty.call(option, settings.subProperty) &&
				angular.isArray(option[settings.subProperty]));
	}

	isSubFolder(option, settings) {
		return Object.prototype.hasOwnProperty.call(option, settings.subProperty) &&
				angular.isArray(option[settings.subProperty]);
	}

	shouldFolderBeOpen(folder, settings, selection) {
		// always open when foldersOpen is true
		if (settings.foldersOpen) {
			return settings.foldersOpen;
		}
		// always closed when not open when innerselected
		if (!settings.openFolderWhenInnerSelected) {
			return false;
		}
		return this.hasInnerSelection(folder, settings, selection);
	}

	getChildOptions(option, settings) {
		if (angular.isDefined(option[settings.childrenProperty])) {
			return option[settings.childrenProperty];
		} else if (angular.isDefined(option[settings.subProperty])) {
			return option[settings.subProperty];
		}
		return undefined;
	}

	selectAllChildOptions(option, settings, currentSelection) {
		const optionsToAdd = this.getOptionsToAdd(option, settings, currentSelection);

		if (optionsToAdd.length === 0) {
			this.removeAllChildOptions(option, settings, currentSelection);
			return true;
		}
		if (settings.selectionLimit === 0) {
			optionsToAdd.forEach((optionToAdd) => {
				currentSelection.push(optionToAdd);
			});
			return true;
		}
		if (optionsToAdd.length + currentSelection.length <= settings.selectionLimit) {
			optionsToAdd.forEach((optionToAdd) => {
				currentSelection.push(optionToAdd);
			});
			return true;
		}

		return false;
	}

	getOptionsToAdd(option, settings, currentSelection) {
		let optionsToAdd = [];
		if (this.isFolder(option, settings)) {
			this.getChildOptions(option, settings)
				.forEach((childOption) => {
					optionsToAdd = optionsToAdd.concat(
						this.getOptionsToAdd(childOption, settings, currentSelection, false),
					);
				});
		} else if (currentSelection.indexOf(option) < 0) {
			optionsToAdd.push(option);
		}

		return optionsToAdd;
	}

	removeAllChildOptions(option, settings, currentSelection) {
		if (this.isFolder(option, settings)) {
			this.getChildOptions(option, settings).forEach((childOption) => {
				this.removeAllChildOptions(childOption, settings, currentSelection);
			});
		} else if (currentSelection.indexOf(option) >= 0) {
			currentSelection.splice(currentSelection.indexOf(option), 1);
		}
	}

	isVisible(option, settings, searchText) {
		if (this.isFolder(option, settings) &&
			!this.isVisibleItem(option, settings, searchText)) {
			return this.getChildOptions(option, settings)
				.some(childOption => this.isVisible(childOption, settings, searchText));
		}
		return this.isVisibleItem(option, settings, searchText);
	}

	isVisibleItem(option, settings, searchText) {
		if (searchText.length > 0) {
			return option[settings.displayProperty].toLowerCase()
				.indexOf(searchText.trim().toLowerCase()) >= 0;
		}
		return true;
	}

	hasInnerSelection(option, settings, selection) {
		if (this.isFolder(option, settings)) {
			return this.getChildOptions(option, settings).some((childOption) => {
				if (selection.indexOf(childOption) >= 0) {
					return true;
				}
				return this.hasInnerSelection(childOption, settings, selection);
			});
		}
		return false;
	}

	getSelection(options, settings, searchText) {
		let selection = [];

		options.forEach((option) => {
			selection = selection.concat(this.getAllChildVisible(option, settings, searchText));
		});

		return selection;
	}

	getAllChildVisible(option, settings, searchText, selectedCollection = []) {
		if (this.isVisible(option, settings, searchText)) {
			if (this.isFolder(option, settings)) {
				if (settings.folderSelectable &&
					this.isVisibleItem(option, settings, searchText)) {
					selectedCollection.push(option);
				}
				this.getChildOptions(option, settings)
				.forEach((childOption) => {
					this.getAllChildVisible(childOption, settings, searchText, selectedCollection);
				});
			} else {
				selectedCollection.push(option);
			}
		}
		return selectedCollection;
	}

	areSameSelections(collection, compareCollection) {
		if (collection.length !== compareCollection.length) {
			return false;
		}
		return !collection.some(option => compareCollection.indexOf(option) < 0);
	}

	isSelectAble(option, settings) {
		if (!this.isFolder(option, settings)) {
			return true;
		}
		return settings.folderSelectable;
	}
}
