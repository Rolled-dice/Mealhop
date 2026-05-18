import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgottonPassword from "./pages/ForgottonPassword";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import AvailableOrders from "./pages/delivery/AvailableOrders";
import MyOrders from "./pages/delivery/MyOrders";
import Earnings from "./pages/delivery/Earnings";
import DeliveryMap from "./pages/delivery/DeliveryMap";
import AIChat from "./components/AIChat";
import MenuManagement from "./pages/owner/MenuManagement";
import OwnerOrders from "./pages/owner/OwnerOrders";

export const url = "http://localhost:8000";
const App = () => {
  return (
    <>
      <AIChat />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgottonPassword />} />
        
        {/* User Routes */}
        <Route path="/restaurants" element={<div className="min-h-screen p-8"><h1 className="text-2xl">Restaurants - Coming Soon</h1></div>} />
        <Route path="/orders" element={<div className="min-h-screen p-8"><h1 className="text-2xl">My Orders - Coming Soon</h1></div>} />
        <Route path="/payment" element={<Payment />} />
        
        {/* Delivery Boy Routes */}
        <Route path="/delivery/orders" element={<AvailableOrders />} />
        <Route path="/delivery/my-orders" element={<MyOrders />} />
        <Route path="/delivery/earnings" element={<Earnings />} />
        <Route path="/delivery/map" element={<DeliveryMap />} />
        
        {/* Owner Routes */}
        <Route path="/owner/menu" element={<MenuManagement />} />
        <Route path="/owner/orders" element={<OwnerOrders />} />
        <Route path="/owner/analytics" element={<div className="min-h-screen p-8"><h1 className="text-2xl">Analytics - Coming Soon</h1></div>} />
      </Routes>
    </>
  );
};

export default App;