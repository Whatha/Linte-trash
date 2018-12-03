import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  title;
  description;
 
  itemValue = '';
  items: Observable<any[]>;
  labels;

   constructor(public db: AngularFireDatabase) {

    this.items = db.list('items').valueChanges();


  db.object('/number')
    .valueChanges()
    .subscribe(res => {
        console.log(res)//should give you the array of percentage. 
        this.description = res;
    });
    db.object('/message')
    .valueChanges()
    .subscribe(res => {
        console.log(res)//should give you the array of percentage. 
        this.title = res;

    });
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
}
