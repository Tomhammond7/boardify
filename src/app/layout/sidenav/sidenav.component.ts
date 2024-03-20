import { Component, HostBinding } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less']
})
export class SidenavComponent {
  constructor(public sidenavService: SidenavService) {}

}
