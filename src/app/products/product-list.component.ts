import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, Subject } from 'rxjs';
import { ProductService } from './product.service';
import { ProductCategoryService } from "../product-categories/product-category.service";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  public productService = inject(ProductService);
  public productCategoryService = inject(ProductCategoryService);

  constructor() { }

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ]).pipe(
      map(([products, selectedCategoryId]) =>
      products.filter((product: any)=>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
      catchError( err => {
        this.errorMessage = err;
        return EMPTY
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );





  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {

  }
}
