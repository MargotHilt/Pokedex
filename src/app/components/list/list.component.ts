import { Component } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { concat} from 'rxjs';
import {switchMap, zipAll } from 'rxjs/operators';

@Component({
  selector: 'pokemon-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent {
  pokemons: any[] = []
  url = this.pokemonService.apiBaseUrl
  modalOpen: boolean = false
  pokemonStats : any = {}
  pokemonSpecies: any

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons(this.pokemonService.apiBaseUrl).pipe(
        switchMap(res => {
          const requests = res.results.map((pokemon: any) => 
            this.pokemonService.getPokemons(pokemon.url)
          )
          return concat<any>(requests).pipe(
            zipAll()
          )
        })
      )
      .subscribe(result => this.pokemons = result)
  }
  
  onScroll(){
    console.log(this.pokemons)
    this.pokemonService.getPokemons(this.url).subscribe(res => {
      this.url = res.next
      this.pokemonService.getPokemons(this.url).pipe(
        switchMap(res => {
          const requests = res.results.map((pokemon: any) => 
            this.pokemonService.getPokemons(pokemon.url)
          )
          return concat<any>(requests).pipe(
            zipAll()
          )
        })
      )
      .subscribe(result => this.pokemons = this.pokemons.concat(result))
    })  
  }

  retrievePokemon(e: any){ 
    this.pokemons.forEach(pokemon => {
      if(pokemon.id == e.target.id){
        this.pokemonStats = pokemon
      }
    })
    this.pokemonService.getPokemons(this.pokemonStats.species.url).subscribe(res => {
      this.pokemonSpecies = res
    })
  }

  onClick(e: any){
      if(this.pokemonStats.id == e.target.id || !this.modalOpen){
        this.modalOpen = !this.modalOpen
      }
      this.retrievePokemon(e)
  }
}