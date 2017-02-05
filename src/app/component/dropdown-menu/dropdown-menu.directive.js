export default function DropdownMenuDirective() {
	const directive = {
		templateUrl: 'app/component/dropdown-menu/dropdown-menu.template.html',
		controllerAs: '$ctrl',
		replace: true,
	};

	return directive;
}
