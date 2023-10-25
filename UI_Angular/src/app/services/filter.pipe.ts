import { Pipe, PipeTransform } from '@angular/core';
import { Aluno } from '..//services/api-crud.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Aluno[], searchText: string): Aluno[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(it => {
      return it.nome.toLowerCase().includes(searchText); 
      // Supondo que você queira pesquisar pelo nome do aluno.
    });
  }
}
