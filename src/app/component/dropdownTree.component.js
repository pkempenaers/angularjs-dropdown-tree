import controller from './dropdownTree.controller';

export default function dropdownTreeComponent() {
	const component = {
		controller,
		templateUrl: 'app/component/dropdownTree.template.html',
		bindings: {
			options: '<',
			externalTexts: '<?texts',
			externalSelection: '<?selection',
			externalSettings: '<?settings',
			selectionChanged: '&',
		},
	};

	return component;
}
