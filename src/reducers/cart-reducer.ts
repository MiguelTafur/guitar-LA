import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export type CartActions  = 
{type: 'addToCart', payLoad: {item: Guitar}} |
{type: 'removeItem', payLoad: {id: Guitar['id']}} |
{type: 'increaseQuantity', payLoad: {id: Guitar['id']}} |
{type: 'decreaseQuantity', payLoad: {id: Guitar['id']}} |
{type: 'clearCart'}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState : CartState = {
    data: db,
    cart: initialCart()
}

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if(action.type === 'addToCart') {

        const itemExists = state.cart.find(guitar => guitar.id === action.payLoad.item.id)
        let updateCart : CartItem[] = []
        if(itemExists){ // existe en el carrito
            updateCart = state.cart.map(item => {
                
                if(item.id === action.payLoad.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return {...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                }else {
                    return item
                }     
            })
        } else {
            const newItem : CartItem = {...action.payLoad.item, quantity : 1}
            updateCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updateCart
        }
    }
    if(action.type === 'decreaseQuantity') {
        const cart = state.cart.map(item => {
            if(item.id === action.payLoad.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        return {
            ...state,
            cart
        }
    }
    if(action.type === 'increaseQuantity') {
        const cart = state.cart.map( item => {
        if(item.id === action.payLoad.id && item.quantity < MAX_ITEMS){
            return {
                ...item,
                quantity: item.quantity + 1
            }
        }
        return item
        })
        return {
            ...state,
            cart
        }
    }
    if(action.type === 'removeItem') {
        const cart = state.cart.filter(item => item.id !== action.payLoad.id)
        return {
            ...state,
            cart
        }
    }
    if(action.type === 'clearCart') {
        return {
            ...state,
            cart: []
        }
    }

    return state
}