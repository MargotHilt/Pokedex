import { Component, Input, OnChanges } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'pokemon-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnChanges{
 @Input() pokemonStats: any
 @Input() idTracker: any
 flavorText: string = ""
 pokemonSpecies: any 

 constructor(private pokemonService: PokemonService) {}
  

  ngOnChanges(){
    this.pokemonService.getPokemons(this.pokemonStats.species.url).subscribe(res => {
      this.pokemonSpecies = res
      for(const lang of this.pokemonSpecies.flavor_text_entries) {
        if(lang.language.name === "en"){
          this.flavorText = lang.flavor_text
          break
        }
      }
    })
  }

  refocus(e: any){
  if((e.shiftKey && e.key === "Tab")){
    window.setTimeout(() => document.getElementById(`${Number(this.idTracker)}`)?.focus(), 0)
    }
    if(e.key === "Tab"){
     document.getElementById(`${Number(this.idTracker) - 1}`)?.focus()
    }
    if(e.keyCode === 37){
      document.getElementById(this.idTracker)?.focus()
    }
  }

}
