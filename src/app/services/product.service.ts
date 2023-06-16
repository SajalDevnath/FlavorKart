import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient) {}
  addProduct(data: product) {
    return this.http.post('https://json-server-vercel-eight-steel.vercel.app/products', data);
  }
  productList() {
    return this.http.get<product[]>('https://json-server-vercel-eight-steel.vercel.app/products');
  }
  deleteProduct(id: number) {
    return this.http.delete(`https://json-server-vercel-eight-steel.vercel.app/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`https://json-server-vercel-eight-steel.vercel.app/products/${id}`);
  }
  updateProduct(product: product) {
    console.warn(product);
    return this.http.put<product>(
      `https://json-server-vercel-eight-steel.vercel.app/products/${product.id}`,
      product
    );
  }
  popularProducts() {
    return this.http.get<product[]>('https://json-server-vercel-eight-steel.vercel.app/products?_limit=3');
  }

  kitchenBasics() {
    return this.http.get<product[]>('https://json-server-vercel-eight-steel.vercel.app/products?_limit=8');
  }

  searchProducts(query: string) {
    return this.http.get<product[]>(
      `https://json-server-vercel-eight-steel.vercel.app/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  RemoveitemfromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((items: product) => productId !== items.id);
      // console.warn(items);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  AddToCart(cartData: cart) {
    return this.http.post('https://json-server-vercel-eight-steel.vercel.app/cart', cartData);
  }

  getCartList(userId: number) {
    return this.http
      .get<product[]>('https://json-server-vercel-eight-steel.vercel.app/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        console.warn(result);

        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete('https://json-server-vercel-eight-steel.vercel.app/cart/' + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(
      'https://json-server-vercel-eight-steel.vercel.app/cart?userId=' + userData.id
    );
  }

  orderNow(data: order) {
    return this.http.post('https://json-server-vercel-eight-steel.vercel.app/orders', data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(
      'https://json-server-vercel-eight-steel.vercel.app/orders?userId=' + userData.id
    );
  }

  deleteCartItems(cartId: number) {
    return this.http
      .delete('https://json-server-vercel-eight-steel.vercel.app/cart/' + cartId, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          this.cartData.emit([]);
        }
      });
  }

  cancelOrder(orderId: number) {
    return this.http.delete('https://json-server-vercel-eight-steel.vercel.app/orders/' + orderId);
  }
}
