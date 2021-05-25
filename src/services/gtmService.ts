import { GTM_ID } from '../config/settings'
import TagManager from 'react-gtm-module'
import { replaceWrapperTokenToToken } from '../utils'
import { BigNumber } from 'bignumber.js'
import { Token } from '..'
import { store } from './reduxService'

class GTMService {
  constructor() {
    const tagManagerArgs = {
      gtmId: GTM_ID,
    }

    TagManager.initialize(tagManagerArgs)
  }

  // events for GA3
  public v3 = {
    viewProductDetails: this.viewProductDetailsV3.bind(this),
    addToCart: this.addToCartV3.bind(this),
    beginCheckout: this.beginCheckoutV3.bind(this),
    purchase: this.purchaseV3.bind(this),
    refund: this.refundV3.bind(this),
  }

  // events for GA4
  public v4 = {
    viewProductDetails: this.viewProductDetailsV4.bind(this),
    addToCart: this.addToCartV4.bind(this),
    beginCheckout: this.beginCheckoutV4.bind(this),
    purchase: this.purchaseV4.bind(this),
    refund: this.refundV4.bind(this),
  }

  public viewProductDetailsV3(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'eec.detail',
        ecommerce: {
          detail: {
            actionField: {
              list: 'Token page',
            },
            products: [
              {
                id: productId,
                name: productName,
              },
            ],
          },
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  public viewProductDetailsV4(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const tokenFrom = this.getTokenFrom(currentToken, quoteToken)
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'view_item',
        ecommerce: {
          items: [
            {
              item_id: productId,
              item_name: productName,
              item_brand: replaceWrapperTokenToToken(tokenFrom.symbol),
              quantity: '1',
            },
          ],
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  public addToCartV3(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'eec.add',
        ecommerce: {
          add: {
            actionField: {
              list: 'Verify your token swap',
            },
            products: [
              {
                id: productId, // actual product id
                name: productName, // product name/title
                quantity: 1,
              },
            ],
          },
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }
  public addToCartV4(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const tokenFrom = this.getTokenFrom(currentToken, quoteToken)
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'add_to_cart',
        ecommerce: {
          items: [
            {
              item_id: productId,
              item_name: productName,
              item_brand: replaceWrapperTokenToToken(tokenFrom.symbol),
              quantity: '1',
            },
          ],
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  public beginCheckoutV3(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'eec.checkout',
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
            },
            products: [
              {
                id: productId, // actual product id
                name: productName, // product name/title
                quantity: 1,
              },
            ],
          },
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }
  public beginCheckoutV4(currentToken: Token, quoteToken: Token) {
    const productId = currentToken.id
    const tokenFrom = this.getTokenFrom(currentToken, quoteToken)
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'begin_checkout',
        ecommerce: {
          items: [
            {
              item_id: productId,
              item_name: productName,
              item_brand: replaceWrapperTokenToToken(tokenFrom.symbol),
              quantity: '1',
            },
          ],
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  public purchaseV3(
    txnId: string,
    tip: number,
    volumeUSD: BigNumber,
    currentToken: Token,
    quoteToken: Token
  ) {
    const productId = currentToken.id
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'eec.purchase',
        ecommerce: {
          currencyCode: 'USD',
          purchase: {
            actionField: {
              id: txnId,
              affiliation: currentToken.network.toUpperCase(),
              shipping: volumeUSD
                .times(tip / 100)
                .dp(2, BigNumber.ROUND_HALF_UP)
                .toFixed(), // $ Tips
            },
            products: [
              {
                id: productId,
                name: productName,
                quantity: 1,
                price: volumeUSD.dp(2, BigNumber.ROUND_HALF_UP).toFixed(),
              },
            ],
          },
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }
  public purchaseV4(
    txnId: string,
    tip: number,
    volumeUSD: BigNumber,
    currentToken: Token,
    quoteToken: Token
  ) {
    const productId = currentToken.id
    const tokenFrom = this.getTokenFrom(currentToken, quoteToken)
    const productName = this.getProductName(currentToken, quoteToken)
    const tagManagerArgs = {
      dataLayer: {
        event: 'purchase',
        ecommerce: {
          transaction_id: txnId, // actual order ID from the database
          currency: 'USD',
          value: volumeUSD.dp(2, BigNumber.ROUND_HALF_UP).toFixed(), // with two digits after the decimal point
          shipping: volumeUSD
            .times(tip / 100)
            .dp(2, BigNumber.ROUND_HALF_UP)
            .toFixed(), // $ Tips
          affiliation: currentToken.network.toUpperCase(), // wallet type or name, if available
          items: [
            {
              item_id: productId,
              item_name: productName,
              item_brand: replaceWrapperTokenToToken(tokenFrom.symbol),
              price: volumeUSD.dp(2, BigNumber.ROUND_HALF_UP).toFixed(),
              quantity: '1',
            },
          ],
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  public refundV3(txnId: string) {
    const tagManagerArgs = {
      dataLayer: {
        event: 'eec.refund',
        ecommerce: {
          refund: {
            actionField: {
              id: txnId,
            },
          },
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }
  public refundV4(txnId: string) {
    const tagManagerArgs = {
      dataLayer: {
        event: 'refund',
        ecommerce: {
          transaction_id: txnId,
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }

  private getProductName = (currentToken: Token, quoteToken: Token) => {
    const { activeTradeType } = store.getState()
    const tokenFromSymbol = activeTradeType === 'Buy' ? quoteToken.symbol : currentToken.symbol
    const tokenToSymbol = activeTradeType === 'Buy' ? currentToken.symbol : quoteToken.symbol
    const productName = `${replaceWrapperTokenToToken(
      tokenFromSymbol
    )}-${replaceWrapperTokenToToken(tokenToSymbol)}`
    return productName
  }

  private getTokenFrom = (currentToken: Token, quoteToken: Token): Token => {
    const { activeTradeType } = store.getState()
    const tokenFrom = activeTradeType === 'Buy' ? quoteToken : currentToken
    return tokenFrom
  }
}

export default new GTMService()
