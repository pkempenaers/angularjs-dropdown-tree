import './option-row/option-row.module';
import component from './dropdownTree.component';

angular.module('angularjsDropdownTree', [
	'dropdownTreeOptionRowModule',
])
.component('dropdownTree', component());
