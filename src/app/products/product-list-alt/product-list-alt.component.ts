import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { catchError, EMPTY, Subject } from 'rxjs';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private productService = inject(ProductService);

  //stream of all products
  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  // stream that emits the selected product when it changes
  selectedProduct$ = this.productService.selectedProduct$

  constructor() { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
