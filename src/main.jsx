import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { CheckoutProvider } from './context/CheckoutContext'
import { WishlistProvider } from './context/WishlistContext'
import { UserProfileProvider } from './context/UserProfileContext'
import { ReviewProvider } from './context/ReviewContext'
import { RecommendationProvider } from './context/RecommendationContext'
import { SocialProvider } from './context/SocialContext'
import { NotificationProvider } from './context/NotificationContext'
import { ValidationProvider } from './context/ValidationContext'
import { SubscriptionProvider } from './context/SubscriptionContext' // ← Nueva importación
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ValidationProvider>
        <AuthProvider>
          <SubscriptionProvider> {/* ← Agrega el SubscriptionProvider aquí */}
            <CartProvider>
              <CheckoutProvider>
                <WishlistProvider>
                  <UserProfileProvider>
                    <ReviewProvider>
                      <RecommendationProvider>
                        <SocialProvider>
                          <NotificationProvider>
                            <App />
                          </NotificationProvider>
                        </SocialProvider>
                      </RecommendationProvider>
                    </ReviewProvider>
                  </UserProfileProvider>
                </WishlistProvider>
              </CheckoutProvider>
            </CartProvider>
          </SubscriptionProvider> {/* ← Cierra el SubscriptionProvider */}
        </AuthProvider>
      </ValidationProvider>
    </BrowserRouter>
  </React.StrictMode>,
)