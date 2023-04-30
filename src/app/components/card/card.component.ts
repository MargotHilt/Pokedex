import { Component, Input, OnChanges } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'pokemon-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnChanges{
 @Input() pokemonStats: any
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

}
