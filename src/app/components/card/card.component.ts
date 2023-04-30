import { Component, Input } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'pokemon-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {
 @Input() pokemonSpecies: any
 @Input() pokemonStats: any


 constructor(private pokemonService: PokemonService) {}



}
