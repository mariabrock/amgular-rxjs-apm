import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Supplier } from '../../suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';
import { catchError, EMPTY, filter, map, Subject } from "rxjs";
import { combineLatest } from "rxjs";

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  productSuppliers: Supplier[] | null = null;

  private productService = inject(ProductService);

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  pageTitle$ = this.product$
    .pipe(
      map(p => p ? `Product Detail for: ${p.productName}` : null)
    )

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  // this combines all streams to make getting info on our template easier
  // vm stands for 'view model'
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ]).pipe(
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) => ({product, productSuppliers, pageTitle}))
    );

  constructor() { }

}
