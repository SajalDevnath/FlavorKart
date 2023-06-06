import { Component, OnInit } from '@angular/core';
import { Login, SignUp, cart, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = '';
  constructor(private user: UserService, private product: ProductService) {}
  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(data: SignUp) {
    // console.warn(data);
    this.user.userSignUp(data);
  }

  login(data: Login) {
    this.user.userLogin(data);
    this.user.invalidUserAuth.subscribe((result) => {
      console.warn('rice', result);
      if (result) {
        this.authError = 'Please enter valid user details';
      } else {
        setTimeout(() => {
          this.localCartToRemoteCart();
        }, 500);
      }
    });
  }

  openSignUp() {
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
  }
  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    if (data) {
      let cartDataList: product[] = JSON.parse(data);
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;

      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId,
        };

        delete cartData.id;
        setTimeout(() => {
          this.product.AddToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn('item stored in db');
            }
          });
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }
  }
}
