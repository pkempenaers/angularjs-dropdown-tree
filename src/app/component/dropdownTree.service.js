/*
	eslint class-methods-use-this: "off"
*/
export default class DropdownTreeService {
	getDisplayText(option, settings) {
		return option[settings.displayProperty];
	}

	isFolder(option, settings) {
		return Object.prototype.hasOwnProperty.call(option, settings.childrenProperty) &&
			angular.isArray(option[settings.childrenProperty]);
	}

	getChildOptions(option, settings) {
		return option[settings.childrenProperty];
	}

	isVisible(option, settings, searchText) {
		if (option[settings.childrenProperty] &&
			!this.isVisibleItem(option, settings, searchText)) {
			return option[settings.childrenProperty]
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
}
