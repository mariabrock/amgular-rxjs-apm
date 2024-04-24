import { Component, inject } from '@angular/core';

import { catchError, EMPTY } from 'rxjs';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;

  public productService = inject(ProductService);

  constructor() { }

  products$ = this.productService.products$$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )

  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
