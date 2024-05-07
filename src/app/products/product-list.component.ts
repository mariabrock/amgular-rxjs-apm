import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, startWith, Subject } from 'rxjs';
import { ProductService } from './product.service';
import { ProductCategoryService } from "../product-categories/product-category.service";

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  public productService = inject(ProductService);
  public productCategoryService = inject(ProductCategoryService);

  constructor() { }

  private categorySelectedSubject = new Subject<number>();
  // private categorySelectedSubject = new BehaviourSubject<number>(0);  requires an initial value!
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsToAdd$,
    this.categorySelectedAction$
      .pipe(
        startWith(0)
      )
  ]).pipe(
      map(([products, selectedCategoryId]) =>
      products.filter((product: any)=>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
      catchError( err => {
        this.errorMessageSubject.next(err);
        return EMPTY
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
