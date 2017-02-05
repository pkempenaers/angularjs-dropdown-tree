export default function DropdownToggleDirective() {
	const directive = {
		templateUrl: 'app/component/dropdown-toggle/dropdown-toggle.template.html',
		require: '^dropdownTree',
		controllerAs: '$ctrl',
	};

	return directive;
}
