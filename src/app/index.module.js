import './component/dropdownTree.module';
import component from './main/main.component';

angular.module('angularjsExampleDropdownTree', [
	'angularjsDropdownTree',
])
.component('main', component());
