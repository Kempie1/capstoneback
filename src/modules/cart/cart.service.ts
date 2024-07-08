import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { CartItem } from './entities/CartItem.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/ShoppingCart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dtos/addToCart.dto';
import { EditProductInCartDto } from './dtos/editProductInCart.dto';
import { RemoveFromCartDto } from './dtos/removeFromCart.dto';
import { Product } from '../products/entities/Product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(ShoppingCart)
        private shoppingCartRepository: Repository<ShoppingCart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
      ) { }

    @UseGuards(JwtAuthGuard)
    getCart(req) {
        return this.shoppingCartRepository.findOne({where:{user: req.user.sub}, relations: ['cartItems']});
    }

    @UseGuards(JwtAuthGuard)
    async addProductToCart(req, body: AddToCartDto) {
        //get the cart from Authenticated user
        let cart = await this.shoppingCartRepository.findOne({where:{user: req.user.sub}, relations: ['cartItems']});
        //check if the product is already in the cart
        let cartItem = await this.cartItemRepository.findOne({ where: { id: body.productId, shoppingCart: cart  } });
        //if it is, update the quantity
        if (cartItem) {
            cartItem.quantity++;
            await this.cartItemRepository.save(cartItem);
        }
        //if it is not, add the product to the cart
        else {
            let product = await this.productsRepository.findOne({ where: { id: body.productId }});
            console.log(product);
            if (!product) {
                throw new BadRequestException("error: product not found");
            }
            cartItem = new CartItem();
            cartItem.product = product
            cartItem.quantity = 1;
            cartItem.shoppingCart = cart;
            await this.cartItemRepository.save(cartItem);
        }

        return "cart updated";
    }

    @UseGuards(JwtAuthGuard)
    async removeProductFromCart(req, body: RemoveFromCartDto) {
        //get the cart from Authenticated user
        let cart = await this.shoppingCartRepository.findOne({where:{user: req.user.sub}, relations: ['cartItems']});
        //check if the product is already in the cart
        let product = await this.cartItemRepository.findOne({ where: { id: body.productId, shoppingCart: cart  } });
        //if it is, remove the product from the cart
        if (product) {
            await this.cartItemRepository.delete(product);
        }
        return "cart updated";
    }

    @UseGuards(JwtAuthGuard)
    async editProductInCart(req, body: EditProductInCartDto) {
        //get the cart from Authenticated user
        let cart = await this.shoppingCartRepository.findOne({where:{user: req.user.sub}, relations: ['cartItems']});
        //check if the product is in the cart
        let product = await this.cartItemRepository.findOne({ where: { id: body.productId, shoppingCart: cart  } });
        //if it is, update the quantity
        if (product) {
            product.quantity = body.newQuantity;
            await this.cartItemRepository.save(product);
        }
        return "cart updated";
    }
}
