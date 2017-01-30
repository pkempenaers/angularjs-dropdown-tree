import controller from './option-row.controller';

export default function optionRowComponent() {
	const component = {
		controller,
		templateUrl: 'app/component/option-row/option-row.template.html',
		bindings: {
			option: '<',
			settings: '<',
			selectedOptions: '<',
			optionClicked: '&',
			focusNext: '&',
			focusPrevious: '&',
			catchKeydown: '&',
		},
	};

	return component;
}
