import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItem } from './entities/CartItem.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/ShoppingCart.entity';
import { AddToCartDto } from './dtos/addToCart.dto';
import { EditProductInCartDto } from './dtos/editProductInCart.dto';
import { RemoveFromCartDto } from './dtos/removeFromCart.dto';
import { Product } from '../products/entities/Product.entity';
import { ProductsService } from '../products/products.service';

import {
  CaseFormFactorEnum,
  MotherboardFormFactorEnum,
  CPUSocketDDRSupportEnum,
  GPUChipsetTDP,
} from '../utils/enums';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly productService: ProductsService,
  ) {}

  async getCart(req, getUser?: boolean, getFullProduct?: boolean) {
    const relations = ['cartItems'];
    if (getUser) {
      relations.push('user');
    }
    if (getFullProduct) {
      relations.push('cartItems.product');
      relations.push('cartItems.product.productCharacteristics');
    }
    return await this.shoppingCartRepository.findOne({
      where: { user: req.user.sub },
      relations: relations,
    });
  }

  async clearCart(user) {
    const cart = await this.shoppingCartRepository.findOne({
      where: { user: user },
      relations: ['cartItems'],
    });
    cart.cartItems = [];
    await this.shoppingCartRepository.save(cart);
    return 'cart cleared';
  }

  async compatibilityCheck(req) {
    const cart = await this.getCart(req, false, true);
    const cartItems = cart.cartItems;
    let compatability = true;

    // Group items by category for easier processing
    const groupedItems = this.groupItemsByCategory(cartItems);

    const relevantCategories = [
      'cpu',
      'motherboard',
      'memory',
      'case',
      'power-supply',
      'video-card',
    ];
    for (const category of relevantCategories) {
      if (groupedItems[category]?.length > 1) {
        return `Please ensure only one ${category} is added to the cart for compatibility check.`;
      }
    }

    // Extract relevant items
    const cpu = groupedItems['cpu']?.[0];
    const motherboard = groupedItems['motherboard']?.[0];
    const memory = groupedItems['memory']?.[0];
    const caseItem = groupedItems['case']?.[0];
    const psu = groupedItems['power-supply']?.[0];
    const gpu = groupedItems['video-card']?.[0];
    const compatibilityIssues = [];

    // Step 2: Check CPU and Motherboard Socket Compatibility
    if (cpu && motherboard && cpu.socket !== motherboard.socket) {
      compatibilityIssues.push('CPU and Motherboard sockets do not match.');
    }

    // Assuming we have a function `isFormFactorCompatible` to check compatibility
    if (motherboard && caseItem) {
      if (
        !(motherboard.form_factor in MotherboardFormFactorEnum) ||
        !(caseItem.type in CaseFormFactorEnum)
      ) {
        compatibilityIssues.push(
          'Motherboard form factor or case type is not widely used, please check compatibility manually.',
        );
        compatability = false;
      }
      if (
        MotherboardFormFactorEnum[motherboard.form_factor] <=
        CaseFormFactorEnum[caseItem.type]
      )
        compatibilityIssues.push(
          'Motherboard form factor and case type are not compatible.',
        );
      compatability = false;
    }

    // Check if motherboard has wifi in the name
    if (motherboard) {
      if (
        !motherboard.name.toLowerCase().includes('wifi') &&
        !groupedItems['wireless-network-card']
      ) {
        compatibilityIssues.push(
          "Motherboard doesn't have wifi, consider adding a wireless network card or a different motherboard",
        );
        compatability = false;
      }
    }

    // Check if motherboard has enough ram slots
    if (motherboard && memory) {
      const memoryModules = memory.modules.split(','); // [0] is amount of modules, [1] is capacity per module
      if (
        memory.capacity > motherboard.maxMemory ||
        memoryModules[0] > motherboard.memorySlots
      ) {
        compatibilityIssues.push(
          'Memory capacity or number of modules exceeds motherboard limits.',
        );
        compatability = false;
      }
    }

    // Check if DDR type is supported by motherboard
    if (memory && motherboard) {
      const socketMemorySupport = CPUSocketDDRSupportEnum[motherboard.socket];
      const memoryType = 'DDR' + memory.speed.split(',')[0];
      if (socketMemorySupport === undefined) {
        compatibilityIssues.push(
          'Motherboard socket type is not recognized. Please check manually',
        );
        compatability = false;
      } else if (
        socketMemorySupport == 'DDR5 || DDR4' &&
        (memoryType == 'DDR5' || memoryType == 'DDR4')
      ) {
        compatibilityIssues.push(
          'Memory type could be supported by your motherboard, but please check manually.',
        );
        compatability = false;
      } else if (memoryType !== socketMemorySupport) {
        compatibilityIssues.push(
          'Memory type is not supported by motherboard.',
        );
        compatability = false;
      }
    }

    // Check if PSU wattage is enough
    if (psu && (gpu || cpu)) {
      let totalWattage = 0;
      let gpuTDP = 0;
      if (gpu) gpuTDP = Number(GPUChipsetTDP[gpu.chipset]);
      if (gpuTDP === undefined) {
        compatibilityIssues.push(
          'GPU chipset is not recognized. Please check manually.',
        );
        compatability = false;
        totalWattage += gpu.powerConsumption;
        if (cpu) totalWattage += cpu.tdp;
        if (totalWattage > psu.wattage) {
          compatibilityIssues.push(
            'Power Supply wattage is not enough for the components in your cart.',
          );
          compatability = false;
        } else {
          compatibilityIssues.push(
            'Power Supply wattage is probably enough for the components in your cart.',
          );
        }
      }
      compatibilityIssues.push(
        'Power Supply wattage is just an estimate. And its a good idea to have a surplass of 100-200 watts',
      );
    }

    const result = {
      cart: cart,
      compatibilityIssues: compatibilityIssues,
      compatibilityStatus: compatability,
    };
    return result;
  }

  // Helper function to group items by category
  groupItemsByCategory(cartItems) {
    return cartItems.reduce((acc, item) => {
      const category = item.product.categories[0].name;
      if (!acc[category]) acc[category] = [];

      acc[category].push(this.productService.flattenProduct(item.product));
      return acc;
    }, {});
  }

  async addProductToCart(req, body: AddToCartDto) {
    //get the cart from Authenticated user
    const cart = await this.shoppingCartRepository.findOne({
      where: { user: req.user.sub },
      relations: ['cartItems'],
    });
    //check if the product is already in the cart
    let cartItem = await this.cartItemRepository.findOne({
      where: { id: body.productId, shoppingCart: cart },
    });
    //if it is, update the quantity
    if (cartItem) {
      cartItem.quantity++;
      await this.cartItemRepository.save(cartItem);
    }
    //if it is not, add the product to the cart
    else {
      const product = await this.productsRepository.findOne({
        where: { id: body.productId },
      });
      if (!product) {
        throw new BadRequestException('error: product not found');
      }
      cartItem = new CartItem();
      cartItem.product = product;
      cartItem.quantity = 1;
      cartItem.shoppingCart = cart;
      await this.cartItemRepository.save(cartItem);
    }

    return 'cart updated';
  }

  async removeProductFromCart(req, body: RemoveFromCartDto) {
    //get the cart from Authenticated user
    const cart = await this.shoppingCartRepository.findOne({
      where: { user: req.user.sub },
      relations: ['cartItems'],
    });
    //check if the product is already in the cart
    const index = cart.cartItems.findIndex(
      (item) => item.id === body.productId,
    );
    if (index != -1) {
      cart.cartItems.splice(index, 1);
    }
    await this.shoppingCartRepository.save(cart);
    return 'cart updated';
  }

  async editProductInCart(req, body: EditProductInCartDto) {
    //get the cart from Authenticated user
    const cart = await this.shoppingCartRepository.findOne({
      where: { user: req.user.sub },
      relations: ['cartItems'],
    });
    //check if the product is in the cart
    const product = await this.cartItemRepository.findOne({
      where: { id: body.productId, shoppingCart: cart },
    });
    //if it is, update the quantity
    if (product) {
      product.quantity = body.newQuantity;
      await this.cartItemRepository.save(product);
    }
    return 'cart updated';
  }
}
