import './option-row/option-row.module';
import Service from './dropdownTree.service';
import component from './dropdownTree.component';

angular.module('angularjsDropdownTree', [
	'dropdownTreeOptionRowModule',
])
.service('dropdownTreeService', Service)
.component('dropdownTree', component());
