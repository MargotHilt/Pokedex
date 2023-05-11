import { Component, Input, SimpleChanges } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { concat } from 'rxjs';
import { switchMap, zipAll } from 'rxjs/operators';

@Component({
  selector: 'pokemon-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent {
  @Input() searchValue!: string 
  pokemons: any[] = []
  url = this.pokemonService.apiBaseUrl
  modalOpen: boolean = false
  pokemonStats : any = {}
  pokemonSpecies: any
  flavorText: string = ""
  idTracker = 1
  scrollActivated: boolean = true
  windowScroll: any = window.scrollY

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
  
  ngOnChanges(changes:SimpleChanges) {
      if(!changes["searchValue"].isFirstChange() && this.searchValue !== ""){
      this.pokemonService.getPokemons("https://pokeapi.co/api/v2/pokemon?limit=100000").pipe(
        switchMap(res => {
            const requests = res.results.reduce((filtered: any ,pokemon: any) => 
            {if(pokemon.name.startsWith(this.searchValue))
              filtered.push(this.pokemonService.getPokemons(pokemon.url))
            return filtered
            }, [])
          return concat<any>(requests).pipe(
            zipAll()
          )
        })
      )
      .subscribe(result => this.pokemons = result)
      this.scrollActivated = false
    }
    else {this.ngOnInit()
          this.scrollActivated = true}
  }

  onScroll(){
    console.log(this.windowScroll)
    if(this.scrollActivated){
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
    })}
  }

  onClick(e: any){
      if(this.pokemonStats.id == e.target.id || !this.modalOpen){
        this.modalOpen = !this.modalOpen
      }
      this.pokemons.forEach(pokemon => {
        if(pokemon.id == e.target.id){
          this.pokemonStats = pokemon
        }
      })
      document.getElementById("card")?.focus()  
  }

  trackKeys(e: any){
    if((e.shiftKey && e.key === "Tab")){
      this.idTracker = Number(e.target.id) - 1
    }
    else if(e.key === "Tab"){
      this.idTracker = Number(e.target.id) + 1
    }
    if(e.keyCode === 39){
      document.getElementById("card")?.focus()
    }
    if(e.keyCode === 40){
      this.idTracker = Number(e.target.id) + 1
      document.getElementById(`${Number(e.target.id) + 1}`)?.focus()
    }
    if(e.keyCode === 38){
      this.idTracker = Number(e.target.id) - 1
      document.getElementById(`${Number(e.target.id) - 1}`)?.focus()
    }
  }

}

window.addEventListener("scroll", () => {
  if(window.scrollY > 60){
    document.getElementById("pokemon-card")!.style.bottom = "15%"
  }
  else document.getElementById("pokemon-card")!.style.bottom = "auto"
})