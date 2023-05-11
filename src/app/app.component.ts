import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pokedex';
  searchValue: string = ""

  setSearchValue(e: any){
    this.searchValue = e.target.value
  }

}
