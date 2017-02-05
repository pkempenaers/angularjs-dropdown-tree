import './option-row/option-row.module';
import Service from './dropdownTree.service';
import toggleDirective from './dropdown-toggle/dropdown-toggle.directive';
import menuDirective from './dropdown-menu/dropdown-menu.directive';
import component from './dropdownTree.component';

angular.module('angularjsDropdownTree', [
	'dropdownTreeOptionRowModule',
])
.service('dropdownTreeService', Service)
.directive('dtDropdownToggle', toggleDirective)
.directive('dtDropdownMenu', menuDirective)
.component('dropdownTree', component());
